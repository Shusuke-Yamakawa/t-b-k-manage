import { Button, TextInput, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { FC } from 'react';
import { z } from 'zod';

const schema = z.object({
  guestName: z.string().trim().min(2, { message: '2文字以上入力して' }),
});

type Props = {
  courtId: number;
  guestAdd: (fd: { guestName: string; courtId: number }) => Promise<void>;
  open: () => void;
  close: () => void;
};

/**
 * @package
 */
export const Guest: FC<Props> = ({ courtId, guestAdd, open, close }) => {
  const formGuest = useForm({
    initialValues: {
      guestName: '',
      courtId,
    },
    validate: zodResolver(schema),
  });
  return (
    <form
      onSubmit={formGuest.onSubmit(async (values, event) => {
        open();
        event!.preventDefault();
        await guestAdd(values);
        close();
        formGuest.reset();
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
  );
};
