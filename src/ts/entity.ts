/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from 'uuid';

export interface IIdentifiable {
  id: string;
  isNull: boolean;
  equals(other): boolean;
}

export interface IEnum extends IIdentifiable {
  value: string;
}

const guid = (): string => {
  return v4();
};

export const isNullOrUndefined = (val: any): boolean => {
  return ((val === null) || (val === undefined));
};

const equals = (primary: IIdentifiable, other: IIdentifiable): boolean => {
  if (isNullOrUndefined(primary)) {
    return false;
  }

  if (isNullOrUndefined(other)) {
    return false;
  }

  return ((primary === other) || (primary.id === other.id));
}

type EnumCacheType = ('id' | 'value');

export abstract class Enum<T> implements IEnum {
  private static readonly _idMap: Map<string, Map<string, any>> = new Map();
  private static readonly _vlMap: Map<string, Map<string, any>> = new Map();
  private readonly _id: string;
  private readonly _value: string;

  protected constructor(enumTypeName: string, id: string, value: string) {
    this._id = id;
    this._value = value;

    const ctx = Enum.normalize(enumTypeName);

    if (!Enum._idMap.has(ctx)) {
      Enum._idMap.set(ctx, new Map());
      Enum._vlMap.set(ctx, new Map());
    }

    Enum._idMap.get(ctx).set(this._id.toString(), this);
    Enum._vlMap.get(ctx).set(this._value.toString(), this);
  }

  private static normalize(enumTypeName: string) {
    return enumTypeName.toLowerCase().trim();
  }

  public get isNull(): boolean {
    return ((!this._id) || (this._id === '0'));
  }

  public get id(): string {
    return this._id;
  }

  public get value(): string {
    return this._value;
  }

  public is(other: (Enum<T> | string)): boolean {
    if (!other) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (typeof(other) === 'string') {
      return (other === this.value || other === this.id);
    }

    return ((this._id === other.id) || (this._value === other.value));
  }

  public static getSize(enumTypeName: string): number {
    return Enum.getEntries(enumTypeName).length;
  }

  private static getMap(enumTypeName: string, cacheType: EnumCacheType): Map<string, any> {
    const cache = ((cacheType === 'id') ? Enum._idMap : Enum._vlMap);
    return cache.get(Enum.normalize(enumTypeName));
  }

  protected static attemptGet = (enumTypeName: string, cacheType: EnumCacheType, value: string, isCaseInsensitive = true): IEnum => {
    if (!value) {
      return null;
    }

    const cache = Enum.getMap(enumTypeName, cacheType);
    let key: string = ((typeof (value) === 'string') ? value.trim() : '');

    if (cache.has(key)) {
      return cache.get(key);
    }

    if (isCaseInsensitive) {
      key = Array.from(cache.keys()).find((k) => {
        return (k.toLowerCase() === key.toLowerCase());
      })
    }

    return (cache.get(key) || null);
  }

  protected static attemptParse = (enumTypeName: string, keyOrValue: string, isCaseInsensitive = true): any => {
    return (Enum.attemptGet(enumTypeName, 'id', keyOrValue, isCaseInsensitive) || Enum.attemptGet(enumTypeName, 'value', keyOrValue, isCaseInsensitive));
  }

  protected static getEntries(enumTypeName: string, cacheType: EnumCacheType = 'id'): IEnum[] {
    return Array.from(Enum.getMap(enumTypeName, cacheType).values()).filter((entry) => {
      return !entry.isNull;
    });
  }

  protected static getRandom(enumTypeName: string): IEnum {
    const entries = Enum.getEntries(enumTypeName, 'id');
    const index = Math.floor((Math.random() * entries.length));
    return entries[index];
  }

  protected static getKeys(enumTypeName: string): string[] {
    return Enum.getEntries(enumTypeName, 'id').map((entry) => {
      return entry.id;
    })
  }

  protected static getValues(enumTypeName: string): string[] {
    return Enum.getEntries(enumTypeName, 'value').map((entry) => {
      return entry.value;
    })
  }

  protected static forEachOne(enumTypeName: string, fn: (value: IEnum, index: number) => void): void {
    Enum.getEntries(enumTypeName).forEach(fn);
  }

  public isNotOneOf = (values: Array<Enum<T>>): boolean => {
    return !this.isOneOf(values);
  }

