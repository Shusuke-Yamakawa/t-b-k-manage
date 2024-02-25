'use client';

import {
  Button,
  Checkbox,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Table,
  TextInput,
} from '@mantine/core';
import { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Card } from '@/src/app/_lib/db/card';
import { RegisterNewType } from '@/src/app/card/_types/registerNew';

type Props = {
  data: Card[];
  register: (fd: RegisterNewType) => Promise<void>;
};

export const schema = z.object({
  cardId: z.string().min(8, { message: 'IDは8文字です' }).max(8, { message: 'IDは8文字です' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'パスワードは8文字です' })
    .max(8, { message: 'パスワードは8文字です' }),
});

export const CardList: FC<Props> = ({ data, register }) => {
  const { data: session } = useSession() as { data: any };
  const form = useForm({
    initialValues: {
      cardId: '',
      password: '',
    },
    validate: zodResolver(schema),
  });
  console.log('session: ', session);
  const [visible, { open, close }] = useDisclosure(false);

  if (!session?.user?.admin_flg) {
    return (
      <Flex direction="column" gap="md" m="lg">
        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        <form
          onSubmit={form.onSubmit(async (values) => {
            open();
            await register(values);
            close();
          })}
        >
          <Button type="submit" variant="light">
            新規登録
          </Button>
          <TextInput
            label="CardId"
            placeholder="80097001"
            maxLength={8}
            {...form.getInputProps('cardId')}
          />
          <PasswordInput
            label="Password"
            placeholder="生年月日を入れてください"
            maxLength={8}
            mt="md"
            {...form.getInputProps('password')}
          />
        </form>
      </Flex>
    );
  }
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const rows = data.map((d) => (
    <Table.Tr
      key={d.card_id}
      bg={selectedRows.includes(Number(d.card_id)) ? 'var(--mantine-color-blue-light)' : undefined}
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(Number(d.card_id))}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, Number(d.card_id)]
                : selectedRows.filter((position) => position !== Number(d.card_id))
            )
          }
        />
      </Table.Td>
      <Table.Td>{d.card_id}</Table.Td>
      <Table.Td>{d.password}</Table.Td>
      <Table.Td>{d.user_nm}</Table.Td>
      <Table.Td>{d.available_flg ? '有効' : '無効'}</Table.Td>
      <Table.Td>{d.note}</Table.Td>
      <Table.Td>{d.draw_flg ? '抽選前' : '抽選済'}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction="column" gap="md" m="lg">
      <Button variant="light">削除</Button>
      <Button variant="light">新規登録</Button>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>削除</Table.Th>
            <Table.Th>カードID</Table.Th>
            <Table.Th>パスワード</Table.Th>
            <Table.Th>カード名義</Table.Th>
            <Table.Th>有効</Table.Th>
            <Table.Th>備考</Table.Th>
            <Table.Th>抽選可能</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
