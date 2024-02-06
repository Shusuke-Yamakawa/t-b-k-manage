import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Navbar } from '@/src/app/_layouts';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { findGetCourtById } from '@/src/app/_lib/db/getCourt';
import { EntryDetail } from '@/src/app/entry/_components/EntryDetail';
import { EntryDataWithCardAll } from '@/src/app/court/_types/court.type';
import { createGuest } from '@/src/app/_lib/db/guest';
import { notify_line } from '@/src/app/_utils/line';

export const dynamic = 'force-dynamic';

const guestAdd = async (formData: { guestName: string; courtId: number }) => {
  'use server';

  const session = await getServerSession(authOptions);

  const { guestName, courtId } = formData;
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
  notify_line(msg, 'AmiDotEhZrkZWaGSc6a5HQNwtUbERzCcGPEuQ7tEwBG');
  revalidatePath('/entry/[id]', 'page');
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
