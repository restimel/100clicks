/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, writable } from 'svelte/store';

/* Types */
import type { Writable } from 'svelte/store';

/* Generic types */

type ForEachCB<KEY, VALUE, OBJ> = (val: VALUE, key: KEY, map: OBJ) => void;
type ExtensionOption = Record<string | symbol, unknown>;

/* }}} */
/* {{{ Map */

type WritableMapExtension<ID, VALUE> = {
    /** Removes all elements from the Map object. */
    $clear: () => void;

    /** Removes the specified element from the Map object by key.
     * @param key
     * @returns boolean
     */
    $delete: (key: ID) => boolean;

    /** Returns a specified element from the Map object.
     * @param key
     * @returns value
     */
    $get: (key: ID) => VALUE | undefined;

    /** Returns a boolean indicating whether an element with the specified
     * key exists or not.
     * @param key
     * @returns boolean
     */
    $has: (key: ID) => boolean;

    /** Adds or updates an entry in the Map object with a specified key and
     * a value.
     * @param key
     * @param value
     */
    $set: (key: ID, value: VALUE) => void;

    /** Executes a provided function once per each key/value pair in the Map
     * object, in insertion order. */
    $forEach: (cb: ForEachCB<ID, VALUE, Map<ID, VALUE>>, ctx?: unknown) => void;

    /** Removes all elements from the Map object. */
    clear: () => void;

    /** Removes the specified element from the Map object by key.
     * @param key
     * @returns boolean
     */
    delete: (key: ID) => boolean;

    /** Returns a specified element from the Map object.
     * @param key
     * @returns value
     */
    get: (key: ID) => VALUE | undefined;

    /** Returns a boolean indicating whether an element with the specified
     * key exists or not.
     * @param key
     * @returns boolean
     */
    has: (key: ID) => boolean;

    /** Executes a provided function once per each key/value pair in the Map
     * object, in insertion order. */
    forEach: (cb: ForEachCB<ID, VALUE, Map<ID, VALUE>>, ctx?: unknown) => void;
};
export type WritableMap<ID, VALUE, EXTENSION> = Writable<Map<ID, VALUE>> & WritableMapExtension<ID, VALUE> & EXTENSION;

/**
Create a Writable store with a Map object that allows both updating and
reading by subscription.
Map methods extends this Writable store in order to modify it more easily.

@param value — initial value

@param start — start and stop notifications for subscriptions
*/
export function writableMap<
    ID = string,
    VALUE = any,
    EXTENSION extends ExtensionOption = ExtensionOption
>(
    origValue?: Map<ID, VALUE> | null,
    options?: (store: Writable<Map<ID, VALUE>>) => EXTENSION
):
    WritableMap<ID, VALUE, EXTENSION>
{
    const storeBuilder = () => {
        const value = writable<Map<ID, VALUE>>(origValue ?? new Map());
        const { subscribe, set, update } = value;

        const $set = (id: ID, value: VALUE) => {
            update((map) => {
                map.set(id, value);
                return map;
            });
        };

        const $get = (id: ID) => get(value).get(id);
        const $has = (id: ID) => get(value).has(id);
        const $clear = () => get(value).clear();

        const $delete = (id: ID) => {
            const result = $has(id);
            if (result) {
                update((map) => {
                    map.delete(id);
                    return map;
                });
            }
            return result;
        }

        const $forEach = (cb: ForEachCB<ID, VALUE, Map<ID, VALUE>>, ctx?: unknown) => {
            const map = get(value);
            map.forEach(cb, ctx);
        };

        const extension: WritableMapExtension<ID, VALUE> = {
            $set,
            // "set" is not possible because Svelte store already defines a "set" method

            $get,
            get: $get,

            $has,
            has: $has,

            $delete,
            delete: $delete,

            $clear,
            clear: $clear,

            $forEach,
            forEach: $forEach,
        };

        const extendedOptions: EXTENSION = options?.(value) ?? {} as EXTENSION;

        return {
            subscribe,
            set,
            update,
            ...extension,
            ...extendedOptions,
        };
    };

    return storeBuilder();
}

/* }}} */
/* {{{ Set */

