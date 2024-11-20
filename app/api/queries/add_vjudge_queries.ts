import prisma from "@/app/api/dbclient";
import axios from "axios";

interface VjudgeContestResponse {
    id: number;
    title: string;
    begin: number;
    length: number;
    isReplay: boolean;
    participants: {
        [key: string]: [string, string, string] // [username, displayName, avatarUrl]
    };
    submissions: (number | string)[][]; // [userId, problemIndex, status, time, ...optional]
}

export const crawlAndStoreVjudgeResults = async (vjudgeId: string) => {
    try {
        // First, get the contest from our database
        const contest = await prisma.sust_cp_lab_vjudge_contests.findUnique({
            where: {
                vjudge_id: vjudgeId
            }
        });

        if (!contest) {
            throw new Error(`Contest with VJudge ID ${vjudgeId} not found in database`);
        }

        // Get all users with VJudge handles from our database
        const usersWithVjudgeHandles = await prisma.sust_cp_lab_student_info.findMany({
            where: {
                NOT: {
                    vjudge_handle: null
                }
            },
            select: {
                vjudge_handle: true
            }
        });

        const vjudgeHandles = new Set(usersWithVjudgeHandles.map(user => user.vjudge_handle));

        // Fetch submissions from VJudge API
        const response = await axios.get(`https://vjudge.net/contest/rank/single/${vjudgeId}`);
        const contestData: VjudgeContestResponse = response.data;
        if (!contestData || !contestData.submissions) {
            throw new Error('Failed to fetch submissions from VJudge');
        }
        // Create a map of user IDs to usernames
        const userIdToUsername = new Map(
            Object.entries(contestData.participants).map(([userId, [username]]) => [userId, username])
        );
        // Filter and transform submissions
        const submissionsToUpsert = contestData.submissions
            .filter(sub => {
                const username = userIdToUsername.get(sub[0].toString());
                return username && vjudgeHandles.has(username);
            })
            .map(sub => {
                const username = userIdToUsername.get(sub[0].toString())!;
                const problemIndex = sub[1] as number;
                const isAccepted = sub[2] === 1;
                const submitTime = new Date(contestData.begin + (sub[3] as number) * 1000);

                return {
                    vjudge_contest_id: contest.id,
                    vjudge_handle: username,
                    problem_no: String.fromCharCode(65 + problemIndex), // Convert 0 to 'A', 1 to 'B', etc.
                    is_accepted: isAccepted,
                    submission_time: submitTime,
                };
            });

        // Update contest start time and duration if not set
        await prisma.sust_cp_lab_vjudge_contests.update({
            where: {
                id: contest.id
            },
            data: {
                start_time: new Date(contestData.begin),
                duration_seconds: Math.floor(contestData.length / 1000)
            }
        });

        // Bulk upsert submissions
        for (const submission of submissionsToUpsert) {
            await prisma.sust_cp_lab_vjudge_submissions.upsert({
                where: {
                    vjudge_contest_id_vjudge_handle_problem_no_submission_time: {
                        vjudge_contest_id: submission.vjudge_contest_id,
                        vjudge_handle: submission.vjudge_handle,
                        problem_no: submission.problem_no,
                        submission_time: submission.submission_time
                    }
                },
                update: {
                    is_accepted: submission.is_accepted
                },
                create: submission
            });
        }

        // Update contest status
        await prisma.sust_cp_lab_vjudge_contests.update({
            where: {
                id: contest.id
            },
            data: {
                is_result_available: true
            }
        });

        return {
            success: true,
            message: `Successfully processed ${submissionsToUpsert.length} submissions`,
            submissionsCount: submissionsToUpsert.length
        };

    } catch (error) {
        console.error('Error in crawlAndStoreVjudgeResults:', error);
        throw error;
    }
}

