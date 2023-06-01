import { Type } from '@sinclair/typebox'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function StringEnum<T extends string[]> (values: [...T]) {
  return Type.Unsafe<T[number]>({ type: 'string', enum: values })
}

export const SQueryBuilder = Type.Object({
  read: Type.Optional(Type.Object({
    showMeta: Type.Boolean(),
    limit: Type.Integer({ minimum: 0, maximum: 50, default: 10 }),
    offset: Type.Integer({ minimum: 0, default: 0 }),
    order: Type.Optional(Type.Object({})),
    filter: Type.Optional(Type.Object({}))
  })),
  update: Type.Optional(Type.Object({
    updateId: Type.Union([Type.String(), Type.Number()]),
    changes: Type.Optional(Type.Object({}))
  })),
  delete: Type.Optional(Type.Object({
    deleteId: Type.Union([Type.String(), Type.Integer()])
  })),
  insert: Type.Optional(Type.Object({
    label: Type.String(),
    properties: Type.Object({})
  }))
})

export const SSNodeLabel = Type.Object({
  nodeLabel: Type.String(),
  mode: StringEnum(['update', 'delete', 'read', 'insert'])
})

export const SRawQuery = Type.Object({
  query: Type.String(),
  parameters: Type.Optional(Type.Object({}))
})

export const SHeaderAPIKey = Type.Object({
  'api-Key': Type.String()
})

export const SLogs = Type.Object({
  limit: Type.Integer({ minimum: 0, maximum: 50, default: 10 }),
  offset: Type.Integer({ minimum: 0, default: 0 }),
  sort: Type.Optional(Type.String()),
  order: Type.Optional(StringEnum(['asc', 'desc'])),
  filter_queryText: Type.Optional(Type.String()),
  filter_queryParameter: Type.Optional(Type.String()),
  filter_queryStatus: Type.Optional(Type.Number()),
  filter_email: Type.Optional(Type.String())
})

export const SQueryLog = Type.Object({
  key: Type.String()
})

export const SSaveQuery = Type.Object({
  queryTitle: Type.String(),
  queryText: Type.String(),
  queryParameter: Type.String()
})

export const SSaveQueryId = Type.Object({
  queryId: Type.Number()
})