type WritableSetExtension<VALUE> = {
    /** Adds an entry in the Set object.
     * @param value
     */
     $add: (value: VALUE) => void;

    /** Removes all elements from the Set object. */
    $clear: () => void;

    /** Removes the specified element from the Set object.
     * @param value
     * @returns boolean
     */
    $delete: (value: VALUE) => boolean;

    /** Returns a boolean indicating whether an element exists or not.
     * @param value
     * @returns boolean
     */
    $has: (value: VALUE) => boolean;

    /** Executes a provided function once per each value in the Set object,
     * in insertion order. */
    $forEach: (cb: ForEachCB<VALUE, VALUE, Set<VALUE>>, ctx?: unknown) => void;

    /** Adds an entry in the Set object.
     * @param value
     */
    add: (value: VALUE) => void;

    /** Removes all elements from the Set object. */
    clear: () => void;

    /** Removes the specified element from the Set object.
     * @param value
     * @returns boolean
     */
    delete: (value: VALUE) => boolean;

    /** Returns a boolean indicating whether an element exists or not.
     * @param value
     * @returns boolean
     */
    has: (value: VALUE) => boolean;

    /** Executes a provided function once per each value in the Set object,
     * in insertion order. */
    forEach: (cb: ForEachCB<VALUE, VALUE, Set<VALUE>>, ctx?: unknown) => void;

};
export type WritableSet<VALUE, EXTENSION> = Writable<Set<VALUE>> & WritableSetExtension<VALUE> & EXTENSION;

/**
Create a Writable store with a Map object that allows both updating and
reading by subscription.
Set methods extends this Writable store in order to modify it more easily.

@param value — initial value

@param start — start and stop notifications for subscriptions
*/
export function writableSet<
    VALUE = any,
    EXTENSION extends ExtensionOption = ExtensionOption
>(
    origValue?: Set<VALUE> | null,
    options?: (store: Writable<Set<VALUE>>) => EXTENSION
):
    WritableSet<VALUE, EXTENSION>
{
    const storeBuilder = () => {
        const value = writable<Set<VALUE>>(origValue ?? new Set());
        const { subscribe, set, update } = value;

        const $add = (val: VALUE) => {
            update((set) => {
                set.add(val);
                return set;
            });
        };

        const $has = (val: VALUE) => get(value).has(val);
        const $clear = () => get(value).clear();

        const $delete = (val: VALUE) => {
            const result = $has(val);
            if (result) {
                update((set) => {
                    set.delete(val);
                    return set;
                });
            }
            return result;
        }

        const $forEach = (cb: ForEachCB<VALUE, VALUE, Set<VALUE>>, ctx?: unknown) => {
            const set = get(value);
            set.forEach(cb, ctx);
        };

        const extension: WritableSetExtension<VALUE> = {
            $add,
            add: $add,

            $has,
            has: $has,

            $delete,
            delete: $delete,

            $clear,
            clear: $clear,

            $forEach,
            forEach: $forEach,
        };

        const extendedOptions: EXTENSION = options?.(value) ?? {} as EXTENSION;

        return {
            subscribe,
            set,
            update,
            ...extension,
            ...extendedOptions,
        };
    };

    return storeBuilder();
}

/* }}} */
/* {{{ Array */

