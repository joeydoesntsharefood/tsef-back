import passwordValidate from "@utils/passwordValidate";
import z from "zod";

const user = {
  name: z
    .string()
    .optional(),
  email: z
    .string()
    .email({
      message: 'E-mail invalido.'
    }),
  password: z
    .string()
    .refine(passwordValidate,{
      message: `
        A senha deve ter pelo menos 8 caracteres e incluir pelo menos uma 
        letra maiúscula, uma letra minúscula, um número e 
        um caractere especial.
      `,
    }),
}

const create = z.object(user);

const edit = z.object({
  name: user.name,
  email: user.email.optional(),
  password: user.password.optional(),
});

const userSchema = {
  create,
  edit,
}

export default userSchema;