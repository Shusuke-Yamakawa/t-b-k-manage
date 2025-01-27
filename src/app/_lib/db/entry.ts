import { prisma } from "@/src/app/_lib/prisma";
import type { PossibilityDb } from "@/src/app/court/_types/court.type";

export type Entry = {
  card_id: string;
  court_id: number;
  possibility: PossibilityDb;
  comment: string;
};

type UpdateEntryPossibility = {
  id: number;
  possibility: string;
};

export const createEntry = async (params: Entry) =>
  prisma.entry.create({ data: params });

export const updateEntryPossibility = async ({
  id,
  possibility,
}: UpdateEntryPossibility) =>
  prisma.entry.update({
    where: {
      id,
    },
    data: {
      possibility,
    },
  });

export const updateEntryComment = async ({
  card_id,
  court_id,
  comment,
}: Omit<Entry, "possibility">) =>
  prisma.entry.update({
    where: {
      card_court: { card_id, court_id },
    },
    data: {
      comment,
    },
  });

export const checkEntryExists = async ({
  card_id,
  court_id,
}: Pick<Entry, "card_id" | "court_id">) =>
  prisma.entry
    .findFirst({
      where: {
        card_id,
        court_id,
      },
    })
    .then((entry) => !!entry);
