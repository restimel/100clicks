import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';

import en from './en.json';
import fr from './fr.json';

export const defaultLocale = 'en';
export const languages = new Map([['en', 'English'], ['fr', 'Français']]);

export function extractLocale (locale: string | null): string {
    if (!locale) {
        return defaultLocale;
    }
    return locale.replace(/-.*$/, '');
}

/** Wrapper to fake translation */
export function $t(str: string): string {
    return str;
}

addMessages('en', en);
addMessages('fr', fr);

console.log('locale:', extractLocale(getLocaleFromNavigator()));

init({
    fallbackLocale: defaultLocale,
    initialLocale: extractLocale(getLocaleFromNavigator()),
});

/* {{{ types */

// type InterpolationValues = Record<string, string | number | boolean | Date | FormatXMLElementFn<unknown> | null | undefined> | undefined;
type InterpolationValues = Record<string, string | number | boolean | Date | null | undefined> | undefined;
interface MessageObject {
    id: string;
    locale?: string;
    format?: string;
    default?: string;
    values?: InterpolationValues;
}
export type I18n = (id: string | MessageObject, options?: Omit<MessageObject, "id"> | undefined) => string;

/* }}} */
