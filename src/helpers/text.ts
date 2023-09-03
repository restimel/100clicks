
import { icons } from './icons';
import type { IconDesc } from '../stores/types';

type Chunk = {
    content: string | IconDesc;
    type: 'text' | 'icon' | 'line-feed' | 'italic' | 'bold' | 'link' | 'justify' | 'center' | 'markdown';
    title?: string;
};

export function splitText(rawText: string): Chunk[] {
    /**
     * :lineText: → icon
     * \n → new line
     * _text_ → italic
     * **text** → bold
     * [lineText](url) → url
     * |justify|text|/justify| → justifed text
     * |center|text|/center| → centered text
    **/
    const splittedText = rawText.split(/(:\w+:|[\n]|_\w[\s\S]*\w_|\*{2}\w[\s\S]*\w\*{2}|\[[^\]\n]+\]\([^)\n]+\)|\|justify\|[\s\S]+\|\/justify\||\|center\|[\s\S]+\|\/center\|)/);
    const chunks: Chunk[] = [];

    splittedText.forEach((str) => {
        if (str.startsWith(':') && str.endsWith(':')) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const icon = icons.get(str) ?? icons.get(':warning:')!;
            chunks.push({
                type: 'icon',
                content: icon[0],
                title: icon[1],
            });
        } else if (str === '\n') {
            chunks.push({
                type: 'line-feed',
                content: '\n',
            });
        } else if (str.startsWith('_') && str.endsWith('_')) {
            chunks.push({
                type: 'italic',
                content: str.slice(1, -1),
            });
        } else if (str.startsWith('*') && str.endsWith('*')) {
            chunks.push({
                type: 'bold',
                content: str.slice(2, -2),
            });
        } else if (str.startsWith('[') && str.endsWith(')')) {
            const data = str.match(/^\[(?<text>[^\]\n]+)\]\((?<url>[^)\n]+)\)$/);
            const url = data?.groups?.url;
            if (url !== '{url}') {
                chunks.push({
                    type: 'link',
                    title: url ?? '',
                    content: data?.groups?.text ?? '',
                });
            } else {
                /* Hack in order to Build with Svelte.
                    * Otherwise the compiler should complain about '{url}' is
                    * not reachable...
                    * NOTE: We should never execute these line of code */
                chunks.push({
                    type: 'text',
                    title: url ?? '',
                    content: data?.groups?.text ?? '',
                });
            }
        } else if (str.startsWith('|') && str.endsWith('|')) {
            const data = str.match(/^\|(?<style>justify|center)\|(?<text>[\s\S]*)\|\/\1\|$/);
            const {style, text} = data?.groups ?? {};

            if (style === 'justify') {
                chunks.push({
                    type: 'justify',
                    content: text,
                });
            } else if (style === 'center') {
                chunks.push({
                    type: 'center',
                    content: text,
                });
            } else {
                /* unknown style */
                chunks.push({
                    type: 'markdown',
                    content: text,
                });
            }

        } else {
            if (str.trim()) {
                chunks.push({
                    type: 'text',
                    content: str,
                });
            }
        }
    });

    return chunks;
}