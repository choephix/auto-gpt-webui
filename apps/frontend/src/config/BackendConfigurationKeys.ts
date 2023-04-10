import { BackendServiceState } from '../entities/BackendServiceState';

type BackendConfigurationKey = keyof NonNullable<
  BackendServiceState['configuration']
>;

export const BackendConfigurationKeys: Partial<
  Record<BackendConfigurationKey, 'required' | 'optional'>
> = {
  OPENAI_API_KEY: 'required',
  PINECONE_API_KEY: 'required',
  PINECONE_ENV: 'required',

  GOOGLE_API_KEY: 'optional',
  CUSTOM_SEARCH_ENGINE_ID: 'optional',

  IMAGE_PROVIDER: 'optional',
  HUGGINGFACE_API_TOKEN: 'optional',

  MEMORY_BACKEND: 'optional',
  // REDIS_HOST: 'optional',
  // REDIS_PORT: 'optional',
  // REDIS_PASSWORD: 'optional',

  // // @ts-ignore
  // MOCK_REQUIRED: 'required',
  // // @ts-ignore
  // MOCK_OPTIONAL: 'optional',
};

export const requiredBackendConfigurationKeys = Object.keys(
  BackendConfigurationKeys,
).filter(
  (key) =>
    BackendConfigurationKeys[key as BackendConfigurationKey] === 'required',
) as Array<BackendConfigurationKey>;
