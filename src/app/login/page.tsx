'use client';

import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  LoadingOverlay,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

const schema = z.object({
  cardId: z.string().min(8, { message: 'IDは8文字です' }).max(8, { message: 'IDは8文字です' }),
  password: z.string().trim(),
  // .min(10, { message: 'パスワードは8文字です' })
  // .max(24, { message: 'パスワードは8文字です' }),
});

export default function LoginPage() {
  const form = useForm({
    initialValues: {
      cardId: '',
      password: '',
    },
    validate: zodResolver(schema),
  });

  const [visible, { open, close }] = useDisclosure(false);

  return (
    <Container size={420} my={40}>
      <Title ta="center">お主T.B.K.か</Title>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            open();
            const result = await signIn('user', { redirect: false, ...values });
            if (result?.error) {
              form.setFieldError('cardId', 'IDかパスワードが誤っています');
              form.setFieldError('password', 'IDかパスワードが誤っています');
              close();
            } else {
              // ログイン成功時トップページへリダイレクト
              window.location.href = '/court';
            }
          })}
        >
          <TextInput
            label="CardId"
            placeholder="10007001"
            maxLength={8}
            {...form.getInputProps('cardId')}
          />
          <PasswordInput
            label="Password"
            placeholder="都営システムのパスワード"
            maxLength={24}
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl">
            ログイン
          </Button>
          <Text ta="center" mt="md">
            新規登録の方は <Link href="/register">こちら</Link>
          </Text>
        </form>
      </Paper>
    </Container>
  );
}
