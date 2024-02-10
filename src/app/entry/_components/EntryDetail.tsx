/* eslint-disable no-irregular-whitespace */

'use client';

import {
  Button,
  Flex,
  LoadingOverlay,
  Paper,
  Space,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { FC } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useDisclosure } from '@mantine/hooks';
import {
  EntryDataWithCard,
  EntryDataWithCardAll,
  PossibilityDisplay,
} from '@/src/app/court/_types/court.type';
import { convertPossibilityToDisplay } from '@/src/app/court/_utils/court.util';

type Props = {
  data: EntryDataWithCardAll;
  sameScheduleCourts: EntryDataWithCard[];
  guestAdd: (fd: { guestName: string; courtId: number }) => Promise<void>;
  commentAdd: (fd: { comment: string; courtId: number }) => Promise<void>;
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

const schemaGuest = z.object({
  guestName: z.string().trim().min(2, { message: '2文字以上入力して' }),
});

const schemaComment = z.object({
  comment: z
    .string()
    .trim()
    .min(1, { message: '1文字以上入力して' })
    .max(100, { message: '100文字以内で' }),
});

export const EntryDetail: FC<Props> = ({ data, sameScheduleCourts, guestAdd, commentAdd }) => {
  const formGuest = useForm({
    initialValues: {
      guestName: '',
      courtId: data.id,
    },
    validate: zodResolver(schemaGuest),
  });

  const formComment = useForm({
    initialValues: {
      comment: '',
      courtId: data.id,
    },
    validate: zodResolver(schemaComment),
  });

  const displayPossibilities = ['◎', '◯', '△+', '△-', '☓'] satisfies PossibilityDisplay[];
  const rows = displayPossibilities.map((possibility) => {
    const entries = data.entries.filter(
      (e) => convertPossibilityToDisplay(e.possibility) === possibility
    );
    const guests = data.guests.filter(() => possibility === '◎');
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
  const nameCounts = getCardUsers.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const comments = (
    <Paper withBorder shadow="xs" p="lg">
      <Title order={4}>コメント欄</Title>
      <Space h="sm" />
      {data.entries.map((e, index) =>
        e.comment ? (
          <Text key={index}>
            <b>{e.card.nick_nm}:</b> {e.comment}
          </Text>
        ) : null
      )}
    </Paper>
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
      <form
        onSubmit={formGuest.onSubmit(async (values, event) => {
          open();
          event!.preventDefault();
          await guestAdd(values);
          close();
          formComment.reset();
        })}
      >
        <Flex direction="row" gap="xs">
          <TextInput
            name="guestName"
            placeholder="ゲスト登録"
            {...formGuest.getInputProps('guestName')}
          />
          <Button style={{ padding: '8px' }} type="submit" size="xs">
            追加
          </Button>
        </Flex>
      </form>
      <LoadingOverlay
        styles={{
          overlay: {
            position: 'fixed', // 画面全体を覆うように固定
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
      {comments}
      <form
        onSubmit={formComment.onSubmit(async (values) => {
          open();
          await commentAdd(values);
          close();
          formComment.reset();
        })}
      >
        <Stack gap="md">
          <TextInput
            label="コメント"
            placeholder="entryしてからコメントしてね"
            {...formComment.getInputProps('comment')}
          />
          <Button type="submit">コメント追加 / 更新</Button>
        </Stack>
      </form>
    </Flex>
  );
};
