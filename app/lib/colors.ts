// Modern, vibrant color palette
export const borderColors: string[] = [
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
];

export const backgroundColors = [
  "rgba(59, 130, 246, 0.1)",  // Blue
  "rgba(236, 72, 153, 0.1)",  // Pink
  "rgba(16, 185, 129, 0.1)",  // Emerald
  "rgba(245, 158, 11, 0.1)",  // Amber
  "rgba(139, 92, 246, 0.1)",  // Purple
  "rgba(20, 184, 166, 0.1)",  // Teal
  "rgba(249, 115, 22, 0.1)",  // Orange
  "rgba(99, 102, 241, 0.1)",  // Indigo
];

// Enhanced CF rank colors with better visibility
export const cfRankColors = {
  'newbie': '#898989',
  'pupil': '#008D00',
  'specialist': '#03A89E',
  'expert': '#0000FF',
  'candidate master': '#AA00AA',
  'master': '#FF8C00',
  'international master': '#FF8C00',
  'grandmaster': '#FF0000',
  'international grandmaster': '#FF0000',
  'legendary grandmaster': '#FF0000',
  'unknown': '#4B5563'
} as const;

export const getCFRankColor = (rank: string): string => {
  const normalizedRank = rank.toLowerCase();
  return cfRankColors[normalizedRank as keyof typeof cfRankColors] || cfRankColors.unknown;
};