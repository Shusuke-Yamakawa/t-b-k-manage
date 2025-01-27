import type {
  PossibilityDb,
  PossibilityDisplay,
} from "@/src/app/court/_types/court.type";

export const convertPossibilityToDB = (
  possibility: PossibilityDisplay,
): PossibilityDb => {
  switch (possibility) {
    case "◎":
      return "BothDays";
    case "◯":
      return "EitherDay";
    case "△+":
      return "Likely";
    case "△-":
      return "Unlikely";
    case "☓":
      return "NotAttending";
    case "-":
      return "";
    default:
      throw new Error("不正な値が指定されています");
  }
};

export const convertPossibilityToDisplay = (
  possibility: PossibilityDb,
): PossibilityDisplay => {
  switch (possibility) {
    case "BothDays":
      return "◎";
    case "EitherDay":
      return "◯";
    case "Likely":
      return "△+";
    case "Unlikely":
      return "△-";
    case "NotAttending":
      return "☓";
    default:
      return "-";
  }
};
