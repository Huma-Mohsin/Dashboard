import { type SchemaTypeDefinition } from 'sanity'
import order from './order'
import { productSchema } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [order,productSchema],
}
