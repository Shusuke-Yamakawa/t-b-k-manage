import { API_URL } from "@/src/app/_consts/environment.const";
import {
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import type { FC } from "react";

type Props = { opened: boolean; close: () => void };

export const CourtAddModal: FC<Props> = ({ opened, close }) => {
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      cardId: "10041424",
      year: 2025,
      month: 4,
      day: 1,
      fromTime: 9,
      toTime: 11,
      court: "大沢総合4ばん",
      reserveNo: "",
      publicFlg: "非公開",
    },
  });

  return (
    <Modal opened={opened} onClose={close} title="コート登録">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            toggle();
            await axios.post(`${API_URL}manage/api/`, values);
          } catch (error) {
            notifications.show({
              color: "red",
              title: "エラーが発生",
              message: "コート登録処理で失敗しました",
            });
          }
          window.location.reload();
        })}
      >
        <Flex direction="column" gap="sm">
          <TextInput label="カードID" {...form.getInputProps("cardId")} />
          <NumberInput label="年" {...form.getInputProps("year")} />
          <NumberInput label="月" {...form.getInputProps("month")} />
          <NumberInput label="日" {...form.getInputProps("day")} />
          <NumberInput label="開始時間" {...form.getInputProps("fromTime")} />
          <NumberInput label="終了時間" {...form.getInputProps("toTime")} />
          <TextInput label="コート名" {...form.getInputProps("court")} />
          <TextInput label="予約番号" {...form.getInputProps("reserveNo")} />
          <Select
            label="公開フラグ"
            data={[
              { label: "非公開", value: "非公開" },
              { label: "公開", value: "公開" },
            ]}
            {...form.getInputProps("publicFlg")}
          />
          <Button mt={16} type="submit" variant="light">
            コート登録
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
