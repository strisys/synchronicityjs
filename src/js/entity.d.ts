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
    is(other: (Enum<T> | string)): boolean;
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
export declare abstract class Composite<T extends Composite<T>> extends Identifiable {
    private _parent;
    private _components;
    protected constructor(id?: string, parent?: T);
    get root(): T;
    get isRoot(): boolean;
    get isLeaf(): boolean;
    get level(): number;
    get parent(): T;
    set parent(value: T);
    protected onSetItemPost: (element: T) => void;
    private createComponentsMapAndObserve;
    protected createComponentsMap(): CompositeMap<T>;
    get components(): CompositeMap<T>;
    toString(): string;
}
export declare class IdentifiableMap<T> {
    protected readonly _inner: Map<string, T>;
    private _fnPre;
    private _fnPost;
    constructor(elements?: (T | T[]));
    protected get itemKey(): string;
    get size(): number;
    get isEmpty(): boolean;
    get values(): T[];
    get keys(): string[];
    observeSetPre(fnPre: (element: T) => void): void;
    observeSetPost(fnPost: (element: T) => void): void;
    protected onSetItemPre(element: T): void;
    protected onSetItemPost(element: T): void;
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
    equals(other: IdentifiableMap<T>): boolean;
    toString(): string;
}
export declare class CompositeMap<T extends Composite<T>> extends IdentifiableMap<T> {
    constructor(elements?: (T | T[]));
    flatten(enumeration: (CompositeEnumeration | CompositeEnumerationCode)): T[];
    forEachDeep(enumeration: (CompositeEnumeration | CompositeEnumerationCode), fn: (item: T, index: number) => void): void;
}
export declare type CompositeEnumerationCode = ('null' | 'depth-first' | 'breadth-first');
declare class CompositeEnumeration extends Enum<CompositeEnumeration> {
    private static readonly TypeName;
    static readonly Null: CompositeEnumeration;
    static readonly DepthFirst: CompositeEnumeration;
    static readonly BreadthFirst: CompositeEnumeration;
    private constructor();
    get isDepthFirst(): boolean;
    get isBreadthFirst(): boolean;
    static tryParse(keyOrValue: (string | CompositeEnumerationCode)): CompositeEnumeration;
    static get size(): number;
    static get random(): CompositeEnumeration;
    static get entries(): CompositeEnumeration[];
    static get keys(): string[];
    static get values(): CompositeEnumerationCode[];
    static forEach(fn: (value: CompositeEnumeration, index: number) => void): void;
}
export {};
