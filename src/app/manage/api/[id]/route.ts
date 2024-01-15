import { findGetCourtById, updatePublicFlg } from '@/src/app/_lib/db/getCourt';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const getCourt = await findGetCourtById(Number(params.id));
  return new Response(JSON.stringify(getCourt), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { publicFlg } = await req.json();
  try {
    await updatePublicFlg(Number(params.id), publicFlg);
    return new Response(JSON.stringify({ message: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to delete court' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