export async function getTfcRanks(contestId: number) {
  const results = await prisma.sust_cp_lab_team_forming_contests.findMany({
    where: {
      contest_id: contestId,
    },
    select: {
      id: true,
      name: true,
      vjudge_contest_id: true,
      sust_cp_lab_vjudge_contests: {
        select: {
          start_time: true,
          duration_seconds: true,
          sust_cp_lab_vjudge_submissions: {
            select: {
              vjudge_handle: true,
              problem_no: true,
              submission_time: true,
              is_accepted: true,
            },
            orderBy: {
              submission_time: 'asc'
            }
          },
        },
      },
    },
  });

  // Get all registered users for this contest
  const registeredUsers = await prisma.sust_cp_lab_contestregistrations.findMany({
    where: {
      contest_id: contestId,
    },
    select: {
      user_name: true,
    },
  });

  // Get student info for all registered users
  const studentInfo = await prisma.sust_cp_lab_student_info.findMany({
    where: {
      username: {
        in: registeredUsers.map(u => u.user_name),
      },
    },
  });

  // Process results for each team forming contest
  const processedResults = results.map(tfc => {
    const vjudgeContest = tfc.sust_cp_lab_vjudge_contests;
    const submissions = vjudgeContest.sust_cp_lab_vjudge_submissions;
    const contestEndTime = new Date(vjudgeContest.start_time.getTime() + vjudgeContest.duration_seconds * 1000);
    
    // Group submissions by vjudge handle and problem
    const userProblemSubmissions = new Map<string, Map<string, {
      solved: boolean,
      firstAcceptedTime: number | null,
      wrongSubmissions: number
    }>>();

    // Process submissions in chronological order
    submissions.forEach(sub => {
      // Skip submissions after contest end
      if (sub.submission_time > contestEndTime) return;

      if (!userProblemSubmissions.has(sub.vjudge_handle)) {
        userProblemSubmissions.set(sub.vjudge_handle, new Map());
      }
      
      const userProblems = userProblemSubmissions.get(sub.vjudge_handle)!;
      
      if (!userProblems.has(sub.problem_no)) {
        userProblems.set(sub.problem_no, {
          solved: false,
          firstAcceptedTime: null,
          wrongSubmissions: 0
        });
      }

      const problemStats = userProblems.get(sub.problem_no)!;
      
      // Only process if problem not already solved
      if (!problemStats.solved) {
        if (sub.is_accepted) {
          problemStats.solved = true;
          problemStats.firstAcceptedTime = Math.floor((sub.submission_time.getTime() - vjudgeContest.start_time.getTime()) / (60 * 1000)); // Convert to minutes
        } else {
          problemStats.wrongSubmissions++;
        }
      }
    });

    // Calculate rankings
    const rankings = Array.from(userProblemSubmissions.entries())
      .map(([vjudge_handle, problems]) => {
        const student = studentInfo.find(s => s.vjudge_handle === vjudge_handle);
        if (!student) return null;

        let solved = 0;
        let penalty = 0;

        problems.forEach(stats => {
          if (stats.solved) {
            solved++;
            penalty += stats.firstAcceptedTime! + (stats.wrongSubmissions * 20);
          }
        });

        return {
          user_id: student.username,
          name: student.full_name,
          username: student.username,
          email: '',
          rank: 0,
          solved,
          penalty,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => {
        if (b.solved !== a.solved) return b.solved - a.solved;
        return a.penalty - b.penalty;
      });

    // Assign ranks
    let currentRank = 1;
    let currentSolved = -1;
    let currentPenalty = -1;
    rankings.forEach((ranking, index) => {
      if (ranking.solved !== currentSolved || ranking.penalty !== currentPenalty) {
        currentRank = index + 1;
        currentSolved = ranking.solved;
        currentPenalty = ranking.penalty;
      }
      ranking.rank = currentRank;
    });

    return {
      tfc_id: tfc.id,
      tfc_name: tfc.name,
      rankings,
    };
  });

  return processedResults;
}

export async function getTfcs(contestId: number) {
  const tfcs = await prisma.sust_cp_lab_team_forming_contests.findMany({
    where: {
      contest_id: contestId
    },
    include: {
      sust_cp_lab_vjudge_contests: true
    }
  });

  return tfcs.map(tfc => ({
    id: tfc.id,
    contest_id: tfc.contest_id,
    vjudge_contest_id: tfc.vjudge_contest_id,
    name: tfc.name,
    vjudge_contest: {
      vjudge_id: tfc.sust_cp_lab_vjudge_contests.vjudge_id,
      is_result_available: tfc.sust_cp_lab_vjudge_contests.is_result_available
    }
  }));
}
