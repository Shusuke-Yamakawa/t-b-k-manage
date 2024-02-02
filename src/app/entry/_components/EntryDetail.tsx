'use client';

import { Flex, Table, Text, Title } from '@mantine/core';
import { FC } from 'react';
import { EntryDataWithCardAll, PossibilityDisplay } from '@/src/app/court/_types/court.type';
import { convertPossibilityToDisplay } from '@/src/app/court/_utils/court.util';

type Props = {
  data: EntryDataWithCardAll;
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

export const EntryDetail: FC<Props> = ({ data }) => {
  console.log('data: ', data);
  const displayPossibilities = ['◎', '◯', '△+', '△-', '☓'] satisfies PossibilityDisplay[];
  const rows = displayPossibilities.map((possibility) => {
    const entries = data.entries.filter(
      (e) => convertPossibilityToDisplay(e.possibility) === possibility
    );
    return (
      <Table.Tr key={possibility}>
        <Table.Td>{possibility}</Table.Td>
        <Table.Td>
          {entries.map((e) => (
            <Text>{e.card.nick_nm}</Text>
          ))}
        </Table.Td>
      </Table.Tr>
    );
  });
  return (
    <Flex direction="column" gap="md" m="lg">
      <Title order={3}>
        {`${data.month}/${data.day} ${data.from_time}-${data.to_time}@${data.court}`}
      </Title>
      <Text>受付名義：{data.card.user_nm}</Text>
      <Table stickyHeader stickyHeaderOffset={10}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>参加意欲</Table.Th>
            <Table.Th>名前</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
