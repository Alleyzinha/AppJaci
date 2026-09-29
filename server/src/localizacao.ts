import { z } from 'zod';

// O horário é o da captura: reenviar uma posição antiga não a torna atual.
export const posicaoSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  capturadoEm: z
    .number()
    .int()
    .refine(
      (valor) => valor <= Date.now() + 30000 && valor >= Date.now() - 120000,
      'A posição expirou. Aguarde uma nova leitura do GPS.',
    ),
});
export const atualizacaoSchema = posicaoSchema.extend({
  idCompartilhamento: z.number().int().positive(),
});
