import z from "zod";

const product = {
  name: z
    .string({
      message: 'Necessário um nome para o produto.'
    })
    .min(5, "Nome muito curto."),
  description: z
    .string()
    .min(20, "Descrição muito curta.")
    .optional(),
  price: z
    .number({
      message: 'Um valor para o produto é necessário.',
    })
    .optional(),
  quantity: z
    .number()
    .optional(),
  category: z
    .string({
      message: 'Necessário um código de fornecedor.'
    }),
  providerId: z
    .string({
      message: ''
    })
    .min(5, 'Código de fornecedor muito pequeno.'),
};

const create = z.object(product);

const edit = z.object({
  name: product.name.optional(),
  description: product.description,
  price: product.price.optional(),
  quantity: product.quantity,
  category: product.category.optional(),
  providerId: product.providerId.optional(),
})

const productSchema = {
  create,
  edit,
};

export default productSchema;