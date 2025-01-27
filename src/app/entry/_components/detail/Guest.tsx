import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import type { FC } from "react";
import { z } from "zod";

const schema = z.object({
  guestName: z.string().trim().min(2, { message: "2文字以上入力して" }),
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
  const form = useForm({
    initialValues: {
      guestName: "",
      courtId,
    },
    validate: zodResolver(schema),
  });
  return (
    <form
      onSubmit={form.onSubmit(async (values, event) => {
        open();
        event!.preventDefault();
        await guestAdd(values);
        close();
        form.reset();
      })}
    >
      <Flex direction="row" gap="xs">
        <TextInput
          name="guestName"
          placeholder="ゲスト登録"
          {...form.getInputProps("guestName")}
        />
        <Button style={{ padding: "8px" }} type="submit" size="xs">
          追加
        </Button>
      </Flex>
    </form>
  );
};
