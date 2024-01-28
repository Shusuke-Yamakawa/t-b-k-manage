/* eslint-disable no-restricted-syntax */
import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { findGetCourtOverCurrentCourt } from '@/src/app/_lib/db/getCourt';
import { GetCourtList } from '@/src/app/court/_components/GetCourtList';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { EntryForm } from '@/src/app/court/_types/court.type';
import { createEntry, updateEntry } from '@/src/app/_lib/db/entry';

const entry = async (formData: EntryForm) => {
  'use server';

  const session = await getServerSession(authOptions);

  for (const d of formData) {
    const loginCardId = session.user.card_id;
    const isEntryExists = d.entries.some((e) => e.card_id === loginCardId);
    if (isEntryExists) {
      console.log('アップデート');
      await updateEntry({
        id: d.entries[0].id,
        possibility: d.possibility,
      });
      continue;
    }
    if (d.possibility) {
      console.log('新規登録');
      await createEntry({
        card_id: loginCardId,
        court_id: d.id,
        possibility: d.possibility,
        comment: '',
      });
      continue;
    }
  }
};

const CourtPage = async () => {
  const getCourtList = await findGetCourtOverCurrentCourt({ publicFlg: true });
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
      <GetCourtList data={getCourtList} entry={entry} loginCardId={session.user.card_id} />
    </Flex>
  );
};

export default CourtPage;
