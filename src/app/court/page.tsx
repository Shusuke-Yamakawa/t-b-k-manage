import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { findGetCourtOverCurrentCourt } from '@/src/app/_lib/db/getCourt';
import { GetCourtList } from '@/src/app/court/_components/GetCourtList';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';

const CourtPage = async () => {
  const getCourtList = await findGetCourtOverCurrentCourt({ publicFlg: true });
  const session = await getServerSession(authOptions);
  console.log('session: ', session);
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <GetCourtList data={getCourtList} />
    </Flex>
  );
};

export default CourtPage;