  public isOneOf = (values: Array<Enum<T>>): boolean => {
    if (!values) {
      return false;
    }

    return (values.findIndex((v) => {
      return this.equals(v);
    }) > -1);
  }

  public equals(other: Enum<T>): boolean {
    return equals(this, other);
  }

  public toString(): string {
    return this.value;
  }
}

export abstract class Identifiable implements IIdentifiable {
  private _id: string;

  protected constructor(id: string = null) {
    this._id = (id || null);
  }

  public get isNull(): boolean {
    return (this._id === '0');
  }

  public get id(): string {
    return this._id || (this._id = guid());
  }

  public set id(value: string) {
    this._id = (value || this._id || guid());
  }

  public equals(other: Identifiable): boolean {
    return equals(this, other);
  }

  public toString(): string {
    return (this.id || 'null');
  }
}

// export abstract class Composite<T extends Composite<T, M>, M extends CompositeMap<T, M>> extends Identifiable {
//   private _parent: T = null;
//   private _components: M = null;

//   protected constructor(id: string = null, parent: T = null) {
//     super(id);
//     this._parent = parent;
//   }

//   public get url(): string {
//     return '';
//   }

//   public get root(): T {
//     let node: T = this.parent;

//     while (node) {
//       node = node.parent;
//     }

//     return node;
//   }

//   public get isRoot(): boolean {
//     return (Boolean(this._parent) === false);
//   }

//   public get level(): number {
//     if (this.isRoot) {
//       return 0;
//     }

//     let node: T = this.parent;
//     let level = 0;

//     while (node) {
//       node = node.parent;
//       level++;
//     }

//     return level;
//   }

//   public get parent(): T {
//     return this._parent;
//   }

//   public set parent(value: T) {
//     if (this._parent) {
//       throw new Error(`Invalid operation.  The parent has already been set on the composite [${this.id}].`)
//     }

//     this._parent = value;
//   }

//   protected onSetItemPost(element: T): void {
//     element.parent = (<T>(this as unknown));
//   }

//   private createMapAndObserve() {
//     const map: M = this.createMap();
//     map.observeSetPost(this.onSetItemPost);
//     return map;
//   }

//   protected abstract createMap(): M;

//   public components(): M {
//     return (this._components ? this._components : (this._components = this.createMapAndObserve()));
//   }

//   public toString(): string {
//     return (this.id || this.url || 'id: null');
//   }
// }

export abstract class Composite<T extends Composite<T>> extends Identifiable {
  private _parent: T = null;
  private _components: CompositeMap<T> = null;

  protected constructor(id: string = null, parent: T = null) {
    super(id);
    this._parent = parent;
  }

  public get url(): string {
    return '';
  }

  public get root(): T {
    if (this.isRoot) {
      return (<T>(this as unknown));
    }

    let next = this.parent;

    while (next) {
      if (next.isRoot) {
        return next;
      }

      next = this.parent;
    }

    return next;
  }

  public get isRoot(): boolean {
    return (Boolean(this._parent) === false);
  }

  public get isLeaf(): boolean {
    if (!this._components)  {
      return true;
    }

    return (this.components.size === 0);
  }

  public get level(): number {
    if (this.isRoot) {
      return 0;
    }

    let node: T = this.parent;
    let level = 0;

    while (node) {
      node = node.parent;
      level++;
    }

    return level;
  }

  public get parent(): T {
    return this._parent;
  }

  public set parent(value: T) {
    if (this._parent) {
      throw new Error(`Invalid operation.  The parent has already been set on the composite [${this.id}].`)
    }

    this._parent = value;
  }

  protected onSetItemPost = (element: T): void => {
    element.parent = (<T>(this as unknown));
  }

  private createMapAndObserve() {
    const map: CompositeMap<T> = this.createMap();
    map.observeSetPost(this.onSetItemPost);
    return map;
  }

  protected createMap(): CompositeMap<T> {
    return (new CompositeMap<T>());
  }

  public get components(): CompositeMap<T> {
    return (this._components ? this._components : (this._components = this.createMapAndObserve()));
  }

  public toString(): string {
    return (this.id || this.url || 'id: null');
  }
}

export class IdentifiableMap<T> {
  protected readonly _inner = new Map<string, T>();
  private _fnPost: (element: T) => void;

  constructor(elements?: (T | T[])) {
    this.set(elements);
  }

