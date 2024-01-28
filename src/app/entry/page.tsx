import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';

export const dynamic = 'force-dynamic';

const EntryPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <p>ログインしてから見てね</p>
      </div>
    );
  }
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <div>エントリー状況が見れる画面を作成予定</div>
    </Flex>
  );
};

export default EntryPage;
