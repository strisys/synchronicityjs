"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifiableMap = exports.Identifiable = exports.Enum = exports.isNullOrUndefined = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const uuid_1 = require("uuid");
const guid = () => {
    return uuid_1.v4();
};
const isNullOrUndefined = (val) => {
    return ((val === null) || (val === undefined));
};
exports.isNullOrUndefined = isNullOrUndefined;
const equals = (primary, other) => {
    if (exports.isNullOrUndefined(primary)) {
        return false;
    }
    if (exports.isNullOrUndefined(other)) {
        return false;
    }
    return ((primary === other) || (primary.id === other.id));
};
class Enum {
    constructor(enumTypeName, id, value) {
        this.isNotOneOf = (values) => {
            return !this.isOneOf(values);
        };
        this.isOneOf = (values) => {
            if (!values) {
                return false;
            }
            return (values.findIndex((v) => {
                return this.equals(v);
            }) > -1);
        };
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
    static normalize(enumTypeName) {
        return enumTypeName.toLowerCase().trim();
    }
    get isNull() {
        return ((!this._id) || (this._id === '0'));
    }
    get id() {
        return this._id;
    }
    get value() {
        return this._value;
    }
    is(other) {
        if (!other) {
            return false;
        }
        if (this === other) {
            return true;
        }
        if (typeof (other) === 'string') {
            return (other === this.value || other === this.id);
        }
        return ((this._id === other.id) || (this._value === other.value));
    }
    static getSize(enumTypeName) {
        return Enum.getEntries(enumTypeName).length;
    }
    static getMap(enumTypeName, cacheType) {
        const cache = ((cacheType === 'id') ? Enum._idMap : Enum._vlMap);
        return cache.get(Enum.normalize(enumTypeName));
    }
    static getEntries(enumTypeName, cacheType = 'id') {
        return Array.from(Enum.getMap(enumTypeName, cacheType).values()).filter((entry) => {
            return !entry.isNull;
        });
    }
    static getRandom(enumTypeName) {
        const entries = Enum.getEntries(enumTypeName, 'id');
        const index = Math.floor((Math.random() * entries.length));
        return entries[index];
    }
    static getKeys(enumTypeName) {
        return Enum.getEntries(enumTypeName, 'id').map((entry) => {
            return entry.id;
        });
    }
    static getValues(enumTypeName) {
        return Enum.getEntries(enumTypeName, 'value').map((entry) => {
            return entry.value;
        });
    }
    static forEachOne(enumTypeName, fn) {
        Enum.getEntries(enumTypeName).forEach(fn);
    }
    equals(other) {
        return equals(this, other);
    }
    toString() {
        return this.value;
    }
}
exports.Enum = Enum;
Enum._idMap = new Map();
Enum._vlMap = new Map();
Enum.attemptGet = (enumTypeName, cacheType, value, isCaseInsensitive = true) => {
    if (!value) {
        return null;
    }
    const cache = Enum.getMap(enumTypeName, cacheType);
    let key = ((typeof (value) === 'string') ? value.trim() : '');
    if (cache.has(key)) {
        return cache.get(key);
    }
    if (isCaseInsensitive) {
        key = Array.from(cache.keys()).find((k) => {
            return (k.toLowerCase() === key.toLowerCase());
        });
    }
    return (cache.get(key) || null);
};
Enum.attemptParse = (enumTypeName, keyOrValue, isCaseInsensitive = true) => {
    return (Enum.attemptGet(enumTypeName, 'id', keyOrValue, isCaseInsensitive) || Enum.attemptGet(enumTypeName, 'value', keyOrValue, isCaseInsensitive));
};
class Identifiable {
    constructor(id = null) {
        this._id = (id || null);
    }
    get isNull() {
        return (this._id === '0');
    }
    get id() {
        return this._id || (this._id = guid());
    }
    set id(value) {
        this._id = (value || this._id || guid());
    }
    equals(other) {
        return equals(this, other);
    }
    toString() {
        return (this.id || 'null');
    }
}
exports.Identifiable = Identifiable;
class IdentifiableMap {
    constructor(elements) {
        this._inner = new Map();
        this.set(this.onSetItems(elements));
    }
    get itemKey() {
        return 'id';
    }
    get size() {
        return this._inner.size;
    }
    get isEmpty() {
        return (this.size === 0);
    }
    get values() {
        return Array.from(this._inner.values());
    }
    get keys() {
        return Array.from(this._inner.keys());
    }
    onSetItems(elements) {
        return elements;
    }
    set(elements) {
        if (exports.isNullOrUndefined(elements)) {
            return null;
        }
        const items = ((Array.isArray(elements)) ? [...elements] : [elements]);
        items.forEach((e) => {
            if (exports.isNullOrUndefined(e)) {
                return;
            }
            const key = e[this.itemKey];
            if (exports.isNullOrUndefined(key)) {
                throw new Error(`Failed to set map item. The key value from the property of '${this.itemKey}' is null or undefined.  Override the 'itemKey' member to specify a the key property to use for the items added to the map.`);
            }
            this._inner.set(key, e);
        });
        return this;
    }
    clear() {
        this._inner.clear();
        return this;
    }
    tryGetKeyBy(value) {
        if (exports.isNullOrUndefined(value)) {
            return null;
        }
        let key = null;
        if (typeof (value) === 'string') {
            key = value;
        }
        if (typeof (value) === 'number') {
            key = (this.keys[value] || null);
        }
        if (exports.isNullOrUndefined(key)) {
            key = value[this.itemKey];
        }
        return (key || null);
    }
    delete(value) {
        const key = this.tryGetKeyBy(value);
        if (exports.isNullOrUndefined(key)) {
            return null;
        }
        const element = this._inner.get(key);
        if (exports.isNullOrUndefined(element)) {
            return null;
        }
        this._inner.delete(key);
        return element;
    }
    get(value) {
        const key = this.tryGetKeyBy(value);
        return (this._inner.get(key) || null);
    }
    has(value) {
        return (this._inner.has(this.tryGetKeyBy(value)));
    }
    forEach(fn) {
        this.values.forEach(fn);
    }
    filter(fn) {
        return this.values.filter(fn);
    }
    map(fn) {
        return this.values.map(fn);
    }
    any(keys) {
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
    indexOf(value) {
        const key = this.tryGetKeyBy(value);
        return this.keys.findIndex((k) => {
            return (key === k);
        });
    }
    equals(other) {
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
        for (let i = 0; (i < this.size); i++) {
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
    toString() {
        return `size:=${this.size}`;
    }
}
exports.IdentifiableMap = IdentifiableMap;
//# sourceMappingURL=entity.js.map