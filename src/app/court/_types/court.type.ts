import { Card } from '@/src/app/_lib/db/card';
import { Entry } from '@/src/app/_lib/db/entry';
import { GetCourt } from '@/src/app/_lib/db/getCourt';
import { Guest } from '@/src/app/_lib/db/guest';
import { Id } from '@/src/app/_types/type';

export type EntryData = Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  } & {
    guests: (Id & Guest)[];
  };

export type EntryForm = (Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  } & { possibility: PossibilityDb })[];

export type PossibilityDb = 'BothDays' | 'EitherDay' | 'Likely' | 'Unlikely' | 'NotAttending' | '';
export type PossibilityDisplay = '◎' | '◯' | '△+' | '△-' | '☓' | '-';
