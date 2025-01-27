import {
  createGetCourt,
  findGetCourtOverCurrentCourt,
} from "@/src/app/_lib/db/getCourt";

export const dynamic = "force-dynamic";

export async function GET() {
  const getCourt = await findGetCourtOverCurrentCourt();
  return new Response(JSON.stringify(getCourt), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const {
    cardId,
    year,
    month,
    day,
    fromTime,
    toTime,
    court,
    reserveNo,
    publicFlg,
  } = await req.json();
  await createGetCourt({
    card_id: cardId,
    year,
    month,
    day,
    from_time: fromTime,
    to_time: toTime,
    court,
    reserve_no: reserveNo,
    public_flg: publicFlg === "公開",
  });
  return new Response(JSON.stringify({ message: "新規コートを登録しました" }), {
    headers: { "Content-Type": "application/json" },
  });
}
