import axios from "axios";
import qs from "qs";

export const notify_line = async (
  msg: string,
  token = "0qWBwrgX4NNRwvW437ts2PMwJqTccdke934hBetGAqh",
) => {
  const BASE_URL = "https://notify-api.line.me";
  const PATH = "/api/notify";
  const config = {
    baseURL: BASE_URL,
    url: PATH,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    data: qs.stringify({
      message: `\n${msg}`,
    }),
  };
  await axios.request(config);
};
