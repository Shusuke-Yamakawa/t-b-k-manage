import { z } from 'zod';
import { schema } from '@/src/app/card/_components/CardList';

export type RegisterNewType = z.infer<typeof schema>;
