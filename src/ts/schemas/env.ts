import { Type } from '@sinclair/typebox'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function StringEnum<T extends string[]>(values: [...T]) {
  return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}

export const SEnv = Type.Object({
  NODE_ENV: StringEnum(['development', 'production']),
  LOG_LEVEL: StringEnum(['debug', 'warning', 'error', 'info']),
  PORT: Type.String(),

  APP_URL: Type.String({ format: 'uri' }),

  EMAIL_PROVIDER: StringEnum(['sendgrid', 'mailgun']),
  EMAIL_PROVIDER_API_KEY: Type.String(),
  EMAIL_PROVIDER_REPLY_EMAIL: Type.String({ format: 'email' }),
  DOMAIN_NAME: Type.Optional(Type.String()),

  MODE: Type.String(),
  DEMO_USER_EMAIL: Type.String({ format: 'email' }),
  DEMO_USER_PASSWORD: Type.String(),

  AWS_ACCESS_KEY_ID: Type.Optional(Type.String()),
  AWS_SECRET_ACCESS_KEY: Type.Optional(Type.String()),
  AWS_SESSION_TOKEN: Type.Optional(Type.String()),
  AWS_DEFAULT_REGION: Type.Optional(Type.String()),
  S3_BUCKET_NAME: Type.Optional(Type.String()),

  NEPTUNE_ENDPOINT: Type.String(),
  NEPTUNE_PORT: Type.String(),
  USE_IAM: StringEnum(['true', 'false']),

  LOG_STORAGE_PROVIDER: StringEnum(['s3', 'local']),
  LOCAL_LOG_FOLDER: Type.Optional(Type.String()),

  ADMIN_NAME: Type.String(),
  ADMIN_EMAIL: Type.String(),
  ADMIN_PASSWORD: Type.String()
})
