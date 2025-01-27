import { Navbar } from "@/src/app/_layouts";
import { findCardAll } from "@/src/app/_lib/db/card";
import { authOptions } from "@/src/app/_lib/next-auth/authOptions";
import { CardList } from "@/src/app/card/_components/CardList";
import { Flex } from "@mantine/core";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";

export default async function CardPage() {
  const card = await findCardAll();
  const session = await getServerSession(authOptions);
  if (session && !session.user.admin_flg) {
    return (
      <div>
        <p>見ちゃダメよ</p>
      </div>
    );
  }
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <CardList data={card} />
    </Flex>
  );
}