type WritableArrayExtension<VALUE> = {
    /** Returns the item at the given index, allowing for positive and
     * negative integers.
     * Negative integers count back from the last item in the array.
     * @param key {number}
     * @returns value
     */
    $at: (key: number) => VALUE | undefined;

    /** Executes a provided function once per each value in the Array object,
     * in key order. */
    $forEach: (cb: ForEachCB<number, VALUE, Array<VALUE>>, ctx?: unknown) => void;

    /** adds one or more elements to the end of the array and returns the new
     * length of the array.
     * @param ...elements the elements to add to the array
     * @returns {number} the new length of the array.
     */
    $push: (...elements: VALUE[]) => number;


    /** Returns the item at the given index, allowing for positive and
     * negative integers.
     * Negative integers count back from the last item in the array.
     * @param key {number}
     * @returns value
     */
    at: (key: number) => VALUE | undefined;

    /** Executes a provided function once per each value in the Array object,
     * in key order. */
    forEach: (cb: ForEachCB<number, VALUE, Array<VALUE>>, ctx?: unknown) => void;

    /** adds one or more elements to the end of the array and returns the new
     * length of the array.
     * @param ...elements the elements to add to the array
     * @returns {number} the new length of the array.
     */
     push: (...elements: VALUE[]) => number;

    // Array.prototype[@@iterator]()
    // Array.prototype.concat()
    // Array.prototype.copyWithin()
    // Array.prototype.entries()
    // Array.prototype.every()
    // Array.prototype.fill()
    // Array.prototype.filter()
    // Array.prototype.find()
    // Array.prototype.findIndex()
    // Array.prototype.findLast()
    // Array.prototype.findLastIndex()
    // Array.prototype.flat()
    // Array.prototype.flatMap()
    // Array.prototype.group()
    // Experimental
    // Array.prototype.groupToMap()
    // Experimental
    // Array.prototype.includes()
    // Array.prototype.indexOf()
    // Array.prototype.join()
    // Array.prototype.keys()
    // Array.prototype.lastIndexOf()
    // Array.prototype.map()
    // Array.prototype.pop()
    // Array.prototype.reduce()
    // Array.prototype.reduceRight()
    // Array.prototype.reverse()
    // Array.prototype.shift()
    // Array.prototype.slice()
    // Array.prototype.some()
    // Array.prototype.sort()
    // Array.prototype.splice()
    // Array.prototype.toLocaleString()
    // Array.prototype.toString()
    // Array.prototype.unshift()
    // Array.prototype.values()

    /* Non normative methods */
    /** Set a value to the given key.
     * key can be negative number. In such case it counts from the end.
     * @param key {number} The index.
     * @param value the new value to set to the given index.
     */
    change: (key: number, value: VALUE) => void;
};
export type WritableArray<VALUE, EXTENSION> = Writable<VALUE[]> & WritableArrayExtension<VALUE> & EXTENSION;

/**
Create a Writable store with an Array object that allows both updating and
reading by subscription.
Array methods extends this Writable store in order to modify it more easily.

@param value — initial value

@param start — start and stop notifications for subscriptions
*/
export function writableArray<
    VALUE = any,
    EXTENSION extends ExtensionOption = ExtensionOption
>(
    origValue?: VALUE[] | null,
    options?: (store: Writable<VALUE[]>) => EXTENSION
):
    WritableArray<VALUE, EXTENSION>
{
    const storeBuilder = () => {
        const value = writable<VALUE[]>(origValue ?? []);
        const { subscribe, set, update } = value;

        const $forEach = (cb: ForEachCB<number, VALUE, VALUE[]>, ctx?: unknown) => {
            const arr = get(value);
            arr.forEach(cb, ctx);
        };
        const $push = (...elements: VALUE[]) => {
            const arr = get(value);
            const length = arr.length + elements.length;
            update((arr) => {
                arr.push(...elements);
                return arr;
            })
            return length;
        };
        const $at = (key: number) => get(value).at(key);

        const extension: WritableArrayExtension<VALUE> = {
            $at,
            at: $at,

            $forEach,
            forEach: $forEach,

            $push,
            push: $push,

            change: (key: number, val: VALUE) => {
                update((arr) => {
                    if (key >= 0) {
                        arr[key] = val;
                    } else {
                        const idx = arr.length + key;
                        if (idx < 0) {
                            arr[0] = val;
                        } else {
                            arr[idx] = val;
                        }
                    }
                    return arr;
                });
            },
        };

        const extendedOptions: EXTENSION = options?.(value) ?? {} as EXTENSION;

        return {
            subscribe,
            set,
            update,
            ...extension,
            ...extendedOptions,
        };
    };

    return storeBuilder();
}

/* }}} */

/* {{{ Extensions */

type WritableIncMapOptions<KEY> = {
    inc: (key: KEY, value?: bigint) => void;
    dec: (key: KEY, value?: bigint) => void;
};

export const writableIncMap = <KEY = number>(value?: Map<KEY, bigint>) => {
    return writableMap<KEY, bigint, WritableIncMapOptions<KEY>>(value, (store: Writable<Map<KEY, bigint>>) => {
        const {update} = store;
        return {
            inc: (key: KEY, val = 1n) => {
                update((map) => {
                    const value = map.get(key) ?? 0n;
                    map.set(key, value + val);
                    return map;
                });
            },
            dec: (key: KEY, val = 1n) => {
                update((map) => {
                    const value = map.get(key) ?? 0n;
                    map.set(key, value - val);
                    return map;
                });
            },
        };
    });
};

/* }}} */
