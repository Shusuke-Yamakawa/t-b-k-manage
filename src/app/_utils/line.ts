import axios from "axios";

export const notifyLineMessage = async (msg: string) => {
  const token =
    "vgPr+GEuAOTCRm3BTryifLA8KnqN9w4enMlatPreffOOmQV0Hb4eHvyLaRbdGw3tCMtHYkpFPR5FM9J7qUYCtknF2C0vH2sP2E/MjcX09vlMb0LuevHEKMnzYevWly6XaDmA7+XNYxBplwBUi1bEtQdB04t89/1O/w1cDnyilFU="; // チャネルアクセストークン
  const userID = "U10923034bcc73df1c017d261ac7b1112";
  const BASE_URL = "https://api.line.me";
  const PATH = "/v2/bot/message/push";
  const config = {
    baseURL: BASE_URL,
    url: PATH,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      to: userID,
      messages: [
        {
          type: "text",
          text: `${msg}\nFivot`,
        },
      ],
    },
  };

  try {
    const response = await axios.request(config);
    console.log("メッセージ送信成功:", response.data);
  } catch (error) {
    console.error("メッセージ送信失敗:", error);
  }
};
