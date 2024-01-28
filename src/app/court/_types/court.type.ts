import { Card } from '@/src/app/_lib/db/card';
import { Entry } from '@/src/app/_lib/db/entry';
import { GetCourt } from '@/src/app/_lib/db/getCourt';
import { Id } from '@/src/app/_types/type';

export type EntryData = (Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  })[];

export type EntryForm = (Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  } & { possibility: string })[];
