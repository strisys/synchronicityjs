"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const entity_1 = require("../entity");
class Fruit extends entity_1.EnumBase {
    constructor(id, value) {
        super(Fruit.TypeName, id, value);
    }
    get isApple() {
        return this.is(Fruit.Apple);
    }
    get isPear() {
        return this.is(Fruit.Pear);
    }
    static tryParse(idOrValue) {
        return entity_1.EnumBase.attemptParse(Fruit.TypeName, idOrValue);
    }
    static get entries() {
        return entity_1.EnumBase.getEntries(Fruit.TypeName);
    }
    static get keys() {
        return entity_1.EnumBase.getKeys(Fruit.TypeName);
    }
    static get values() {
        return entity_1.EnumBase.getValues(Fruit.TypeName);
    }
    static forEach(fn) {
        entity_1.EnumBase.forEachOne(Fruit.TypeName, fn);
    }
}
Fruit.TypeName = 'fruit';
Fruit.Null = new Fruit('0', 'null');
Fruit.Apple = new Fruit('1', 'apple');
Fruit.Pear = new Fruit('2', 'pear');
mocha_1.describe('EnumBase', () => {
    mocha_1.it('null enum', () => {
        const fruit = Fruit.Null;
        chai_1.assert.isNotNull(fruit);
        chai_1.assert.isTrue(fruit.isNull);
        chai_1.assert.isTrue(fruit === Fruit.Null);
    });
    mocha_1.it('basic truths for enums', () => {
        const fruit = Fruit.Apple;
        chai_1.assert.isNotNull(fruit);
        chai_1.assert.isFalse(fruit.isNull);
        // state
        chai_1.assert.isTrue(fruit.id === '1');
        chai_1.assert.isTrue(fruit.value === 'apple');
        chai_1.assert.isTrue(fruit.isApple);
        // equality
        chai_1.assert.isTrue(fruit === Fruit.Apple);
        chai_1.assert.isTrue(fruit.equals(Fruit.Apple));
    });
    mocha_1.it('can parse id or value to enum', () => {
        chai_1.assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('apple'));
        chai_1.assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('Apple'));
        chai_1.assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('aPple '));
        chai_1.assert.isTrue(Fruit.tryParse('1') === Fruit.Apple);
        chai_1.assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('pear'));
        chai_1.assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('Pear'));
        chai_1.assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('peaR '));
        chai_1.assert.isTrue(Fruit.tryParse('2') === Fruit.Pear);
    });
    mocha_1.it('returns valid entries', () => {
        const entries = Fruit.entries;
        chai_1.assert.equal(entries.length, 2);
        chai_1.assert.equal(entries[0], Fruit.Apple);
        chai_1.assert.equal(entries[1], Fruit.Pear);
    });
    mocha_1.it('returns valid keys', () => {
        const keys = Fruit.keys;
        chai_1.assert.equal(keys.length, 2);
        chai_1.assert.equal(keys[0], '1');
        chai_1.assert.equal(keys[1], '2');
    });
    mocha_1.it('returns valid values', () => {
        const values = Fruit.values;
        chai_1.assert.equal(values.length, 2);
        chai_1.assert.equal(values[0], 'apple');
        chai_1.assert.equal(values[1], 'pear');
    });
    mocha_1.it('forEach returns valid values', () => {
        const entries = Fruit.entries;
        Fruit.forEach((e) => {
            entries.splice(entries.findIndex((value) => {
                return (value.id === e.id);
            }), 1);
        });
        chai_1.assert.equal(entries.length, 0);
    });
    mocha_1.it('isOneOf/isNotOneOf works', () => {
        chai_1.assert.isTrue(Fruit.Apple.isOneOf([Fruit.Apple, Fruit.Pear]));
        chai_1.assert.isTrue(Fruit.Apple.isNotOneOf([Fruit.Pear]));
        chai_1.assert.isTrue(Fruit.Pear.isOneOf([Fruit.Apple, Fruit.Pear]));
        chai_1.assert.isTrue(Fruit.Pear.isNotOneOf([Fruit.Apple]));
    });
});
//# sourceMappingURL=entity.enum.spec.js.map