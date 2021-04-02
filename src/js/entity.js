"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeMap = exports.IdentifiableMap = exports.Composite = exports.Identifiable = exports.Enum = exports.isNullOrUndefined = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
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
class Composite extends Identifiable {
    constructor(id = null, parent = null) {
        super(id);
        this._parent = null;
        this._components = null;
        this.onSetItemPost = (element) => {
            element.parent = this;
        };
        this._parent = (parent || null);
    }
    get url() {
        return '';
    }
    get root() {
        if (this.isRoot) {
            return this;
        }
        let next = this.parent;
        while (next) {
            if (next.isRoot) {
                return next;
            }
            next = next.parent;
        }
        return next;
    }
    get isRoot() {
        return (Boolean(this._parent) === false);
    }
    get isLeaf() {
        if (!this._components) {
            return true;
        }
        return (this.components.size === 0);
    }
    get level() {
        if (this.isRoot) {
            return 0;
        }
        let node = this.parent;
        let level = 0;
        while (node) {
            node = node.parent;
            level++;
        }
        return level;
    }
    get parent() {
        return (this._parent || null);
    }
    set parent(value) {
        if (this._parent) {
            throw new Error(`Invalid operation.  The parent has already been set on the composite [${this.id}].`);
        }
        this._parent = (value || null);
    }
    createComponentsMapAndObserve() {
        const map = this.createComponentsMap();
        map.observeSetPost(this.onSetItemPost);
        return map;
    }
    createComponentsMap() {
        return (new CompositeMap());
    }
    get components() {
        return ((this._components) ? this._components : (this._components = this.createComponentsMapAndObserve()));
    }
    toString() {
        return (this.id || this.url || 'id: null');
    }
}
exports.Composite = Composite;
class IdentifiableMap {
    constructor(elements) {
        this._inner = new Map();
        this.set(elements);
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
    observeSetPre(fnPre) {
        this._fnPre = fnPre;
    }
    observeSetPost(fnPost) {
        this._fnPost = fnPost;
    }
    onSetItemPre(element) {
        // template method.  do nothing
    }
    onSetItemPost(element) {
        // template method.  do nothing
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
            // notify pre
            if (this._fnPre) {
                this._fnPre(e);
            }
            this.onSetItemPre(e);
            // set item
            this._inner.set(key, e);
            // notify post
            if (this._fnPost) {
                this._fnPost(e);
            }
            this.onSetItemPost(e);
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
class CompositeMap extends IdentifiableMap {
    constructor(elements) {
        super(elements);
    }
    flatten(enumeration) {
        const e = (((typeof (enumeration) === 'string') ? CompositeEnumeration.tryParse(enumeration) : enumeration) || CompositeEnumeration.Null);
        if (e.isNull) {
            return [];
        }
        const depthFirstList = [];
        const recurseDepthFirst = (item) => {
            if (!item) {
                return;
            }
            depthFirstList.push(item);
            if (item.isLeaf) {
                return;
            }
            item.components.forEach((c) => {
                recurseDepthFirst(c);
            });
        };
        super.forEach((element) => {
            recurseDepthFirst(element);
        });
        if (e.isDepthFirst) {
            return depthFirstList;
        }
        // Build map of level/array pairs for breadth-first
        const levelMap = new Map();
        let maxLevel = 0;
        depthFirstList.forEach((element) => {
            const level = element.level;
            if (level > maxLevel) {
                maxLevel = level;
            }
            if (!levelMap.has(level)) {
                levelMap.set(level, new Array());
            }
            levelMap.get(level).push(element);
        });
        let breadthFirstList = [];
        // Add one level at a time
        for (let x = 0; (x <= maxLevel); x++) {
            breadthFirstList = breadthFirstList.concat((levelMap.get(x) || []));
        }
        return breadthFirstList;
    }
    forEachDeep(enumeration, fn) {
        this.flatten(enumeration).forEach(fn);
    }
}
exports.CompositeMap = CompositeMap;
class CompositeEnumeration extends Enum {
    constructor(id, value) {
        super(CompositeEnumeration.TypeName, id, value);
    }
    get isDepthFirst() {
        return this.is(CompositeEnumeration.DepthFirst);
    }
    get isBreadthFirst() {
        return this.is(CompositeEnumeration.BreadthFirst);
    }
    static tryParse(keyOrValue) {
        return CompositeEnumeration.attemptParse(CompositeEnumeration.TypeName, keyOrValue);
    }
    static get size() {
        return CompositeEnumeration.getSize(CompositeEnumeration.TypeName);
    }
    static get random() {
        return CompositeEnumeration.getRandom(CompositeEnumeration.TypeName);
    }
    static get entries() {
        return CompositeEnumeration.getEntries(CompositeEnumeration.TypeName);
    }
    static get keys() {
        return CompositeEnumeration.getKeys(CompositeEnumeration.TypeName);
    }
    static get values() {
        return CompositeEnumeration.getValues(CompositeEnumeration.TypeName);
    }
    static forEach(fn) {
        CompositeEnumeration.forEachOne(CompositeEnumeration.TypeName, fn);
    }
}
CompositeEnumeration.TypeName = 'CompositeEnumeration';
CompositeEnumeration.Null = new CompositeEnumeration('0', 'null');
CompositeEnumeration.DepthFirst = new CompositeEnumeration('1', 'depth-first');
CompositeEnumeration.BreadthFirst = new CompositeEnumeration('2', 'breadth-first');
//# sourceMappingURL=entity.js.map