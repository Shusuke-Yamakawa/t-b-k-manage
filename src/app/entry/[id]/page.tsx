import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { findGetCourtById } from '@/src/app/_lib/db/getCourt';

export const dynamic = 'force-dynamic';

const EntryDetailPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <a href="/login">ログイン</a>してから見てね
      </div>
    );
  }
  const getCourt = await findGetCourtById(Number(params.id));
  console.log('getCourt: ', getCourt);
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <div>{params.id}</div>
    </Flex>
  );
};

export default EntryDetailPage;
