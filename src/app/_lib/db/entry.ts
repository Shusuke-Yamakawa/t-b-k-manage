import { prisma } from '@/src/app/_lib/prisma';

export type Entry = {
  card_id: string;
  court_id: number;
  possibility: string;
  comment: string;
};

type UpdateEntry = {
  id: number;
  possibility: string;
};

export const createEntry = async (params: Entry) => prisma.entry.create({ data: params });

export const updateEntry = async ({ id, possibility }: UpdateEntry) =>
  prisma.entry.update({
    where: {
      id,
    },
    data: {
      possibility,
    },
  });
