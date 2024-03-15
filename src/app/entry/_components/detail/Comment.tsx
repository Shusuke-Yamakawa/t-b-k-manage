import { Text, Button, Paper, Space, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FC } from 'react';
import { z } from 'zod';
import { EntryDataWithCardAll } from '@/src/app/court/_types/court.type';

const schema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, { message: '1文字以上入力して' })
    .max(100, { message: '100文字以内で' }),
});

type FormProps = {
  courtId: number;
  commentAdd: (fd: { comment: string; courtId: number }) => Promise<void>;
  open: () => void;
  close: () => void;
};

/**
 * @package
 */
export const CommentForm: FC<FormProps> = ({ courtId, commentAdd, open, close }) => {
  const formComment = useForm({
    initialValues: {
      comment: '',
      courtId,
    },
    validate: zodResolver(schema),
  });
  return (
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
  );
};

type Props = {
  data: EntryDataWithCardAll;
};

/**
 * @package
 */
export const Comments: FC<Props> = ({ data }) => (
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
