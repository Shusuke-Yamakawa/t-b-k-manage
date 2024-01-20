/* eslint-disable no-restricted-syntax */

'use client';

import { Button, Flex, LoadingOverlay, Select, Table, TextInput } from '@mantine/core';
import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { GetCourt } from '@/src/app/_lib/db/getCourt';
import { Card } from '@/src/app/_lib/db/card';

type Props = {
  data: ({ id: number } & GetCourt & { card: Card })[];
};

export const GetCourtList: FC<Props> = ({ data }) => {
  const [visible, { toggle }] = useDisclosure(false);

  const rows = data.map((d) => (
    <Table.Tr key={d.id}>
      <Table.Td>{d.month}</Table.Td>
      <Table.Td>{d.day}</Table.Td>
      <Table.Td>{d.from_time}</Table.Td>
      <Table.Td>{d.to_time}</Table.Td>
      <Table.Td>{d.court}</Table.Td>
      <Table.Td>{d.card.user_nm}</Table.Td>
      <Table.Td>
        <Select data={['参加できる', '参加できそう', '参加できなそう', '不参加']} />
      </Table.Td>
      <Table.Td>
        <TextInput placeholder="コメント書けます" />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction="column" gap="md" m="lg">
      <Button
        onClick={async () => {
          toggle();
        }}
        variant="light"
      >
        エントリー
      </Button>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>月</Table.Th>
            <Table.Th>日付</Table.Th>
            <Table.Th>開始時間</Table.Th>
            <Table.Th>終了時間</Table.Th>
            <Table.Th>コート名</Table.Th>
            <Table.Th>カード名義</Table.Th>
            <Table.Th>参加可否</Table.Th>
            <Table.Th>備考</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
