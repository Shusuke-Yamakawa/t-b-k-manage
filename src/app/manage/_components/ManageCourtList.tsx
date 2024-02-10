/* eslint-disable no-restricted-syntax */

'use client';

import { Button, Checkbox, Flex, LoadingOverlay, Table } from '@mantine/core';
import { FC, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { GetCourt } from '@/src/app/_lib/db/getCourt';
import { Card } from '@/src/app/_lib/db/card';
import { API_URL } from '@/src/app/_consts/environment.const';
import { Id } from '@/src/app/_types/type';

type Props = {
  data: (Id & GetCourt & { card: Card })[];
};

export const ManageCourtList: FC<Props> = ({ data }) => {
  const [selectedPublic, setSelectedPublic] = useState<number[]>([]);
  const [selectedHold, setSelectedHold] = useState<number[]>([]);

  const [visible, { open }] = useDisclosure(false);
  const publicCourt = async () => {
    for (const id of selectedPublic) {
      try {
        const getCourt = await axios.get(`${API_URL}manage/api/${id}`);
        const court = getCourt.data;
        const updPublicFlg = !court.public_flg;
        await axios.put(`${API_URL}manage/api/${id}`, {
          publicFlg: updPublicFlg,
          holdFlg: court.hold_flg,
        });
      } catch (error) {
        console.error(`Failed to update court with ID: ${id}`);
        break;
      }
    }
    // リフェッチする
    window.location.reload();
  };
  const holdCourt = async () => {
    for (const id of selectedHold) {
      try {
        const getCourt = await axios.get(`${API_URL}manage/api/${id}`);
        const court = getCourt.data;
        const updHoldFlg = !court.hold_flg;
        await axios.put(`${API_URL}manage/api/${id}`, {
          publicFlg: court.public_flg,
          holdFlg: updHoldFlg,
        });
      } catch (error) {
        console.error(`Failed to update court with ID: ${id}`);
        break;
      }
    }
    // リフェッチする
    window.location.reload();
  };

  const rows = data.map((d) => (
    <Table.Tr
      key={d.id}
      bg={
        selectedPublic.includes(d.id) || selectedHold.includes(d.id)
          ? 'var(--mantine-color-blue-light)'
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedPublic.includes(d.id)}
          onChange={(event) =>
            setSelectedPublic(
              event.currentTarget.checked
                ? [...selectedPublic, d.id]
                : selectedPublic.filter((position) => position !== d.id)
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedHold.includes(d.id)}
          onChange={(event) =>
            setSelectedHold(
              event.currentTarget.checked
                ? [...selectedHold, d.id]
                : selectedHold.filter((position) => position !== d.id)
            )
          }
        />
      </Table.Td>
      <Table.Td>{d.month}</Table.Td>
      <Table.Td>{d.day}</Table.Td>
      <Table.Td>{d.from_time}</Table.Td>
      <Table.Td>{d.to_time}</Table.Td>
      <Table.Td>{d.court}</Table.Td>
      <Table.Td>{d.card.user_nm}</Table.Td>
      <Table.Td>{d.public_flg ? '公開' : '非公開'}</Table.Td>
      <Table.Td>{d.hold_flg ? '開催' : '不開催'}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction="column" gap="md" m="lg">
      <Button
        onClick={async () => {
          open();
          await publicCourt();
        }}
        variant="light"
      >
        公開
      </Button>
      <Button
        onClick={async () => {
          open();
          await holdCourt();
        }}
        variant="light"
      >
        開催
      </Button>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>公開</Table.Th>
            <Table.Th>開催</Table.Th>
            <Table.Th>月</Table.Th>
            <Table.Th>日付</Table.Th>
            <Table.Th>開始時間</Table.Th>
            <Table.Th>終了時間</Table.Th>
            <Table.Th>コート名</Table.Th>
            <Table.Th>カード名義</Table.Th>
            <Table.Th>公開設定</Table.Th>
            <Table.Th>開催設定</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
};
