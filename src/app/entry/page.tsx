import { Navbar } from "@/src/app/_layouts";
import { findGetCourtOverCurrentCourt } from "@/src/app/_lib/db/getCourt";
import { authOptions } from "@/src/app/_lib/next-auth/authOptions";
import type { EntryData } from "@/src/app/court/_types/court.type";
import { EntryList } from "@/src/app/entry/_components/EntryList";
import { Flex } from "@mantine/core";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

const EntryPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <a href="/login">ログイン</a>してから見てね
      </div>
    );
  }
  const getCourtList = await findGetCourtOverCurrentCourt({ publicFlg: true });
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <EntryList data={getCourtList as EntryData[]} />
    </Flex>
  );
};

export default EntryPage;
