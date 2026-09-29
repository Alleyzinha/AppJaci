import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'Digite seu nome completo'),

    email: z.string().trim().email('Digite um e-mail válido'),

    phone: z.string().trim().min(10, 'Digite um telefone válido'),

    password: z
      .string()
      .min(8, 'A senha deve possuir pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve possuir uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve possuir uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve possuir um número')
      .regex(/[^A-Za-z0-9]/, 'A senha deve possuir um símbolo'),

    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',

    path: ['confirmPassword'],
  });
