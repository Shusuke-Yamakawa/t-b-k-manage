import type { Card } from "@/src/app/_lib/db/card";
import type { Entry } from "@/src/app/_lib/db/entry";
import type { GetCourt } from "@/src/app/_lib/db/getCourt";
import type { Guest } from "@/src/app/_lib/db/guest";
import type { Id } from "@/src/app/_types/type";

export type EntryData = Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  } & {
    guests: (Id & Guest)[];
  };

export type EntryDataWithCardAll = Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry & { card: Card })[];
  } & {
    guests: (Id & Guest)[];
  };

export type EntryDataWithCard = Id & GetCourt & { card: Card };

export type EntryForm = (Id &
  GetCourt & { card: Card } & {
    entries: (Id & Entry)[];
  } & { possibility: PossibilityDb })[];

export type PossibilityDb =
  | "BothDays"
  | "EitherDay"
  | "Likely"
  | "Unlikely"
  | "NotAttending"
  | "";
export type PossibilityDisplay = "◎" | "◯" | "△+" | "△-" | "☓" | "-";
