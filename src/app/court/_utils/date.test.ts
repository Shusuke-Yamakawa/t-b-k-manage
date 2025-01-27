import { getWeek } from "@/src/app/court/_utils/date.util";

describe("日付関連", () => {
  it.each`
    year    | month | day   | expected
    ${2024} | ${2}  | ${4}  | ${"日"}
    ${2024} | ${2}  | ${5}  | ${"月"}
    ${2024} | ${2}  | ${6}  | ${"火"}
    ${2024} | ${2}  | ${7}  | ${"水"}
    ${2024} | ${2}  | ${8}  | ${"木"}
    ${2024} | ${2}  | ${9}  | ${"金"}
    ${2024} | ${2}  | ${10} | ${"土"}
  `(
    "年月日に紐づく曜日が取得されることこと $year-$month-$day as $expected",
    ({ year, month, day, expected }) => {
      const result = getWeek({ year, month, day });
      expect(result).toBe(expected);
    },
  );
});
