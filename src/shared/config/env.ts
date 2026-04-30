const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl || typeof rawBaseUrl !== 'string') {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and set the backend URL.',
  );
}

export const env = {
  apiBaseUrl: rawBaseUrl.replace(/\/$/, ''),
} as const;
