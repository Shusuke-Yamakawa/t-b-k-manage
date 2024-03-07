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
  Checkbox,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
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
  const [checked, setChecked] = useState(false);

  return (
    <Container size={420} my={40}>
      <Title ta="center">T.B.K.にようこそ</Title>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => {
            console.log('values: ', values);
            console.log('checked: ', checked);

            open();
            if (checked && !values.nickNm) {
              form.setFieldError('nickNm', '新規メンバーの場合はニックネームを入力してください');
              close();
              return;
            }

            await axios.post(`${API_URL}register/api/`, {
              ...values,
            });
            // 新規メンバーの登録の場合はそのままログインする
            if (checked) {
              const result = await signIn('user', { redirect: false, ...values });
              if (result?.error) {
                form.setFieldError('cardId', 'IDかパスワードが誤っています');
                form.setFieldError('password', 'IDかパスワードが誤っています');
                close();
              } else {
                // ログイン成功時トップページへリダイレクト
                window.location.href = '/court';
              }
            }
            close();
          })}
        >
          <Flex direction="column" gap="xl">
            <Flex direction="column" gap="sm">
              <TextInput
                label="利用者番号"
                placeholder="80097001"
                maxLength={8}
                {...form.getInputProps('cardId')}
              />
              <PasswordInput
                label="パスワード"
                placeholder="都営システムのパスワード"
                maxLength={24}
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
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                label="新規メンバーの方はチェックを入れてください"
              />
            </Flex>
            <Flex direction="column" gap="sm">
              <Button type="submit" fullWidth>
                新規登録
              </Button>
              <Text ta="center">
                ログインは <Link href="/login">こちら</Link>
              </Text>
            </Flex>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
