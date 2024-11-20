import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { useState } from "react";

export type TFCRank = {
  rank: number;
  username: string;
  solved: number;
  penalty: number;
  problems: {
    [key: string]: {
      solved: boolean;
      penalty: number;
      attempts: number;
    };
  };
};

export type TFCRanksType = {
  id: string;
  name: string;
  ranks: TFCRank[];
  problems: string[];
  isExpanded?: boolean;
};

interface TFCRanksProps {
  tfcRanks: TFCRanksType[];
}

export default function TFCRanks({ tfcRanks }: TFCRanksProps) {
  const [expandedRankings, setExpandedRankings] = useState<{ [key: string]: boolean }>({});

  const toggleRanking = (id: string) => {
    setExpandedRankings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {tfcRanks.map((tfcRank) => (
        <motion.div
          key={tfcRank.id}
          initial={false}
          animate={{ height: expandedRankings[tfcRank.id] ? "auto" : "72px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-gradient-to-r from-white to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-100/50"
        >
          <div 
            onClick={() => toggleRanking(tfcRank.id)}
            className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-purple-50/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                <span className="text-lg font-semibold text-purple-600">{tfcRank.ranks.length}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{tfcRank.name}</h3>
                <p className="text-sm text-gray-500">{tfcRank.problems.length} Problems</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedRankings[tfcRank.id] ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6 text-purple-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
          <div className={`${expandedRankings[tfcRank.id] ? 'block' : 'hidden'}`}>
            <div className="p-6">
              <DataGrid
                rows={tfcRank.ranks}
                getRowId={(row: TFCRank) => row.username}
                columns={[
                  {
                    field: 'rank',
                    headerName: 'Rank',
                    width: 100,
                    renderCell: (params: GridRenderCellParams) => (
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          params.value <= 3 ? 'text-purple-600' : 'text-gray-700'
                        }`}>
                          #{params.value}
                        </span>
                      </div>
                    )
                  },
                  {
                    field: 'username',
                    headerName: 'Username',
                    flex: 1,
                    renderCell: (params: GridRenderCellParams) => (
                      <div className="font-medium text-gray-800">{params.value}</div>
                    )
                  },
                  {
                    field: 'solved',
                    headerName: 'Solved',
                    width: 120,
                    renderCell: (params: GridRenderCellParams) => (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-semibold">{params.value}</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    field: 'penalty',
                    headerName: 'Penalty',
                    width: 120,
                    renderCell: (params: GridRenderCellParams) => (
                      <div className="text-gray-600 font-medium">{params.value}</div>
                    )
                  },
                  ...tfcRank.problems.map((problemId): GridColDef => ({
                    field: `problem_${problemId}`,
                    headerName: problemId,
                    width: 100,
                    headerAlign: 'center',
                    renderCell: (params: GridRenderCellParams) => {
                      const problem = (params.row.problems as any)[problemId];
                      if (!problem) return null;
                      
                      return (
                        <div className={`w-full h-full flex items-center justify-center ${
                          problem.solved ? 'bg-green-50' : ''
                        }`}>
                          {problem.solved ? (
                            <div className="inline-flex items-center gap-1">
                              <span className="text-green-600 font-medium text-sm">{problem.penalty}</span>
                              {problem.attempts > 1 && (
                                <span className="text-xs text-red-500">
                                  (-{problem.attempts - 1})
                                </span>
                              )}
                            </div>
                          ) : problem.attempts > 0 ? (
                            <span className="text-red-500 text-xs">
                              (-{problem.attempts})
                            </span>
                          ) : null}
                        </div>
                      );
                    },
                  })),
                ]}
                autoHeight
                disableRowSelectionOnClick
                hideFooter
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderColor: 'rgb(243 244 246)',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgb(243 244 246)',
                    borderRadius: '8px',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'rgb(243 244 246)',
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
