import { assert } from 'chai';
import { describe, it } from 'mocha';
import { Identifiable, IdentifiableMap } from '../entity';

class Customer extends Identifiable {
  public static readonly Null = new Customer('0');

  constructor(id: string = null) {
    super(id);
  }
}

class CustomerMap extends IdentifiableMap<Customer> {
  public static readonly Null = new Customer('0');

  constructor(entities?: Customer[]) {
    super(entities);
  }
}

describe('IdentifiableMap', () => {
  const entities = [new Customer('1'), new Customer('2')];

  const validateHydration = (map: CustomerMap) => {
    assert.equal(map.size, entities.length);

    // has
    for(const entity of entities) {
      assert.isTrue(map.has(entity));
      assert.isTrue(map.has(entity.id));
      assert.isTrue(map.has(map.indexOf(entity)));
    }

    assert.isFalse(map.has(new Customer('3')));
    assert.isFalse(map.has('XXX'));
    assert.isFalse(map.has(2));

    // get
    for(const entity of entities) {
      assert.isTrue(map.get(entity.id).equals(entity));
      assert.isTrue(map.get(map.indexOf(entity)).equals(entity));
    }
  }

  it('map constructed properly on instantiation', () => {
    validateHydration(new CustomerMap(entities));
  });

  it('map constructed properly after instantiation', () => {
    validateHydration((new CustomerMap()).set(entities));
  });

  it('map keys and values', () => {
    const keys = new CustomerMap(entities).keys;
    assert.equal(keys.length, 2);
    assert.isTrue(keys.indexOf(keys[0]) > -1);
    assert.isTrue(keys.indexOf(keys[1]) > -1);

    const values = new CustomerMap(entities).keys;
    assert.equal(values.length, 2);
    assert.isTrue(keys.indexOf(entities[0].id) > -1);
    assert.isTrue(keys.indexOf(entities[1].id) > -1)
  });

  it('delete', () => {
    const map = new CustomerMap(entities);
    const entity = entities[0];
    assert.isTrue(map.delete(entity).equals(entity));
    assert.isFalse(map.has(entity));
  });

  it('clear', () => {
    const map = new CustomerMap(entities);
    assert.equal(map.clear().size, 0);
  });
});