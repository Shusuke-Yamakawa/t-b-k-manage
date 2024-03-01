'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { API_URL } from '@/src/app/_consts/environment.const';

const schema = z.object({
  cardId: z.string().min(8, { message: 'IDは8文字です' }).max(8, { message: 'IDは8文字です' }),
  password: z
    .string()
    .min(10, { message: 'パスワードは10文字以上入れて' })
    .max(24, { message: 'パスワードは24文字以内' })
    .trim(),
  userNm: z.string().min(1, { message: '名前は必須です' }).trim(),
  nickNm: z.string().trim(),
});

export default function ResisterPage() {
  const form = useForm({
    initialValues: {
      cardId: '',
      password: '',
      userNm: '',
      nickNm: '',
    },
    validate: zodResolver(schema),
  });

  const [visible, { open, close }] = useDisclosure(false);

  return (
    <Container size={420} my={40}>
      <Title ta="center">T.B.K.にようこそ</Title>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            console.log('values: ', values);
            open();
            await axios.post(`${API_URL}register/api/`, {
              ...values,
            });
            close();
          })}
        >
          <TextInput
            label="CardId"
            placeholder="80097001"
            maxLength={8}
            {...form.getInputProps('cardId')}
          />
          <PasswordInput
            label="Password"
            placeholder="生年月日を入れてください"
            maxLength={24}
            mt="md"
            {...form.getInputProps('password')}
          />
          <TextInput
            label="ユーザー名"
            placeholder="ドイ ケイコ"
            {...form.getInputProps('userNm')}
          />
          <TextInput
            label="ニックネーム"
            placeholder="任意入力です"
            {...form.getInputProps('nickNm')}
          />
          <Button type="submit" fullWidth mt="xl">
            新規登録
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
