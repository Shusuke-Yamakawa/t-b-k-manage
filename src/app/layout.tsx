import "@mantine/core/styles.css";
import NextAuthProvider from "@/src/app/_providers/NextAuth";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "../../theme";

export const metadata = {
  title: "T.B.K. Manage",
  description: "T.B.K.の練習会にエントリーできる",
  metadataBase: new URL(process.env.URL ?? "http://localhost:3004"),
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
      </head>
      <body>
        <NextAuthProvider>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications position="top-center" autoClose={3000} />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
