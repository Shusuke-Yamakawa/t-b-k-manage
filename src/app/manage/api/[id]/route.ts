import {
  findGetCourtById,
  updatePublicAndHoldFlg,
} from "@/src/app/_lib/db/getCourt";
import { notifyLineMessage } from "@/src/app/_utils/line";
import { getWeek } from "@/src/app/court/_utils/date.util";

export const dynamic = "force-dynamic";

export async function GET(
  // biome-ignore lint/correctness/noUnusedVariables: これがないとエラーになる
  req: Request,
  { params }: { params: { id: string } },
) {
  const getCourt = await findGetCourtById(Number(params.id));
  return new Response(JSON.stringify(getCourt), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { publicFlg, holdFlg } = await req.json();
  try {
    const court = await findGetCourtById(Number(params.id));
    const { year } = court!;
    const { month } = court!;
    const { day } = court!;
    const week = getWeek({ year, month, day });
    if (!court!.hold_flg && holdFlg) {
      const msg = `${month}/${day}(${week})${court!.from_time}-${court!.to_time}
${court!.court.slice(0, -2)}`;
      await notifyLineMessage(msg);
    }
    await updatePublicAndHoldFlg({
      id: Number(params.id),
      publicFlg,
      holdFlg,
    });
    return new Response(JSON.stringify({ message: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete court" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
