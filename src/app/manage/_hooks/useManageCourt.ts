import { API_URL } from "@/src/app/_consts/environment.const";
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { useState } from "react";

export const useManageCourt = () => {
  const [selectedPublic, setSelectedPublic] = useState<number[]>([]);
  const [selectedHold, setSelectedHold] = useState<number[]>([]);

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
  return {
    selectedPublic,
    setSelectedPublic,
    selectedHold,
    setSelectedHold,
    publicCourt,
    holdCourt,
  };
};
