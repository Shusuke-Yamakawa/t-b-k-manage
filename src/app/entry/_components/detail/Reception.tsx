import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import type { FC } from "react";
import { z } from "zod";

const schema = z.object({
  reception: z
    .string()
    .trim()
    .min(1, { message: "1文字以上入力して" })
    .max(10, { message: "10文字以内で" }),
});

type Props = {
  courtId: number;
  receptionNotify: (fd: {
    reception: string;
    courtId: number;
  }) => Promise<void>;
  open: () => void;
  close: () => void;
};

/**
 * @package
 */
export const Reception: FC<Props> = ({
  courtId,
  receptionNotify,
  open,
  close,
}) => {
  const form = useForm({
    initialValues: {
      reception: "しゅう",
      courtId,
    },
    validate: zodResolver(schema),
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        open();
        await receptionNotify(values);
        close();
        form.reset();
      })}
    >
      <Stack gap="md">
        <TextInput label="受付" {...form.getInputProps("reception")} />
        <Button color="green" type="submit">
          受付通知
        </Button>
      </Stack>
    </form>
  );
};
