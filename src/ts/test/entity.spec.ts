import { assert } from 'chai';
import { Enum, Identifiable, IdentifiableMap } from '../';

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

export type FruitCode = ('null' | 'apple' | 'pear');

class Fruit extends Enum<Fruit> {
  private static readonly TypeName = 'fruit';
  public static readonly Null = new Fruit('0', 'null');
  public static readonly Apple = new Fruit('1', 'apple');
  public static readonly Pear = new Fruit('2', 'pear');

  private constructor(id: string, value: FruitCode) {
    super(Fruit.TypeName, id, value);
  }

  public get isApple(): boolean {
    return this.is(Fruit.Apple);
  }

  public get isPear(): boolean {
    return this.is(Fruit.Pear);
  }

  public static tryParse(keyOrValue: (string | FruitCode)): Fruit {
    return (<Fruit>Fruit.attemptParse(Fruit.TypeName, keyOrValue));
  }

  public static get size(): number {
    return Fruit.getSize(Fruit.TypeName);
  }

  public static get random(): Fruit {
    return (Fruit.getRandom(Fruit.TypeName) as Fruit);
  }

  public static get entries(): Fruit[] {
    return (Fruit.getEntries(Fruit.TypeName) as Fruit[]);
  }

  public static get keys(): string[] {
    return Fruit.getKeys(Fruit.TypeName);
  }

  public static get values(): FruitCode[] {
    return (Fruit.getValues(Fruit.TypeName) as FruitCode[]);
  }

  public static forEach(fn: (value: Fruit, index: number) => void): void {
    Fruit.forEachOne(Fruit.TypeName, fn);
  }
}

describe('Enum', () => {
  it('null enum', () => {
    const fruit = Fruit.Null;
    assert.isNotNull(fruit);
    assert.isTrue(fruit.isNull);
    assert.isTrue(fruit === Fruit.Null);
  });

  it('random', () => {
    const fruit = Fruit.random;
    assert.isNotNull(fruit);
    assert.isFalse(fruit.isNull);
  });

  it('size', () => {
    assert.equal(Fruit.size, 2);
  });


  it('basic truths for enums', () => {
    const fruit = Fruit.random;
    assert.isNotNull(fruit);
    assert.isFalse(fruit.isNull);

    // state
    assert.isTrue(fruit.id === '1' || fruit.id === '2');
    assert.isTrue(fruit.value === 'apple' || fruit.value === 'pear');
    assert.isTrue(fruit.isApple || fruit.isPear);
    
    // equality
    const other = Fruit.tryParse(fruit.id);
    assert.isTrue(fruit === other);
    assert.isTrue(fruit.equals(fruit));
    assert.isTrue(other.equals(fruit));

    // invariants
    assert.equal(Fruit.size, Fruit.entries.length);
    assert.equal(Fruit.size, Fruit.keys.length);
    assert.equal(Fruit.size, Fruit.values.length);
  });

  it('can parse id or value to enum', () => {
    let other = Fruit.tryParse('1');
    assert.isTrue(other === Fruit.tryParse('apple'));
    assert.isTrue(other === Fruit.tryParse('Apple'));
    assert.isTrue(other === Fruit.tryParse('aPple '));
    assert.isTrue(other === Fruit.Apple);

    other = Fruit.tryParse('2');
    assert.isTrue(other === Fruit.tryParse('pear'));
    assert.isTrue(other === Fruit.tryParse('Pear'));
    assert.isTrue(other === Fruit.tryParse('peaR '));
    assert.isTrue(other === Fruit.Pear);
  });

  it('entries property returns expected entries in order', () => {
    const entries = Fruit.entries;
    assert.equal(entries.length, 2);
    assert.equal(entries[0], Fruit.Apple);
    assert.equal(entries[1], Fruit.Pear);
  });

  it('keys property returns expected keys in order', () => {
    const keys = Fruit.keys;
    assert.equal(keys.length, 2);
    assert.equal(keys[0], '1');
    assert.equal(keys[1], '2');
  });

  it('values property returns expected values in order', () => {
    const values = Fruit.values;
    assert.equal(values.length, 2);
    assert.equal(values[0], 'apple');
    assert.equal(values[1], 'pear');
  });

  it('forEach executes and returns valid values in order', () => {
    const entries = Fruit.entries;
    
    Fruit.forEach((e) => {
      entries.splice(entries.findIndex((value) => {
        return (value.id === e.id);
      }), 1)
    });

    assert.equal(entries.length, 0);
  });

  it('isOneOf/isNotOneOf works', () => {
    Fruit.forEach((fruit) => {
      assert.isTrue(fruit.isOneOf(Fruit.entries));
    })

    assert.isTrue(Fruit.Apple.isOneOf([Fruit.Apple, Fruit.Pear]));
    assert.isFalse(Fruit.Apple.isOneOf([Fruit.Pear]));
    assert.isTrue(Fruit.Apple.isNotOneOf([Fruit.Pear]));
    assert.isTrue(Fruit.Pear.isOneOf([Fruit.Apple, Fruit.Pear]));
    assert.isFalse(Fruit.Pear.isOneOf([Fruit.Apple]));
    assert.isTrue(Fruit.Pear.isNotOneOf([Fruit.Apple]));
  });
});

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
    assert.isFalse(map.isEmpty);

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

  it('equals (same instance)', () => {
    const map = new CustomerMap(entities);
    assert.isTrue(map.equals(map));
  });

  it('equals (different instances with same items)', () => {
    const a = new CustomerMap(entities);
    const b = new CustomerMap(entities);
    assert.isTrue(a.equals(b));
    assert.isTrue(b.equals(a));
  });

  it('equals (different instances with different sizes)', () => {
    const i1 = [...entities];
    const i2 = [...entities].splice(1);

    const a = new CustomerMap(i1);
    const b = new CustomerMap(i2);
    assert.isFalse(a.equals(b));
    assert.isFalse(b.equals(a));
  });

  it('equals (different instances with different items)', () => {
    const i1 = [...entities];
    const i2 = [new Customer('1'), new Customer('3')];

    const a = new CustomerMap(i1);
    const b = new CustomerMap(i2);
    assert.isFalse(a.equals(b));
    assert.isFalse(b.equals(a));
  });
});