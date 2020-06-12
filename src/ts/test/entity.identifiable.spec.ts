import { assert } from 'chai';
import { Identifiable } from '../entity';

class Customer extends Identifiable {
  public static readonly Null = new Customer('0');

  constructor(id: string = null) {
    super(id);
  }
}

describe('Identifiable', () => {
  it('new entity with no id assigned', () => {
    const entity = new Customer();
    assert.isNotNull(entity);
    assert.isNotNull(entity.id);
    assert.isString(entity.id);
  });

  it('new entity with id assigned', () => {
    const entity = new Customer('1');
    assert.isNotNull(entity);
    assert.equal(entity.id, '1');
    assert.isString(entity.id);
  });

  it('equality with entities that have same id assigned', () => {
    const a = new Customer();
    const b = new Customer(a.id);
    assert.isTrue(a.equals(b));
  });

  it('null entity', () => {
    assert.isNotNull(Customer.Null);
    assert.isTrue(Customer.Null.isNull);
    assert.isTrue(Customer.Null === Customer.Null);
    assert.isTrue(Customer.Null.equals(Customer.Null));
  });
});