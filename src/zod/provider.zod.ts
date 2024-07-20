import z from "zod";

const provider = {
  name: z
    .string({
      message: 'Necessário um nome para o fornecedor.'
    })
    .min(5, "Nome muito curto."),
  country_code: z
    .string({
      message: 'Necessário um código do país do fornecedor.'
    })
    .min(5, "Código muito curto."),
};

const create = z.object(provider);

const edit = z.object({
  name: provider.name.optional(),
  country_code: provider.country_code.optional(),
});

const providerSchema = {
  create,
  edit,
}

export default providerSchema;