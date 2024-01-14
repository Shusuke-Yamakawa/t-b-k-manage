// import puppeteer from 'puppeteer';
import { Flex } from '@mantine/core';
import { Navbar } from '@/src/app/_layouts';

export default async function CardPage() {
  // const card = await findCardAll();
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <div>ログイン画面かな</div>
    </Flex>
  );
}
