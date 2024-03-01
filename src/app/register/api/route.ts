import { createCard } from '@/src/app/_lib/db/card';
import { notify_line } from '@/src/app/_utils/line';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { cardId, password, userNm, nickNm } = await req.json();
  try {
    await createCard({
      card_id: cardId,
      password,
      user_nm: userNm,
      nick_nm: nickNm,
      available_flg: true,
      draw_flg: true,
      admin_flg: false,
      note: '新システム',
    });
    const msg = nickNm || userNm;
    await notify_line(msg, '7DAsvr7QdC0sDF6wW4HGg6aDcwJmfbiE98J7zbE8V4B');
  } catch (e) {
    console.log('登録エラー ', e);
  }

  return new Response(JSON.stringify({ message: '' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
