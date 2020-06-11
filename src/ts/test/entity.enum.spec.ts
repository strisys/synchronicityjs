import { assert } from 'chai';
import { describe, it } from 'mocha';
import { EnumBase } from '../entity';

class Fruit extends EnumBase<Fruit> {
  private static readonly TypeName = 'fruit';
  public static readonly Null = new Fruit('0', 'null');
  public static readonly Apple = new Fruit('1', 'apple');
  public static readonly Pear = new Fruit('2', 'pear');

  private constructor(id: string, value: string) {
    super(Fruit.TypeName, id, value);
  }

  public get isApple(): boolean {
    return this.is(Fruit.Apple);
  }

  public get isPear(): boolean {
    return this.is(Fruit.Pear);
  }

  public static tryParse(idOrValue: string): Fruit {
    return (<Fruit>EnumBase.attemptParse(Fruit.TypeName, idOrValue));
  }

  public static get entries(): Fruit[] {
    return EnumBase.getEntries(Fruit.TypeName);
  }

  public static get keys(): string[] {
    return EnumBase.getKeys(Fruit.TypeName);
  }

  public static get values(): string[] {
    return EnumBase.getValues(Fruit.TypeName);
  }

  public static forEach(fn: (value: Fruit, index: number) => void): void {
    EnumBase.forEachOne(Fruit.TypeName, fn);
  }
}

describe('EnumBase', () => {
  it('null enum', () => {
    const fruit = Fruit.Null;
    assert.isNotNull(fruit);
    assert.isTrue(fruit.isNull);
    assert.isTrue(fruit === Fruit.Null);
  });

  it('basic truths for enums', () => {
    const fruit = Fruit.Apple;
    assert.isNotNull(fruit);
    assert.isFalse(fruit.isNull);

    // state
    assert.isTrue(fruit.id === '1');
    assert.isTrue(fruit.value === 'apple');
    assert.isTrue(fruit.isApple);
    
    // equality
    assert.isTrue(fruit === Fruit.Apple);
    assert.isTrue(fruit.equals(Fruit.Apple));
  });

  it('can parse id or value to enum', () => {
    assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('apple'));
    assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('Apple'));
    assert.isTrue(Fruit.tryParse('1') === Fruit.tryParse('aPple '));
    assert.isTrue(Fruit.tryParse('1') === Fruit.Apple);

    assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('pear'));
    assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('Pear'));
    assert.isTrue(Fruit.tryParse('2') === Fruit.tryParse('peaR '));
    assert.isTrue(Fruit.tryParse('2') === Fruit.Pear);
  });

  it('returns valid entries', () => {
    const entries = Fruit.entries;
    assert.equal(entries.length, 2);
    assert.equal(entries[0], Fruit.Apple);
    assert.equal(entries[1], Fruit.Pear);
  });

  it('returns valid keys', () => {
    const keys = Fruit.keys;
    assert.equal(keys.length, 2);
    assert.equal(keys[0], '1');
    assert.equal(keys[1], '2');
  });

  it('returns valid values', () => {
    const values = Fruit.values;
    assert.equal(values.length, 2);
    assert.equal(values[0], 'apple');
    assert.equal(values[1], 'pear');
  });

  it('forEach returns valid values', () => {
    const entries = Fruit.entries;
    
    Fruit.forEach((e) => {
      entries.splice(entries.findIndex((value) => {
        return (value.id === e.id);
      }), 1)
    });

    assert.equal(entries.length, 0);
  });

  it('isOneOf/isNotOneOf works', () => {
    assert.isTrue(Fruit.Apple.isOneOf([Fruit.Apple, Fruit.Pear]));
    assert.isTrue(Fruit.Apple.isNotOneOf([Fruit.Pear]));
    assert.isTrue(Fruit.Pear.isOneOf([Fruit.Apple, Fruit.Pear]));
    assert.isTrue(Fruit.Pear.isNotOneOf([Fruit.Apple]));
  });
});