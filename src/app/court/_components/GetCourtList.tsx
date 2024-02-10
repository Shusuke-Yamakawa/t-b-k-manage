'use client';

import {
  Button,
  Flex,
  LoadingOverlay,
  Select,
  Table,
  UnstyledButton,
  Text,
  HoverCard,
} from '@mantine/core';
import { FC } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { notifications } from '@mantine/notifications';
import { EntryData, EntryForm } from '@/src/app/court/_types/court.type';
import {
  convertPossibilityToDB,
  convertPossibilityToDisplay,
} from '@/src/app/court/_utils/court.util';

type Props = {
  data: EntryData[];
  entry: (fd: EntryForm) => Promise<void>;
  loginCardId: string;
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

export const GetCourtList: FC<Props> = ({ data, entry, loginCardId }) => {
  const form = useForm({
    initialValues: {
      courts: data.map((d) => ({
        ...d,
        possibility: convertPossibilityToDisplay(
          d.entries.find((e) => e.card_id === loginCardId)?.possibility!
        ),
      })),
    },
    transformValues(values) {
      return {
        courts: values.courts.map((d) => ({
          ...d,
          possibility: convertPossibilityToDB(d.possibility),
        })),
      };
    },
  });
  const [visible, { open, close }] = useDisclosure();

  const rows = data.map((d, index) => {
    const dayOfWeek = dayjs(`${d.year}-${d.month}-${d.day}`).day();
    const isSaturday = dayOfWeek === 6;
    return (
      <Table.Tr key={d.id}>
        <Table.Td bg={isSaturday ? 'var(--mantine-color-blue-light)' : undefined}>
          {`${d.month}/${d.day} ${d.from_time}-${d.to_time}@${d.court.slice(0, -2)}`}
        </Table.Td>
        <Table.Td>
          <Select
            data={['-', '◎', '◯', '△+', '△-', '☓']}
            {...form.getInputProps(`courts.${index}.possibility`)}
          />
        </Table.Td>
      </Table.Tr>
    );
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        open();
        try {
          await entry(values.courts);
          close();
          notifications.show({
            color: 'blue',
            title: '完了',
            message: 'エントリーが完了しました',
          });
        } catch (e) {
          notifications.show({
            color: 'red',
            title: 'エラー',
            message: 'エラーが発生しました',
          });
        }
      })}
    >
      <Flex direction="column" gap="md" m="lg">
        <Button type="submit" variant="light">
          エントリー
        </Button>
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        <HoverCard width={200} shadow="md">
          <HoverCard.Target>
            <UnstyledButton>参加可否の詳細</UnstyledButton>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">◎ ：土日どちらも参加</Text>
            <Text size="sm">◯ ：土日どちらか参加</Text>
            <Text size="sm">△+：参加できそう</Text>
            <Text size="sm">△-：参加できなそう</Text>
            <Text size="sm">☓ ：不参加</Text>
          </HoverCard.Dropdown>
        </HoverCard>
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
    </form>
  );
};
