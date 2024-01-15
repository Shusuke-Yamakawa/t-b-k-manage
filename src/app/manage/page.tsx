import { Flex } from '@mantine/core';
import { Navbar } from '@/src/app/_layouts';
import { findGetCourtOverCurrentCourt } from '@/src/app/_lib/db/getCourt';
import { ManageCourtList } from '@/src/app/manage/_components/ManageCourtList';

const ManageCourtPage = async () => {
  const getCourtList = await findGetCourtOverCurrentCourt();
  return (
    <Flex direction="row" gap="md">
      <Navbar />
      <ManageCourtList data={getCourtList} />
    </Flex>
  );
};

export default ManageCourtPage;
