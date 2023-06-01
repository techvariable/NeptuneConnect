import { type Static } from '@sinclair/typebox'

import { type SEnv } from '../schemas/env'

export type TEnv = Static<typeof SEnv>
