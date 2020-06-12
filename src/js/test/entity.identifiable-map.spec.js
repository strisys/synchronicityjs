"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const entity_1 = require("../entity");
class Customer extends entity_1.Identifiable {
    constructor(id = null) {
        super(id);
    }
}
Customer.Null = new Customer('0');
class CustomerMap extends entity_1.IdentifiableMap {
    constructor(entities) {
        super(entities);
    }
}
CustomerMap.Null = new Customer('0');
describe('IdentifiableMap', () => {
    const entities = [new Customer('1'), new Customer('2')];
    const validateHydration = (map) => {
        chai_1.assert.equal(map.size, entities.length);
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
        const map = new CustomerMap(entities);
        chai_1.assert.equal(map.clear().size, 0);
    });
});
//# sourceMappingURL=entity.identifiable-map.spec.js.map