import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { findGetCourtOverCurrentCourt } from '@/src/app/_lib/db/getCourt';
import { EntryList } from '@/src/app/entry/_components/EntryList';

export const dynamic = 'force-dynamic';

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
  getCourtList.forEach((court) => {
    court.entries.forEach((entry) => {
      console.log(entry);
    });
    court.guests.forEach((guest) => {
      console.log(guest);
    });
  });

  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <EntryList data={getCourtList} />
    </Flex>
  );
};

export default EntryPage;