  protected get itemKey(): string {
    return 'id';
  }

  public get size(): number {
    return this._inner.size;
  }

  public get isEmpty(): boolean {
    return (this.size === 0);
  }

  public get values(): T[] {
    return Array.from(this._inner.values());
  }

  public get keys(): string[] {
    return Array.from(this._inner.keys());
  }

  public observeSetPost(fnPost: (element: T) => void) {
    this._fnPost = fnPost;
  }

  protected onSetItemPre(element: T): void {
    // do nothing
  }

  protected onSetItemPost(element: T): void {
    if (this._fnPost) {
      this._fnPost(element);
    }

    // do nothing
  }

  public set(elements: (T | T[])): IdentifiableMap<T> {
    if (isNullOrUndefined(elements)) {
      return null;
    }

    const items = ((Array.isArray(elements)) ? [...elements] : [elements]);

    items.forEach((e) => {
      if (isNullOrUndefined(e)) {
        return;
      }

      const key = e[this.itemKey];

      if (isNullOrUndefined(key)) {
        throw new Error(`Failed to set map item. The key value from the property of '${this.itemKey}' is null or undefined.  Override the 'itemKey' member to specify a the key property to use for the items added to the map.`);
      }

      this.onSetItemPre(e);
      this._inner.set(key, e);
      this.onSetItemPost(e);
    });

    return this;
  }

  public clear(): IdentifiableMap<T> {
    this._inner.clear();
    return this;
  }

  protected tryGetKeyBy(value: (T | string | number)): string {
    if (isNullOrUndefined(value)) {
      return null;
    }

    let key = null;

    if (typeof(value) === 'string') {
      key = (value as string);
    }

    if (typeof(value) === 'number') {
      key = (this.keys[value as number] || null);
    }

    if (isNullOrUndefined(key)) {
      key = value[this.itemKey];
    }

    return (key || null);
  }

  public delete(value: (T | string | number)): T {
    const key = this.tryGetKeyBy(value);

    if (isNullOrUndefined(key)) {
      return null;
    }

    const element = this._inner.get(key);

    if (isNullOrUndefined(element)) {
      return null;
    }

    this._inner.delete(key);

    return element;
  }

  public get(value: (string | number)): T {
    const key = this.tryGetKeyBy(value);
    return (this._inner.get(key) || null);
  }

  public has(value: (T | string | number)): boolean {
    return (this._inner.has(this.tryGetKeyBy(value)));
  }

  public forEach(fn: (item: T, index: number) => void): void {
    this.values.forEach(fn);
  }

  public filter(fn: (item: T) => boolean): T[] {
    return this.values.filter(fn);
  }

  public map(fn: (item: T, index: number) => any): any {
    return this.values.map(fn);
  }

  public any(keys: (string[] | number[])): boolean {
    if ((!keys) || (keys.length === 0)) {
      return false;
    }

    for (const key in keys) {
      if (this.has(key)) {
        return true;
      }
    }

    return false;
  }

  public indexOf(value: (T | string)): number {
    const key = this.tryGetKeyBy(value);
    
    return this.keys.findIndex((k) => {
      return (key === k);
    })
  }

  public equals(other: IdentifiableMap<T>): boolean {
    if (!other) {
      return false;
    }

    if (other === this) {
      return true;
    }

    if (other.size !== this.size) {
      return false;
    }

    const keyName = this.itemKey;

    for(let i = 0; (i < this.size); i++) {
      const elem = this.get(i);

      if (!elem) { 
        return false;
      }

      const keyValue = elem[keyName];

      if (!other.has(keyValue)) {
        return false;
      }
    }

    return true;
  }

  public toString(): string {
    return `size:=${this.size}`;
  }
}

// export class CompositeMap<T extends Composite<T, M>, M extends CompositeMap<T, M>> extends IdentifiableMap<T> {
//   constructor(elements?: (T | T[])) {
//     super(elements);
//   }

//   public forEach(fn: (item: T, index: number) => void): void {
//     this.values.forEach(fn);
//   }
// }

export class CompositeMap<T extends Composite<T>> extends IdentifiableMap<T> {
  constructor(elements?: (T | T[])) {
    super(elements);
  }

  public forEach(fn: (item: T, index: number) => void): void {
    this.values.forEach(fn);
  }
}