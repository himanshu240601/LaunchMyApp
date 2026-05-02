const FALLBACK_REDIRECT_PATH = "/create/edit";
const INTERNAL_URL_BASE = "https://launchmyapp.local";

export function getSafeRedirectPath(
  value: string | null | undefined,
  fallbackPath = FALLBACK_REDIRECT_PATH,
) {
  if (!value) {
    return fallbackPath;
  }

  try {
    const parsedUrl = new URL(value, INTERNAL_URL_BASE);

    if (parsedUrl.origin !== INTERNAL_URL_BASE) {
      return fallbackPath;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return fallbackPath;
  }
}
