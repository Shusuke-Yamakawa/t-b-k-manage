import { Flex } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { Navbar } from '@/src/app/_layouts';
import { createCard, findCardAll, findCardById } from '@/src/app/_lib/db/card';
import { CardList } from '@/src/app/card/_components/CardList';
import { authOptions } from '@/src/app/_lib/next-auth/authOptions';
import { RegisterNewType } from '@/src/app/card/_types/registerNew';
import { notify_line } from '@/src/app/_utils/line';

export const dynamic = 'force-dynamic';

const register = async (formData: RegisterNewType) => {
  'use server';

  const session = await getServerSession(authOptions);
  const loginCardId = session.user.card_id;
  const cardInfo = await findCardById(loginCardId);
  try {
    await createCard({
      card_id: formData.cardId,
      password: formData.password,
      user_nm: cardInfo!.user_nm,
      nick_nm: cardInfo!.nick_nm,
      available_flg: true,
      draw_flg: true,
      admin_flg: false,
      note: '新システム',
    });
    const msg = cardInfo!.nick_nm ? cardInfo!.nick_nm : cardInfo!.user_nm;
    notify_line(msg, '7DAsvr7QdC0sDF6wW4HGg6aDcwJmfbiE98J7zbE8V4B');
  } catch (e) {
    console.log('登録エラー ', e);
  }
};

export default async function CardPage() {
  const card = await findCardAll();
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <a href="/login">ログイン</a>してから見てね
      </div>
    );
  }
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <CardList data={card} register={register} />
    </Flex>
  );
}
