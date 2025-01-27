import { prisma } from "@/src/app/_lib/prisma";
import { currentDate } from "@/src/app/_utils/date";

export type GetCourt = {
  card_id: string;
  year: number;
  month: number;
  day: number;
  from_time: number;
  to_time: number;
  court: string;
  reserve_no: string;
  public_flg?: boolean;
  hold_flg?: boolean;
};

type Id = {
  id: number;
};

type CardIds = {
  cardIds: string[];
};

export const createGetCourt = async (params: GetCourt) =>
  prisma.getCourt.create({ data: params });

export const deleteGetCourtById = async ({ id }: Id) =>
  prisma.getCourt.delete({
    where: {
      id,
    },
  });
export const deleteGetCourtBySpecialIds = async ({ cardIds }: CardIds) =>
  prisma.getCourt.deleteMany({
    where: {
      card_id: { in: cardIds },
    },
  });
export const deleteGetCourtCurrentMonthBySpecialIds = async ({
  cardIds,
}: CardIds) => {
  const date = currentDate();
  const month = date.month() + 1;
  return prisma.getCourt.deleteMany({
    where: {
      AND: [{ card_id: { in: cardIds }, month }],
    },
  });
};

export const findGetCourtById = async (id: number) =>
  prisma.getCourt.findUnique({
    where: {
      id,
    },
    include: {
      card: true,
      entries: {
        include: {
          card: true,
        },
      },
      guests: true,
    },
  });

/**
 * 現在日付以降のコート取得情報を取得する
 * @param cardIds 指定すると指定したカードID以外の情報を取得する
 */
export const findGetCourtOverCurrentCourt = async (options?: {
  cardIds?: string[];
  publicFlg?: boolean;
}) => {
  const date = currentDate(); // 今日の日付を取得
  const currentYear = date.year();
  const currentMonth = date.month() + 1; // dayjsのmonthは0始まりなので+1して調整
  const currentDay = date.date();

  // 条件の修正
  const whereConditions = {
    AND: [
      {
        // 現在の年以上
        year: {
          gte: currentYear,
        },
      },
      {
        // 現在の年での条件
        OR: [
          // 現在の月より大きい場合は日に関係なくすべて含める
          {
            AND: [{ year: currentYear }, { month: { gt: currentMonth } }],
          },
          // 現在の月で現在の日以降のデータを取得
          {
            AND: [
              { year: currentYear },
              { month: currentMonth },
              { day: { gte: currentDay } },
            ],
          },
          // 次の年以降は全てのデータを含める
          {
            year: { gt: currentYear },
          },
        ],
      },
    ],
  } as any;

  // オプションに基づいて条件を追加
  const { cardIds, publicFlg } = options || {};
  if (cardIds && cardIds.length > 0) {
    whereConditions.card_id = { not: { in: cardIds } };
  }
  if (publicFlg !== undefined) {
    whereConditions.public_flg = publicFlg;
  }

  return prisma.getCourt.findMany({
    where: whereConditions,
    include: {
      card: true,
      entries: true,
      guests: true,
    },
    orderBy: [
      { year: "asc" },
      { month: "asc" },
      { day: "asc" },
      { from_time: "asc" },
      { court: "asc" },
      { card_id: "asc" },
    ],
  });
};

export const updatePublicAndHoldFlg = async ({
  id,
  publicFlg,
  holdFlg,
}: Id & { publicFlg: boolean; holdFlg: boolean }) =>
  prisma.getCourt.update({
    where: {
      id,
    },
    data: {
      public_flg: publicFlg,
      hold_flg: holdFlg,
    },
  });

export const findGetCourtSameSchedule = async ({
  year,
  month,
  day,
  from_time,
  to_time,
  court,
}: {
  year: number;
  month: number;
  day: number;
  from_time: number;
  to_time: number;
  court: string;
}) =>
  prisma.getCourt.findMany({
    where: {
      year,
      month,
      day,
      from_time,
      to_time,
      court,
    },
    include: {
      card: true,
    },
  });
