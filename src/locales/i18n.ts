import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';

import en from './en.json';
import eo from './eo.json';
import fr from './fr.json';

type Language = {
    label: string;
    svg: string;
}

export const defaultLocale = 'en';
export const languages = new Map<string, Language>([
    ['en', {
        label: 'English',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
            <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g>
        </svg>`,
        /* american */
        // svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 7410 3900">
        //     <path fill="#b22234" d="M0 0h7410v3900H0z"/><path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" stroke-width="300"/><path fill="#3c3b6e" d="M0 0h2964v2100H0z"/><g fill="#fff"><g id="d"><g id="c"><g id="e"><g id="b"><path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"/><use xlink:href="#a" y="420"/><use xlink:href="#a" y="840"/><use xlink:href="#a" y="1260"/></g><use xlink:href="#a" y="1680"/></g><use xlink:href="#b" x="247" y="210"/></g><use xlink:href="#c" x="494"/></g><use xlink:href="#d" x="988"/><use xlink:href="#c" x="1976"/><use xlink:href="#e" x="2470"/></g>
        // </svg>`,
    }],
    ['eo', {
        label: 'Esperantujo',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
        <path fill="#FFF" d="m0,0h202v202H0"/>
        <path fill="#090" d="m0,200H200V0H600V400H0m58-243 41-126 41,126-107-78h133"/>
        </svg>`,
    }],
    ['fr', {
        label: 'Français',
        svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
            <rect width="30" height="60" fill="#0055A4"/>
            <rect x="30" width="30" height="60" fill="#FFFFFF"/>
            <rect x="60" width="30" height="60" fill="#EF4135"/>
        </svg>`,
    }],
]);

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
addMessages('eo', eo);
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
