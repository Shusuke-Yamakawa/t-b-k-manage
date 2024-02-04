export const getWeek = ({ year, month, day }: { year: number; month: number; day: number }) => {
  const week = ['日', '月', '火', '水', '木', '金', '土'];
  return week[new Date(year, month - 1, day).getDay()];
};
