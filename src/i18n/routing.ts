import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

const locales = ["en", "fr", "de", "pt"];
const defaultLocale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
