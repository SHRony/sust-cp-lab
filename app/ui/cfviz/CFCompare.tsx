import axios from 'axios';
import { useEffect, useState } from 'react';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import { cfUserType, ratingChangeType } from '@/app/lib/types';
import Card from '@/app/ui/cards/Card';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import { borderColors, backgroundColors } from "@/app/lib/colors";
import DifficultyCompareChart from './DifficultyCompareChart';
import CategoryCompareChart from './CategoryCompareChart';
import CumulativeDifficultyCompareChart from './CumulativeDifficultyCompareChart';
import CombinedScatterChart from './CombinedScatterChart';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab } from '@mui/material';
import { Trophy, Activity, BarChart2, FolderTree, TrendingUp, Clock, Target } from 'lucide-react';
import Link from 'next/link';

interface TFCData {
  id: string;
  name: string;
  solveCount: number;
}

interface UserTFCData {
  username: string;
  tfcs: TFCData[];
  totalSolves: number;
}

export default function CFCompare ({users, tfcData} : {users : string[], tfcData?: UserTFCData[]}) {
  const [cfUsers, setCFUsers] = useState<cfUserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getUserInfo = async (username : string) => {
    setLoading(true);
    const res = await axios.get(`/api/userinfo?name=${username}`);
    if(res.data){
      const handles = res.data.user.cfHandles?.join(',') ?? '';
      const cfRes = await axios.get(`/api/external/cfuserinfo?user=${handles}`);
      if(cfRes.data){
        return cfRes.data;
      }
    }
    setError('Error fetching user info');
    setLoading(false);
    return null;
  }

  const combineRatingChanges = (users: cfUserType[]) => {
    // Get all unique labels from all users
    const labelSet = new Set<string>();
    users.forEach(user => {
      user.ratingChanges.labels.forEach(label => labelSet.add(label));
    });
    const labels = Array.from(labelSet).sort();

    let ret: ratingChangeType = {
      labels: labels,
      datasets: [],
    };

    let cnt = 0;
    // For each user, add their datasets
    users.forEach(user => {
      for (const data of user.ratingChanges.datasets) {
        let newData : { label : string; data : (number|null)[]; borderColor : string; backgroundColor : string } = {
          label: `${user.name} - ${data.label}`,
          data: [],
          borderColor: borderColors[cnt],
          backgroundColor: backgroundColors[cnt],
        };
        cnt = (cnt + 1) % borderColors.length;

        // Create a map of label to data for quick lookup
        let mp: Map<string, number | null> = new Map();
        for (let i = 0; i < user.ratingChanges.labels.length; i++) {
          mp.set(user.ratingChanges.labels[i], data.data[i]);
        }

        // Fill in data for all labels
        for (const label of labels) {
          newData.data.push(mp.has(label) ? mp.get(label)??null : null);
        }
        ret.datasets.push(newData);
      }
    });

    return ret;
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      if(users){
        const promises = users.map(user => getUserInfo(user));
        Promise.all(promises).then(res => {
          setCFUsers(res.filter(user => user !== null));
          setLoading(false);
        });
      }
    }
    fetchUserInfo();
  }, [users]);

  if(loading){
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Loading user data...</p>
      </div>
    );
  }

  if(error){
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[400px] text-red-500"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-6 text-lg font-medium">{error}</p>
      </motion.div>
    );
  }

  if(cfUsers.length === 0){
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[400px] text-gray-500"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-6 text-lg font-medium">No user data available</p>
      </motion.div>
    );
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-500';
    if (rating >= 2100) return 'text-orange-500';
    if (rating >= 1900) return 'text-purple-500';
    if (rating >= 1600) return 'text-blue-500';
    if (rating >= 1400) return 'text-cyan-500';
    return 'text-green-500';
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 150,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium'
    },
    { 
      field: 'maxRating', 
      headerName: 'Max Rating', 
      width: 120,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium',
      renderCell: (params) => (
        <span className={getRatingColor(params.value)}>
          {params.value}
        </span>
      )
    },
    { 
      field: 'maxRank', 
      headerName: 'Max Rank', 
      width: 150,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium'
    },

    { 
      field: 'contribution', 
      headerName: 'Contribution', 
      width: 120,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium'
    },
    { 
      field: 'lastActive', 
      headerName: 'Last Active', 
      width: 150,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium'
    },
    { 
      field: 'registered', 
      headerName: 'Registered', 
      width: 150,
      headerClassName: 'text-gray-700 font-semibold',
      cellClassName: 'font-medium'
    }
  ];

  const rows = cfUsers.map((user, index) => {
    // Calculate problems solved count
    const problemsSolved = user.diffData?.reduce((sum, curr) => sum + (curr?.y || 0), 0) || 0;
    
    return {
      id: index,
      name: user.name,
      maxRating: user.maxRating,
      maxRank: user.maxRank,
      diffData: user.diffData || [],
      problemsSolved,
      contribution: user.contribution,
      lastActive: user.lastActive,
      registered: user.registered
    };
  });

  const renderTFCTable = () => {
    if (!tfcData || tfcData.length === 0) return null;

    // Get all unique TFC IDs
    const tfcIds = Array.from(new Set(tfcData.flatMap(user => user.tfcs.map(tfc => tfc.id))));
    const tfcNames = Array.from(new Set(tfcData.flatMap(user => user.tfcs.map(tfc => tfc.name))));

    const columns: GridColDef[] = [
      { 
        field: 'username', 
        headerName: 'Username', 
        flex: 1, 
        minWidth: 150, 
        sortable: true,
        renderCell: (params: GridCellParams<UserTFCData>) => (
          <Link 
            href={`/profile/${params.row.username}`}
            className="hover:text-blue-500 transition-colors font-medium"
          >
            {params.row.username}
          </Link>
        ),
      },
      ...tfcNames.map((name, index) => ({
        field: tfcIds[index],
        headerName: name,
        flex: 1,
        minWidth: 100,
        sortable: true,
        renderCell: (params: GridCellParams<UserTFCData>) => {
          const tfc = params.row.tfcs.find((t: TFCData) => t.id === tfcIds[index]);
          return (
            <div className="flex items-center gap-2 font-medium">
              <span className={`${tfc?.solveCount ? 'text-green-500' : 'text-gray-400'}`}>
                {tfc ? tfc.solveCount : 0}
              </span>
            </div>
          );
        }
      })),
      { 
        field: 'totalSolves', 
        headerName: 'Total Solves', 
        flex: 1, 
        minWidth: 120,
        sortable: true,
        renderCell: (params: GridCellParams<UserTFCData>) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-purple-600">
              {params.row.totalSolves}
            </span>
          </div>
        )
      }
    ];

    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DataGrid
            rows={tfcData}
            columns={columns}
            getRowId={(row) => row.username}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { 
                paginationModel: { pageSize: 10 } 
              },
              sorting: {
                sortModel: [{ field: 'totalSolves', sort: 'desc' }],
              },
            }}
            className="text-gray-700"
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: '#f3f4f6',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #e5e7eb',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  transform: 'scale(1.002)',
                  transition: 'all 0.2s ease',
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e5e7eb',
              },
              '& .MuiTablePagination-root': {
                color: '#374151',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Performance Comparison
          </h1>
          <div className="flex items-center gap-2">
            {users.map((user, index) => (
              <motion.div
                key={user}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${backgroundColors[index]}`,
                  color: `${borderColors[index]}`,
                  border: `1px solid ${borderColors[index]}`
                }}
              >
                {user}
              </motion.div>
            ))}
          </div>
        </div>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className="border-b border-gray-200 overflow-y-scroll [scrollbar-width:none]"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#3B82F6',
              height: '3px'
            }
          }}
        >
          <Tab 
            icon={<Trophy className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Overview</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<Activity className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Rating History</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<BarChart2 className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Difficulty Distribution</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<TrendingUp className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Cumulative Distribution</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<FolderTree className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Category Distribution</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<Clock className="w-5 h-5" />}
            label={<span className="hidden sm:inline">Submission Timeline</span>}
            className="flex gap-2 min-h-0 py-3"
          />
          <Tab 
            icon={<Target className="w-5 h-5" />}
            label={<span className="hidden sm:inline">TFC</span>}
            className="flex gap-2 min-h-0 py-3"
          />
        </Tabs>

        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <div className="w-full">
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      hideFooter={rows.length <= 10}
                      disableRowSelectionOnClick
                      autoHeight
                      sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                          borderColor: '#f3f4f6',
                          padding: '16px',
                          fontSize: '0.95rem',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          backgroundColor: '#f9fafb',
                          borderBottom: '2px solid #e5e7eb',
                          '& .MuiDataGrid-columnHeader': {
                            '&:focus': {
                              outline: 'none',
                            },
                          },
                        },
                        '& .MuiDataGrid-row': {
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                          transition: 'background-color 0.2s ease',
                        },
                      }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <RatingLineChart CFUser={createDummyUserFromLineData(combineRatingChanges(cfUsers))}/>
                </div>
              </Card>
            </motion.div>
          )}
          {activeTab === 2 && (
            <motion.div
              key="distribution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <DifficultyCompareChart users={cfUsers}></DifficultyCompareChart>
                </div>
              </Card>
            </motion.div>
          )}
          {activeTab === 3 && (
            <motion.div
              key="cumulative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <CumulativeDifficultyCompareChart users={cfUsers}></CumulativeDifficultyCompareChart>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 4 && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <CategoryCompareChart users={cfUsers}></CategoryCompareChart>
                </div>
              </Card>
            </motion.div>
          )}

          

          {activeTab === 5 && (
            <motion.div
              key="scatter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <CombinedScatterChart users={cfUsers}></CombinedScatterChart>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 6 && (
            <motion.div
              key="tfc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl bg-white">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">TFC Comparison</h2>
                  {renderTFCTable()}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function createDummyUserFromLineData(lineData: ratingChangeType) {
  let ret: cfUserType = {
    maxRating: 0,
    maxRank: "none",
    lastActive: "never",
    registered: "never",
    avatar: "https://userpic.codeforces.org/no-title.jpg",
    name: "dummy",
    contribution: 0,
    acTime: [],
    calenderSubmissions: [],
    catData: [],
    ratingChanges: lineData,
    diffData: [],
  };
  return ret;
}