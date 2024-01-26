'use client';

import { Button, Flex, LoadingOverlay, Select, Table } from '@mantine/core';
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
      <Table.Td>{`${d.month}/${d.day} ${d.from_time}-${d.to_time}@${d.court}`}</Table.Td>
      <Table.Td>
        <Select
          data={[
            '土日どちらも参加',
            '土日どちらか参加',
            '参加できそう',
            '参加できなそう',
            '不参加',
          ]}
        />
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
            <Table.Th>情報</Table.Th>
            <Table.Th>参加可否</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
