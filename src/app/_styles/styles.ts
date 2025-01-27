import type { MantineStyleProp } from "@mantine/core";

export const notificationsStyle = {
  width: "300px",
  position: "fixed",
  top: "16px",
  left: "50%",
  transform: "translateX(-50%)",
} as const satisfies MantineStyleProp;
