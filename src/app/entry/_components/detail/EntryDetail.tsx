/* eslint-disable no-irregular-whitespace */

"use client";

import type {
  EntryDataWithCard,
  EntryDataWithCardAll,
  PossibilityDisplay,
} from "@/src/app/court/_types/court.type";
import { convertPossibilityToDisplay } from "@/src/app/court/_utils/court.util";
import {
  CommentForm,
  Comments,
} from "@/src/app/entry/_components/detail/Comment";
import { Guest } from "@/src/app/entry/_components/detail/Guest";
import { Reception } from "@/src/app/entry/_components/detail/Reception";
import { Flex, LoadingOverlay, Stack, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { FC } from "react";

type Props = {
  data: EntryDataWithCardAll;
  sameScheduleCourts: EntryDataWithCard[];
  adminFlg: boolean;
  guestAdd: (fd: { guestName: string; courtId: number }) => Promise<void>;
  commentAdd: (fd: { comment: string; courtId: number }) => Promise<void>;
  receptionNotify: (fd: {
    reception: string;
    courtId: number;
  }) => Promise<void>;
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

export const EntryDetail: FC<Props> = ({
  data,
  sameScheduleCourts,
  adminFlg,
  guestAdd,
  commentAdd,
  receptionNotify,
}) => {
  const displayPossibilities = [
    "◎",
    "◯",
    "△+",
    "△-",
    "☓",
  ] satisfies PossibilityDisplay[];
  const rows = displayPossibilities.map((possibility) => {
    const entries = data.entries.filter(
      (e) => convertPossibilityToDisplay(e.possibility) === possibility,
    );
    const guests = data.guests.filter(() => possibility === "◎");
    return (
      <Table.Tr key={possibility}>
        <Table.Td>{possibility}</Table.Td>
        <Table.Td>
          {entries.map((e) => (
            <Text key={e.id}>{e.card.nick_nm}</Text>
          ))}
          {guests.map((g) => (
            <Text key={g.id}>{g.guest_nm}</Text>
          ))}
        </Table.Td>
      </Table.Tr>
    );
  });
  const [visible, { open, close }] = useDisclosure();
  const getCardUsers = sameScheduleCourts.map((c) => c.card.user_nm);
  const nameCounts = getCardUsers.reduce(
    (acc, name) => {
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  return (
    <Flex direction="column" gap="md" m="lg">
      <Title order={3}>
        {`${data.month}/${data.day} ${data.from_time}-${data.to_time}@${data.court.slice(0, -2)} ${
          sameScheduleCourts.length
        }面`}
      </Title>
      <Stack gap="xs">
        <Text fw={500}>受付名義</Text>
        {Object.entries(nameCounts).map(([name, count], index) => (
          <Text key={index} pl="sm">
            　{name} {count}
          </Text>
        ))}
      </Stack>
      <Guest courtId={data.id} guestAdd={guestAdd} open={open} close={close} />
      <LoadingOverlay
        styles={{
          overlay: {
            position: "fixed", // 画面全体を覆うように固定
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          },
        }}
        visible={visible}
      />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>参加意欲</Table.Th>
            <Table.Th>名前</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Comments data={data} />
      <CommentForm
        courtId={data.id}
        commentAdd={commentAdd}
        open={open}
        close={close}
      />
      {adminFlg && (
        <Reception
          courtId={data.id}
          receptionNotify={receptionNotify}
          open={open}
          close={close}
        />
      )}
    </Flex>
  );
};
