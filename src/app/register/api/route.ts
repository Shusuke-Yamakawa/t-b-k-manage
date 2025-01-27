import { createCard } from "@/src/app/_lib/db/card";
import { notifyLineMessage } from "@/src/app/_utils/line";

export const dynamic = "force-dynamic";

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
      note: "新システム",
    });
    const msg = `${userNm}\n${nickNm}`;
    await notifyLineMessage(msg);
  } catch (e) {
    console.log("登録エラー ", e);
  }

  return new Response(JSON.stringify({ message: "" }), {
    headers: { "Content-Type": "application/json" },
  });
}
