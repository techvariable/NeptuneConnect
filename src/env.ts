import 'dotenv/config'
import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'

import { SEnv } from './ts/schemas/env'
import { type TEnv } from './ts/types/env'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends TEnv { }
  }
}

(() => {
  const ajv = new Ajv()
  ajvFormats(ajv)

  const validate = ajv.compile(SEnv)

  const env = process.env

  const valid = validate(env)
  if (!valid) {
    console.log(validate.errors)
    throw Error('.env file is not valid')
  }
})()
