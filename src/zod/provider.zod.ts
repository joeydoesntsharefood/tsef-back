import z from "zod";

const providerSchema = z.object({
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
});

export default providerSchema;