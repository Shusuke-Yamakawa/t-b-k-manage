import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { findGetCourtOverCurrentCourt } from '@/src/app/_lib/db/getCourt';
import { ManageCourtList } from '@/src/app/manage/_components/ManageCourtList';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';

export const dynamic = 'force-dynamic';

const ManageCourtPage = async () => {
  const getCourtList = await findGetCourtOverCurrentCourt();
  const session = await getServerSession(authOptions);
  console.log('session: ', session);
  if (session && !session.user.admin_flg) {
    return (
      <div>
        <p>見ちゃダメよ</p>
      </div>
    );
  }
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <ManageCourtList data={getCourtList} />
    </Flex>
  );
};

export default ManageCourtPage;
