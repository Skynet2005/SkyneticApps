
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Determine the locale, defaulting if necessary
  const resolvedLocale = await requestLocale;
  const locale = routing.locales.includes(resolvedLocale as any) ? resolvedLocale : routing.defaultLocale;

  // Load and return the locale-specific messages
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
