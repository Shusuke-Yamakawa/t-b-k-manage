'use client';

import { TextInput, PasswordInput, Paper, Title, Container, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const schema = z.object({
    cardId: z.string().min(8, { message: 'IDは8文字です' }).max(8, { message: 'IDは8文字です' }),
    password: z
      .string()
      .min(8, { message: 'パスワードは8文字です' })
      .max(8, { message: 'パスワードは8文字です' }),
  });

  const form = useForm({
    initialValues: {
      cardId: '',
      password: '',
    },
    validate: zodResolver(schema),
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">お主T.B.K.か</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            const result = await signIn('user', { redirect: false, ...values });
            if (result?.error) {
              console.log('ログイン失敗: ', result?.error);
            } else {
              // ログイン成功時トップページへリダイレクト
              window.location.href = '/court';
            }
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
            maxLength={8}
            mt="md"
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
