import { prisma } from '@/src/app/_lib/prisma';

export type Guest = {
  guest_nm: string;
  court_id: number;
};

export const createGuest = async (params: Guest) => prisma.guest.create({ data: params });
