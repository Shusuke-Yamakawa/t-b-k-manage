"use client";

import type { EntryData } from "@/src/app/court/_types/court.type";
import { Flex, Table } from "@mantine/core";
import Link from "next/link";
import type { FC } from "react";

type Props = {
  data: EntryData[];
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

export const EntryList: FC<Props> = ({ data }) => {
  const rows = data.map((d) => {
    const bothDaysEntryNumber = d.entries.filter(
      (e) => e.possibility === "BothDays",
    ).length;
    const eitherDayEntryNumber = d.entries.filter(
      (e) => e.possibility === "EitherDay",
    ).length;
    const likelyEntryNumber = d.entries.filter(
      (e) => e.possibility === "Likely",
    ).length;
    const unLikelyEntryNumber = d.entries.filter(
      (e) => e.possibility === "Unlikely",
    ).length;
    const notAttendingEntryNumber = d.entries.filter(
      (e) => e.possibility === "NotAttending",
    ).length;
    const guestEntryNumber = d.guests.length;
    const isHold = d.hold_flg;
    return (
      <Table.Tr
        key={d.id}
        bg={isHold ? "var(--mantine-color-red-light)" : undefined}
      >
        <Table.Td>
          <Link href={`/entry/${d.id}`}>
            {`${d.month}/${d.day} ${d.from_time}-${d.to_time}@${d.court.slice(0, -2)}`}
          </Link>
        </Table.Td>
        <Table.Td>{bothDaysEntryNumber + guestEntryNumber}</Table.Td>
        <Table.Td>{eitherDayEntryNumber}</Table.Td>
        <Table.Td>{likelyEntryNumber}</Table.Td>
        <Table.Td>{unLikelyEntryNumber}</Table.Td>
        <Table.Td>{notAttendingEntryNumber}</Table.Td>
      </Table.Tr>
    );
  });
  return (
    <Flex direction="column" gap="md" m="lg">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>情報</Table.Th>
            <Table.Th>◎</Table.Th>
            <Table.Th>◯</Table.Th>
            <Table.Th>△+</Table.Th>
            <Table.Th>△-</Table.Th>
            <Table.Th>☓</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
