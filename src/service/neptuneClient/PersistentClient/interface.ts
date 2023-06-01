// import * as gremlin from "gremlin";
import { type GroovyStatement } from '../index'

export interface INeptuneClientPersistent {
  query: <T = any>(statement: GroovyStatement) => Promise<T[]>

  open: () => Promise<void>

  close: () => Promise<void>
}
