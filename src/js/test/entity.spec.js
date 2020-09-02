"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
class Customer extends __1.Identifiable {
    constructor(id = null) {
        super(id);
    }
}
Customer.Null = new Customer('0');
describe('Identifiable', () => {
    it('new entity with no id assigned', () => {
        const entity = new Customer();
        chai_1.assert.isNotNull(entity);
        chai_1.assert.isNotNull(entity.id);
        chai_1.assert.isString(entity.id);
    });
    it('new entity with id assigned', () => {
        const entity = new Customer('1');
        chai_1.assert.isNotNull(entity);
        chai_1.assert.equal(entity.id, '1');
        chai_1.assert.isString(entity.id);
    });
    it('equality with entities that have same id assigned', () => {
        const a = new Customer();
        const b = new Customer(a.id);
        chai_1.assert.isTrue(a.equals(b));
    });
    it('null entity', () => {
        chai_1.assert.isNotNull(Customer.Null);
        chai_1.assert.isTrue(Customer.Null.isNull);
        chai_1.assert.isTrue(Customer.Null === Customer.Null);
        chai_1.assert.isTrue(Customer.Null.equals(Customer.Null));
    });
});
class Fruit extends __1.Enum {
    constructor(id, value) {
        super(Fruit.TypeName, id, value);
    }
    get isApple() {
        return this.is(Fruit.Apple);
    }
    get isPear() {
        return this.is(Fruit.Pear);
    }
    static tryParse(keyOrValue) {
        return Fruit.attemptParse(Fruit.TypeName, keyOrValue);
    }
    static get size() {
        return Fruit.getSize(Fruit.TypeName);
    }
    static get random() {
        return Fruit.getRandom(Fruit.TypeName);
    }
    static get entries() {
        return Fruit.getEntries(Fruit.TypeName);
    }
    static get keys() {
        return Fruit.getKeys(Fruit.TypeName);
    }
    static get values() {
        return Fruit.getValues(Fruit.TypeName);
    }
    static forEach(fn) {
        Fruit.forEachOne(Fruit.TypeName, fn);
    }
}
Fruit.TypeName = 'fruit';
Fruit.Null = new Fruit('0', 'null');
Fruit.Apple = new Fruit('1', 'apple');
Fruit.Pear = new Fruit('2', 'pear');
describe('Enum', () => {
    it('null enum', () => {
        const fruit = Fruit.Null;
        chai_1.assert.isNotNull(fruit);
        chai_1.assert.isTrue(fruit.isNull);
        chai_1.assert.isTrue(fruit === Fruit.Null);
    });
    it('random', () => {
        const fruit = Fruit.random;
        chai_1.assert.isNotNull(fruit);
        chai_1.assert.isFalse(fruit.isNull);
    });
    it('size', () => {
        chai_1.assert.equal(Fruit.size, 2);
    });
    it('basic truths for enums', () => {
        const fruit = Fruit.random;
        chai_1.assert.isNotNull(fruit);
        chai_1.assert.isFalse(fruit.isNull);
        // state
        chai_1.assert.isTrue(fruit.id === '1' || fruit.id === '2');
        chai_1.assert.isTrue(fruit.value === 'apple' || fruit.value === 'pear');
        chai_1.assert.isTrue(fruit.isApple || fruit.isPear);
        // equality
        const other = Fruit.tryParse(fruit.id);
        chai_1.assert.isTrue(fruit === other);
        chai_1.assert.isTrue(fruit.equals(fruit));
        chai_1.assert.isTrue(other.equals(fruit));
        // invariants
        chai_1.assert.equal(Fruit.size, Fruit.entries.length);
        chai_1.assert.equal(Fruit.size, Fruit.keys.length);
        chai_1.assert.equal(Fruit.size, Fruit.values.length);
    });
    it('can parse id or value to enum', () => {
        let other = Fruit.tryParse('1');
        chai_1.assert.isTrue(other === Fruit.tryParse('apple'));
        chai_1.assert.isTrue(other === Fruit.tryParse('Apple'));
        chai_1.assert.isTrue(other === Fruit.tryParse('aPple '));
        chai_1.assert.isTrue(other === Fruit.Apple);
        other = Fruit.tryParse('2');
        chai_1.assert.isTrue(other === Fruit.tryParse('pear'));
        chai_1.assert.isTrue(other === Fruit.tryParse('Pear'));
        chai_1.assert.isTrue(other === Fruit.tryParse('peaR '));
        chai_1.assert.isTrue(other === Fruit.Pear);
    });
    it('entries property returns expected entries in order', () => {
        const entries = Fruit.entries;
        chai_1.assert.equal(entries.length, 2);
        chai_1.assert.equal(entries[0], Fruit.Apple);
        chai_1.assert.equal(entries[1], Fruit.Pear);
    });
    it('keys property returns expected keys in order', () => {
        const keys = Fruit.keys;
        chai_1.assert.equal(keys.length, 2);
        chai_1.assert.equal(keys[0], '1');
        chai_1.assert.equal(keys[1], '2');
    });
    it('values property returns expected values in order', () => {
        const values = Fruit.values;
        chai_1.assert.equal(values.length, 2);
        chai_1.assert.equal(values[0], 'apple');
        chai_1.assert.equal(values[1], 'pear');
    });
    it('forEach executes and returns valid values in order', () => {
        const entries = Fruit.entries;
        Fruit.forEach((e) => {
            entries.splice(entries.findIndex((value) => {
                return (value.id === e.id);
            }), 1);
        });
        chai_1.assert.equal(entries.length, 0);
    });
    it('isOneOf/isNotOneOf works', () => {
        Fruit.forEach((fruit) => {
            chai_1.assert.isTrue(fruit.isOneOf(Fruit.entries));
        });
        chai_1.assert.isTrue(Fruit.Apple.isOneOf([Fruit.Apple, Fruit.Pear]));
        chai_1.assert.isFalse(Fruit.Apple.isOneOf([Fruit.Pear]));
        chai_1.assert.isTrue(Fruit.Apple.isNotOneOf([Fruit.Pear]));
        chai_1.assert.isTrue(Fruit.Pear.isOneOf([Fruit.Apple, Fruit.Pear]));
        chai_1.assert.isFalse(Fruit.Pear.isOneOf([Fruit.Apple]));
        chai_1.assert.isTrue(Fruit.Pear.isNotOneOf([Fruit.Apple]));
    });
});
class CustomerMap extends __1.IdentifiableMap {
    constructor(entities) {
        super(entities);
    }
}
CustomerMap.Null = new Customer('0');
describe('IdentifiableMap', () => {
    const entities = [new Customer('1'), new Customer('2')];
    const validateHydration = (map) => {
        chai_1.assert.equal(map.size, entities.length);
        chai_1.assert.isFalse(map.isEmpty);
        // has
        for (const entity of entities) {
            chai_1.assert.isTrue(map.has(entity));
            chai_1.assert.isTrue(map.has(entity.id));
            chai_1.assert.isTrue(map.has(map.indexOf(entity)));
        }
        chai_1.assert.isFalse(map.has(new Customer('3')));
        chai_1.assert.isFalse(map.has('XXX'));
        chai_1.assert.isFalse(map.has(2));
        // get
        for (const entity of entities) {
            chai_1.assert.isTrue(map.get(entity.id).equals(entity));
            chai_1.assert.isTrue(map.get(map.indexOf(entity)).equals(entity));
        }
    };
    it('map constructed properly on instantiation', () => {
        validateHydration(new CustomerMap(entities));
    });
    it('map constructed properly after instantiation', () => {
        validateHydration((new CustomerMap()).set(entities));
    });
    it('map keys and values', () => {
        const keys = new CustomerMap(entities).keys;
        chai_1.assert.equal(keys.length, 2);
        chai_1.assert.isTrue(keys.indexOf(keys[0]) > -1);
        chai_1.assert.isTrue(keys.indexOf(keys[1]) > -1);
        const values = new CustomerMap(entities).keys;
        chai_1.assert.equal(values.length, 2);
        chai_1.assert.isTrue(keys.indexOf(entities[0].id) > -1);
        chai_1.assert.isTrue(keys.indexOf(entities[1].id) > -1);
    });
    it('delete', () => {
        const map = new CustomerMap(entities);
        const entity = entities[0];
        chai_1.assert.isTrue(map.delete(entity).equals(entity));
        chai_1.assert.isFalse(map.has(entity));
    });
    it('clear', () => {
        // arrange
        const map = new CustomerMap(entities);
        // act, assert
        chai_1.assert.equal(map.clear().size, 0);
    });
    it('equals (same instance)', () => {
        const map = new CustomerMap(entities);
        chai_1.assert.isTrue(map.equals(map));
    });
    it('equals (different instances with same items)', () => {
        // arrange
        const a = new CustomerMap(entities);
        const b = new CustomerMap(entities);
        // assert
        chai_1.assert.isTrue(a.equals(b));
        chai_1.assert.isTrue(b.equals(a));
    });
    it('equals (different instances with different sizes)', () => {
        // arrange
        const i1 = [...entities];
        const i2 = [...entities].splice(1);
        // act
        const a = new CustomerMap(i1);
        const b = new CustomerMap(i2);
        // assert
        chai_1.assert.isFalse(a.equals(b));
        chai_1.assert.isFalse(b.equals(a));
    });
    it('equals (different instances with different items)', () => {
        // arrange
        const i1 = [new Customer('1'), new Customer('2')];
        const i2 = [new Customer('1'), new Customer('3')];
        // act
        const a = new CustomerMap(i1);
        const b = new CustomerMap(i2);
        // assert
        chai_1.assert.isFalse(a.equals(b));
        chai_1.assert.isFalse(b.equals(a));
    });
});
//# sourceMappingURL=entity.spec.js.map