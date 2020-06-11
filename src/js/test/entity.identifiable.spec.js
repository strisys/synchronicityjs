"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const entity_1 = require("../entity");
class Customer extends entity_1.Identifiable {
    constructor(id = null) {
        super(id);
    }
}
Customer.Null = new Customer('0');
mocha_1.describe('Identifiable', () => {
    mocha_1.it('new entity with no id assigned', () => {
        const entity = new Customer();
        chai_1.assert.isNotNull(entity);
        chai_1.assert.isNotNull(entity.id);
        chai_1.assert.isString(entity.id);
    });
    mocha_1.it('new entity with id assigned', () => {
        const entity = new Customer('1');
        chai_1.assert.isNotNull(entity);
        chai_1.assert.equal(entity.id, '1');
        chai_1.assert.isString(entity.id);
    });
    mocha_1.it('equality with entities that have same id assigned', () => {
        const a = new Customer();
        const b = new Customer(a.id);
        chai_1.assert.isTrue(a.equals(b));
    });
    mocha_1.it('null entity', () => {
        chai_1.assert.isNotNull(Customer.Null);
        chai_1.assert.isTrue(Customer.Null.isNull);
        chai_1.assert.isTrue(Customer.Null === Customer.Null);
        chai_1.assert.isTrue(Customer.Null.equals(Customer.Null));
    });
});
//# sourceMappingURL=entity.identifiable.spec.js.map