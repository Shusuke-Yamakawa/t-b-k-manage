import { Navbar } from "@/src/app/_layouts";
import { createEntry, updateEntryPossibility } from "@/src/app/_lib/db/entry";
import { findGetCourtOverCurrentCourt } from "@/src/app/_lib/db/getCourt";
import { authOptions } from "@/src/app/_lib/next-auth/authOptions";
import { GetCourtList } from "@/src/app/court/_components/GetCourtList";
import type { EntryData, EntryForm } from "@/src/app/court/_types/court.type";
/* eslint-disable no-restricted-syntax */
import { Flex } from "@mantine/core";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const entry = async (formData: EntryForm) => {
  "use server";

  const session = await getServerSession(authOptions);

  for (const d of formData) {
    const loginCardId = session.user.card_id;
    const updateTargetEntry = d.entries.find(
      (e) =>
        d.id === e.court_id &&
        e.card_id === loginCardId &&
        e.possibility !== d.possibility,
    );
    const isEntryExists = d.entries.some(
      (e) => d.id === e.court_id && e.card_id === loginCardId,
    );

    if (updateTargetEntry) {
      console.log("更新");
      await updateEntryPossibility({
        id: updateTargetEntry.id,
        possibility: d.possibility,
      });
      continue;
    }
    if (!isEntryExists && d.possibility) {
      console.log("新規登録");
      await createEntry({
        card_id: loginCardId,
        court_id: d.id,
        possibility: d.possibility,
        comment: "",
      });
      continue;
    }
  }
  revalidatePath("/court/");
};

const CourtPage = async () => {
  const getCourtList = await findGetCourtOverCurrentCourt({ publicFlg: true });
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <p>
          <a href="/login">ログイン</a>してから見てね
        </p>
      </div>
    );
  }
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <GetCourtList
        data={getCourtList as EntryData[]}
        entry={entry}
        loginCardId={session.user.card_id}
      />
    </Flex>
  );
};

export default CourtPage;
