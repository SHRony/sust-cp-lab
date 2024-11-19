-- CreateTable
CREATE TABLE "sust_cp_lab_team_forming_contests" (
    "id" SERIAL NOT NULL,
    "contest_id" INTEGER NOT NULL,
    "vjudge_contest_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "sust_cp_lab_team_forming_contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_vjudge_contests" (
    "id" SERIAL NOT NULL,
    "vjudge_id" VARCHAR(100) NOT NULL,
    "is_result_available" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sust_cp_lab_vjudge_contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sust_cp_lab_vjudge_submissions" (
    "id" SERIAL NOT NULL,
    "vjudge_contest_id" INTEGER NOT NULL,
    "vjudge_handle" VARCHAR(255) NOT NULL,
    "problem_no" VARCHAR(10) NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sust_cp_lab_vjudge_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sust_cp_lab_team_forming_contests_contest_id_vjudge_contest_key" ON "sust_cp_lab_team_forming_contests"("contest_id", "vjudge_contest_id");

-- CreateIndex
CREATE UNIQUE INDEX "sust_cp_lab_vjudge_contests_vjudge_id_key" ON "sust_cp_lab_vjudge_contests"("vjudge_id");

-- CreateIndex
CREATE INDEX "sust_cp_lab_vjudge_submissions_vjudge_contest_id_vjudge_han_idx" ON "sust_cp_lab_vjudge_submissions"("vjudge_contest_id", "vjudge_handle");

-- AddForeignKey
ALTER TABLE "sust_cp_lab_team_forming_contests" ADD CONSTRAINT "sust_cp_lab_team_forming_contests_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "sust_cp_lab_contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sust_cp_lab_team_forming_contests" ADD CONSTRAINT "sust_cp_lab_team_forming_contests_vjudge_contest_id_fkey" FOREIGN KEY ("vjudge_contest_id") REFERENCES "sust_cp_lab_vjudge_contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sust_cp_lab_vjudge_submissions" ADD CONSTRAINT "sust_cp_lab_vjudge_submissions_vjudge_contest_id_fkey" FOREIGN KEY ("vjudge_contest_id") REFERENCES "sust_cp_lab_vjudge_contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
