import * as Joi from 'joi';

/**
 * Joi valida las variables de entorno al boot.
 * Si algo no encaja, la app no arranca — fail fast.
 */
export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  GITHUB_API_URL: Joi.string().uri().default('https://api.github.com'),
  GITHUB_TOKEN: Joi.string().allow('').optional(),
  CORS_ORIGIN: Joi.string().allow('').optional(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
});
