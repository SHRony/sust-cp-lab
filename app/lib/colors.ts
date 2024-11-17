export const borderColors:string[] =  [
  "rgba(22, 163, 74, 1)",
  "rgba(219, 39, 119, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export const backgroundColors = [
  "rgba(22, 163, 74, 0.2)",
  "rgba(219, 39, 119, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

export const cfRankColors = {
  'newbie': '#808080',
  'pupil': '#008000',
  'specialist': '#03A89E',
  'expert': '#0000FF',
  'candidate master': '#AA00AA',
  'master': '#FF8C00',
  'international master': '#FF8C00',
  'grandmaster': '#FF0000',
  'international grandmaster': '#FF0000',
  'legendary grandmaster': '#FF0000',
  'unknown': '#000000'
} as const;

export const getCFRankColor = (rank: string): string => {
  const normalizedRank = rank.toLowerCase();
  return cfRankColors[normalizedRank as keyof typeof cfRankColors] || cfRankColors.unknown;
};