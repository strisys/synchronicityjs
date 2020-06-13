export interface IIdentifiable {
    id: string;
    isNull: boolean;
    equals(other: any): boolean;
}
export interface IEnum extends IIdentifiable {
    value: string;
}
export declare const isNullOrUndefined: (val: any) => boolean;
declare type EnumCacheType = ('id' | 'value');
export declare abstract class Enum<T> implements IEnum {
    private static readonly _idMap;
    private static readonly _vlMap;
    private readonly _id;
    private readonly _value;
    protected constructor(enumTypeName: string, id: string, value: string);
    private static normalize;
    get isNull(): boolean;
    get id(): string;
    get value(): string;
    is(other: Enum<T>): boolean;
    static getSize(enumTypeName: string): number;
    private static getMap;
    protected static attemptGet: (enumTypeName: string, cacheType: EnumCacheType, value: string, isCaseInsensitive?: boolean) => IEnum;
    protected static attemptParse: (enumTypeName: string, keyOrValue: string, isCaseInsensitive?: boolean) => any;
    protected static getEntries(enumTypeName: string, cacheType?: EnumCacheType): IEnum[];
    protected static getRandom(enumTypeName: string): IEnum;
    protected static getKeys(enumTypeName: string): string[];
    protected static getValues(enumTypeName: string): string[];
    protected static forEachOne(enumTypeName: string, fn: (value: IEnum, index: number) => void): void;
    isNotOneOf: (values: Array<Enum<T>>) => boolean;
    isOneOf: (values: Array<Enum<T>>) => boolean;
    equals(other: Enum<T>): boolean;
    toString(): string;
}
export declare abstract class Identifiable implements IIdentifiable {
    private _id;
    protected constructor(id?: string);
    get isNull(): boolean;
    get id(): string;
    set id(value: string);
    equals(other: Identifiable): boolean;
    toString(): string;
}
export declare abstract class IdentifiableMap<T> {
    protected readonly _inner: Map<string, T>;
    constructor(elements?: (T | T[]));
    protected get itemKey(): string;
    get size(): number;
    get isEmpty(): boolean;
    get values(): T[];
    get keys(): string[];
    protected onSetItems(elements: (T | T[])): (T | T[]);
    set(elements: (T | T[])): IdentifiableMap<T>;
    clear(): IdentifiableMap<T>;
    protected tryGetKeyBy(value: (T | string | number)): string;
    delete(value: (T | string | number)): T;
    get(value: (string | number)): T;
    has(value: (T | string | number)): boolean;
    forEach(fn: (item: T, index: number) => void): void;
    filter(fn: (item: T) => boolean): T[];
    map(fn: (item: T, index: number) => any): any;
    any(keys: (string[] | number[])): boolean;
    indexOf(value: (T | string)): number;
}
export {};
