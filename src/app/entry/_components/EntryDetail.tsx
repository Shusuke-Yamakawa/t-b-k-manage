'use client';

import { Button, Flex, LoadingOverlay, Table, Text, TextInput, Title } from '@mantine/core';
import { FC, createRef } from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useDisclosure } from '@mantine/hooks';
import { EntryDataWithCardAll, PossibilityDisplay } from '@/src/app/court/_types/court.type';
import { convertPossibilityToDisplay } from '@/src/app/court/_utils/court.util';

type Props = {
  data: EntryDataWithCardAll;
  guestAdd: (fd: any) => Promise<void>;
};

// const Loading = () => {
//   // TODO 効かない。actionを使わないとダメそう、formライブラリ使えない？
//   const { pending } = useFormStatus();
//   console.log('pending: ', pending);
//   return (
//     <LoadingOverlay visible={pending} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
//   );
// };

const schema = z.object({
  guestName: z.string().trim().min(2, { message: '2文字以上入力して' }),
});

export const EntryDetail: FC<Props> = ({ data, guestAdd }) => {
  const form = useForm({
    initialValues: {
      guestName: '',
      courtId: data.id,
    },
    validate: zodResolver(schema),
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
  const formRef = createRef<HTMLFormElement>();
  const [visible, { toggle, close }] = useDisclosure();

  return (
    <Flex direction="column" gap="md" m="lg">
      <Title order={3}>
        {`${data.month}/${data.day} ${data.from_time}-${data.to_time}@${data.court.slice(0, -2)}`}
      </Title>
      <Text>受付名義：{data.card.user_nm}</Text>
      <form
        onSubmit={form.onSubmit(async (values, event) => {
          toggle();
          event!.preventDefault();
          if (formRef.current === null) return;
          // formRef.current.submit();
          // TODO loading
          await guestAdd(values);
          close();
        })}
        ref={formRef}
        // method="post"
        // action={guestAdd}
      >
        <Flex direction="row" gap="xs">
          <TextInput
            name="guestName"
            placeholder="ゲスト登録"
            {...form.getInputProps('guestName')}
          />
          <Button style={{ padding: '8px' }} type="submit" size="xs">
            追加
          </Button>
        </Flex>
      </form>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Table>
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
