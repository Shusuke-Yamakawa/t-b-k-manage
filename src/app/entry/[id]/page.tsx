import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { findGetCourtById } from '@/src/app/_lib/db/getCourt';
import { EntryDetail } from '@/src/app/entry/_components/EntryDetail';
import { EntryDataWithCardAll } from '@/src/app/court/_types/court.type';
import { createGuest } from '@/src/app/_lib/db/guest';

export const dynamic = 'force-dynamic';

const guestAdd = async (formData: { guestName: string; courtId: number }) => {
  'use server';

  const { guestName, courtId } = formData;

  console.log('formData: ', formData);
  await createGuest({ guest_nm: guestName, court_id: courtId });

  // const session = await getServerSession(authOptions);
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
  const getCourt = await findGetCourtById(Number(params.id));
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <EntryDetail data={getCourt as EntryDataWithCardAll} guestAdd={guestAdd} />
    </Flex>
  );
};

export default EntryDetailPage;
