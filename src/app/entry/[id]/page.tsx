import { Navbar } from "@/src/app/_layouts";
import { checkEntryExists, updateEntryComment } from "@/src/app/_lib/db/entry";
import {
  findGetCourtById,
  findGetCourtSameSchedule,
} from "@/src/app/_lib/db/getCourt";
import { createGuest } from "@/src/app/_lib/db/guest";
import { authOptions } from "@/src/app/_lib/next-auth/authOptions";
import { notifyLineMessage } from "@/src/app/_utils/line";
import type {
  EntryDataWithCard,
  EntryDataWithCardAll,
} from "@/src/app/court/_types/court.type";
import { EntryDetail } from "@/src/app/entry/_components/detail/EntryDetail";
import { Flex } from "@mantine/core";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const getSameScheduleCourts = async (getCourt: EntryDataWithCardAll) =>
  (await findGetCourtSameSchedule({
    year: getCourt.year,
    month: getCourt.month,
    day: getCourt.day,
    from_time: getCourt.from_time,
    to_time: getCourt.to_time,
    court: getCourt.court,
  })) as EntryDataWithCard[];

const receptionNotify = async (formData: {
  reception: string;
  courtId: number;
}) => {
  "use server";

  const { reception, courtId } = formData;
  const getCourt = (await findGetCourtById(courtId)) as EntryDataWithCardAll;
  const sameScheduleCourts = await getSameScheduleCourts(getCourt);
  const courtInfo = `日時${getCourt.month}/${getCourt.day} ${getCourt.from_time}-${
    getCourt.to_time
  }@${getCourt.court.slice(0, -2)}\n`;
  const receptionPerson = `受付者：${reception}\n`;
  const receptionInfo = sameScheduleCourts.map(
    (court, index) =>
      `\n${index + 1}件目\nコート予約名義；${court.card.user_nm}\n利用者番号：${
        court.card_id
      }\n予約番号${court.reserve_no}`,
  );
  const msg = courtInfo + receptionPerson + receptionInfo;
  console.log("msg: ", msg);
  await notifyLineMessage(msg);
};

const commentAdd = async (formData: { comment: string; courtId: number }) => {
  "use server";

  const { comment, courtId } = formData;
  const session = await getServerSession(authOptions);
  const isExists = await checkEntryExists({
    card_id: session.user.card_id,
    court_id: courtId,
  });
  if (!isExists) return;
  await updateEntryComment({
    comment,
    card_id: session.user.card_id,
    court_id: courtId,
  });
  revalidatePath("/entry/[id]", "page");
};

const guestAdd = async (formData: { guestName: string; courtId: number }) => {
  "use server";

  const { guestName, courtId } = formData;
  const session = await getServerSession(authOptions);
  await createGuest({
    guest_nm: guestName,
    court_id: courtId,
    invited_card_id: session.user.card_id,
  });

  const getCourt = await findGetCourtById(courtId);
  const msg = `${getCourt!.month}/${getCourt!.day} ${getCourt!.from_time}-${
    getCourt!.to_time
  }@${getCourt!.court.slice(0, -2)}

ゲスト名：${guestName}
招待者：${session.user.nick_nm}`;
  await notifyLineMessage(msg);
  revalidatePath("/entry/[id]", "page");
};

const EntryDetailPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <a href="/login">ログイン</a>してから見てね
      </div>
    );
  }
  const getCourt = (await findGetCourtById(
    Number(params.id),
  )) as EntryDataWithCardAll;
  const sameScheduleCourts = await getSameScheduleCourts(getCourt);

  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <EntryDetail
        data={getCourt}
        sameScheduleCourts={sameScheduleCourts}
        adminFlg={session.user.admin_flg}
        guestAdd={guestAdd}
        commentAdd={commentAdd}
        receptionNotify={receptionNotify}
      />
    </Flex>
  );
};

export default EntryDetailPage;
