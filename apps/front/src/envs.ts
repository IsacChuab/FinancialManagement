const endpoint = (import.meta.env.VITE_API_ENDPOINT as string);

if (!endpoint) {
  throw new Error('VITE_API_ENDPOINT is not defined');
}

export const API_ENDPOINT = endpoint;
