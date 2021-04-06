/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import { Composite, Enum, Identifiable, IdentifiableMap, isNullOrUndefined } from './entity';

export type AndOrCode = ('null' | 'and' | 'or');

export class AndOr extends Enum<AndOr> {
  private static readonly TypeName = 'and-or';
  public static readonly Null = new AndOr('0', 'null');
  public static readonly And = new AndOr('1', 'and');
  public static readonly Or = new AndOr('2', 'or');

  private constructor(id: string, value: AndOrCode) {
    super(AndOr.TypeName, id, value);
  }

  public get isAnd(): boolean {
    return this.is(AndOr.And);
  }

  public get isOr(): boolean {
    return this.is(AndOr.Or);
  }

  public static tryParse(keyOrValue: (string | AndOrCode)): AndOr {
    return (<AndOr>AndOr.attemptParse(AndOr.TypeName, keyOrValue));
  }

  public static get size(): number {
    return AndOr.getSize(AndOr.TypeName);
  }

  public static get random(): AndOr {
    return (AndOr.getRandom(AndOr.TypeName) as AndOr);
  }

  public static get entries(): AndOr[] {
    return (AndOr.getEntries(AndOr.TypeName) as AndOr[]);
  }

  public static get keys(): string[] {
    return AndOr.getKeys(AndOr.TypeName);
  }

  public static get values(): AndOrCode[] {
    return (AndOr.getValues(AndOr.TypeName) as AndOrCode[]);
  }

  public static forEach(fn: (value: AndOr, index: number) => void): void {
    AndOr.forEachOne(AndOr.TypeName, fn);
  }
}

export type AscDescCode = ('null' | 'asc' | 'desc');
export class AscDesc extends Enum<AscDescCode> {
  private static readonly TypeName = 'AscDesc';
  public static readonly Null = new AscDesc('0', 'null');
  public static readonly Asc = new AscDesc('1', 'asc');
  public static readonly Desc = new AscDesc('2', 'desc');

  private constructor(id: string, value: AscDescCode) {
    super(AscDesc.TypeName, id, value);
  }

  public get isAsc(): boolean {
    return this.is(AscDesc.Asc);
  }

  public get isDesc(): boolean {
    return this.is(AscDesc.Desc);
  }

  public static tryParse(keyOrValue: (string | AscDescCode)): AscDesc {
    return (AscDesc.attemptParse(AscDesc.TypeName, keyOrValue) as AscDesc);
  }

  public static get size(): number {
    return AscDesc.getSize(AscDesc.TypeName);
  }

  public static get random(): AscDesc {
    return (AscDesc.getRandom(AscDesc.TypeName) as AscDesc);
  }

  public static get entries(): AscDesc[] {
    return (AscDesc.getEntries(AscDesc.TypeName) as AscDesc[]);
  }

  public static get keys(): string[] {
    return AscDesc.getKeys(AscDesc.TypeName);
  }

  public static get values(): AscDescCode[] {
    return (AscDesc.getValues(AscDesc.TypeName) as AscDescCode[]);
  }

  public static forEach(fn: (value: AscDesc, index: number) => void): void {
    AscDesc.forEachOne(AscDesc.TypeName, fn);
  }
}

export class EntityQueryParameters {
  public static readonly Null: EntityQueryParameters = new EntityQueryParameters(0, 0, '');

  private _pageNumber: number;
  private _pageSize: number;
  private _searchString: string;
  private _previous: EntityQueryParameters;

  constructor(pageNumber: number, pageSize: number, searchString: string = null, previous: EntityQueryParameters = null) {
    this._pageNumber = pageNumber;
    this._pageSize = pageSize;
    this._searchString = (searchString || '');
    this._previous = (previous || EntityQueryParameters.Null);
  }

  public get isNull(): boolean {
    return (this === EntityQueryParameters.Null);
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get pageNumber(): number {
    return this._pageNumber;
  }

  public get searchString(): string {
    return (this._searchString || '');
  }

  public set searchString(value: string) {
    this._searchString = ((value) ? JSON.stringify(value) : '');
  }

  public get previous(): EntityQueryParameters {
    return (this._previous || EntityQueryParameters.Null);
  }

  public static default(): EntityQueryParameters {
    return (new EntityQueryParameters(1, 10));
  }

  public changePage(pageNumber: number): EntityQueryParameters {
    return (new EntityQueryParameters(pageNumber, this.pageSize, this.searchString, this.clone()));
  }

  public changeSize(pageSize: number): EntityQueryParameters {
    return (new EntityQueryParameters(this.pageNumber, pageSize, this.searchString, this.clone()));
  }

  public changeSearchString(searchString: string): EntityQueryParameters {
    return (new EntityQueryParameters(this.pageNumber, this.pageSize, searchString, this.clone()));
  }

  public toJsonObject = (): { [key:string]: (string | number) } => {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchString: this.searchString
    };
  }

  public clone = (): EntityQueryParameters => {
    return (new EntityQueryParameters(this.pageNumber, this.pageSize, this.searchString, this.previous));
  }

  public toString(): string {
    return `pageSize:=${this.pageSize},pageNumber:=${this.pageNumber},searchString:=${this.searchString}`;
  }
}

export class EntityQueryPage<T> {
  private readonly _queryParameters: EntityQueryParameters;
  private readonly _totalRows: number;
  private readonly _previousUrl: string;
  private readonly _nextUrl: string;
  private readonly _value: T;
  private _executionDuration: number;

  constructor(queryParameters: EntityQueryParameters, value: T, totalRows: number = null, previousUrl = '', nextUrl = '', executionDuration = null) {
    this._queryParameters = queryParameters;
    this._value = value;
    this._totalRows = totalRows;
    this._previousUrl = previousUrl;
    this._nextUrl = nextUrl;
    this._executionDuration = executionDuration;
  }

  public get queryParameters(): EntityQueryParameters {
    return this._queryParameters;
  }

  public get value(): T {
    return (this._value || null);
  }

  public get totalRows(): number {
    return (this._totalRows || null);
  }

  public get executionDuration(): number {
    return (this._executionDuration || null);
  }

  public get previousUrl(): string {
    return (this._previousUrl || '');
  }

  public get nextUrl(): string {
    return (this._nextUrl || '');
  }
}

export type PageDirectionCode = ('Previous' | 'Next' | 'None');

export class PageDirection extends Enum<PageDirection> {
  private static readonly TypeName: string = 'PageDirection';
  public static readonly None: PageDirection = new PageDirection('0', 'None');
  public static readonly Previous: PageDirection = new PageDirection('1', 'Previous');
  public static readonly Next: PageDirection = new PageDirection('2', 'Next');

  private constructor(id: string, value: PageDirectionCode) {
    super(PageDirection.TypeName, id, value);
  }

  public get isPrevious(): boolean {
    return this.is(PageDirection.Previous);
  }

  public get isNext(): boolean {
    return this.is(PageDirection.Next);
  }

  public static get size(): number {
    return PageDirection.getSize(PageDirection.TypeName);
  }

  public static tryParse(keyOrValue: (string | PageDirectionCode)): PageDirection {
    return (PageDirection.attemptParse(PageDirection.TypeName, keyOrValue) || PageDirection.None);
  }

  public static get entries(): PageDirection[] {
    return (PageDirection.getEntries(PageDirection.TypeName) as PageDirection[]);
  }

  public static get keys(): string[] {
    return PageDirection.getKeys(PageDirection.TypeName);
  }

  public static get values(): PageDirectionCode[] {
    return (PageDirection.getValues(PageDirection.TypeName) as PageDirectionCode[]);
  }

  public static forEach(fn: (value: PageDirection, index: number) => void): void {
    PageDirection.forEachOne(PageDirection.TypeName, fn);
  }
}


export type ColumnTypeName = ('null' | 'any' | 'string' | 'number' | 'date' | 'boolean' | 'object');

export class ColumnType extends Enum<ColumnType> {
  private static readonly TypeName: string = 'ColumnType';

  public static readonly Null: ColumnType = new ColumnType('0', 'null');
  public static readonly Any: ColumnType = new ColumnType('1', 'any');
  public static readonly String: ColumnType = new ColumnType('2', 'string');
  public static readonly Number: ColumnType = new ColumnType('3', 'number');
  public static readonly Date: ColumnType = new ColumnType('4', 'date');
  public static readonly Boolean: ColumnType = new ColumnType('5', 'boolean');
  public static readonly Object: ColumnType = new ColumnType('6', 'object');

  private constructor(id: string, value: ColumnTypeName) {
    super(ColumnType.TypeName, id, value);
  }

  public static tryParse(keyOrValue: (string | PageDirectionCode)): PageDirection {
    return (ColumnType.attemptParse(ColumnType.TypeName, keyOrValue) || ColumnType.Null);
  }

  public static get size(): number {
    return ColumnType.getSize(ColumnType.TypeName);
  }

  public static get entries(): ColumnType[] {
    return (ColumnType.getEntries(ColumnType.TypeName) as ColumnType[]);
  }

  public static get keys(): string[] {
    return ColumnType.getKeys(ColumnType.TypeName);
  }

  public static get values(): ColumnTypeName[] {
    return (ColumnType.getValues(ColumnType.TypeName) as ColumnTypeName[]);
  }

  public static forEach(fn: (value: ColumnType, index: number) => void): void {
    ColumnType.forEachOne(ColumnType.TypeName, fn);
  }
}

export class Column extends Identifiable {
  private _title: string;
  private _type: ColumnType;

  public constructor(name: string, title: string = null, type: ColumnType = ColumnType.Any) {
    super(name);
    this._title = (title || this.id);
    this._type = (type || ColumnType.Any);
  }

  public get isNull(): boolean {
    return false;
  }

  public get name(): string {
    return (this.id || '');
  }

  public get title(): string {
    return (this._title || '');
  }

  public set title(value: string) {
    this._title = (value || '');
  }

  public get type(): ColumnType {
    return (this._type || ColumnType.Any);
  }

  public set type(value: ColumnType) {
    this._type = (value || ColumnType.Any);
  }

  public static from(items: (string | Column | string[] | Column[])): Column[] {
    const vals = (Array.isArray(items) ? items : [items]);
  
    const tryCreateColumn = (name: (string | Column)): Column => {
      if (typeof (name) === 'string') {
        return (new Column(name as string));
      }
  
      return ((name as Column) || null);
    }

    if ((vals.length > 0) && (typeof (vals[0]) === 'string')) {
      return (vals as string[]).map(tryCreateColumn);
    }

    return (items as Column[]);
  }

  public equals(other: Column): boolean {
    return ((other) ? ((this === other) || (this.name === other.name)) : false);
  }

  public toString(): string {
    return this.name;
  }
}

export class ColumnMap extends IdentifiableMap<Column> {
  constructor(items: (string[] | Column[]) = null) {
    super(Column.from(items));
  }

  public get names(): string[] {
    return this.map((c) => c.name);
  }
}

export class DataTableColumnMap extends ColumnMap {
  private readonly _primaryKey: ColumnMap;

  constructor(items: (string[] | Column[]) = null, primaryKey: (string | string[]) = null) {
    super(Column.from(items));
    this._primaryKey = this.validatePrimaryKey(primaryKey);
  }

  public get primaryKey(): ColumnMap {
    return this._primaryKey;
  }

  private validatePrimaryKey(primaryKey: (string | string[])): ColumnMap {
    if (typeof (primaryKey) === 'string') {
      const singleKey = (primaryKey as string);

      if (!this.has(singleKey)) {
        throw new Error(`Failed to initialize 'DataTableColumnMap'.  The primary key of ${singleKey} is not in the set of columns.`);
      }

      return (new ColumnMap([this.get(singleKey)]));
    }

    if ((primaryKey || []).length > 0) {
      return (new ColumnMap(primaryKey as string[]).map((colName) => {
        if (!this.has(colName)) {
          throw new Error(`Failed to initialize 'DataTableColumnMap'.  The primary key of ${colName} is not in the set of columns.`);
        }

        return Column.from(colName);
      }));
    }

    return (new ColumnMap());
  }
}

export class Cell extends Identifiable {
  private readonly _value: unknown;
  private readonly _column: Column;

  constructor(column: Column, value: unknown) {
    super(column.name);
    this._value = value;
    this._column = column;
  }

  public static coerce(value: unknown): unknown {
    return ((typeof(value) === 'boolean') ? value : (value || null));
  }

  public get value(): unknown {
    return Cell.coerce(this._value);
  }

  public get column(): Column {
    return this._column;
  }

  public toString(): string {
    return `column:=${this.column},value:=${this.value}`;
  }
}

export class CellMap extends IdentifiableMap<Cell> {
  constructor(items: Cell[] = null) {
    super(items);
  }

  public static toCells(columns: ColumnMap, values: unknown[]): CellMap {
    return (new CellMap(columns.values.map((c, i) => new Cell(c, values[i]))));
  }
}

export type RowData = { [key: string]: unknown };

export class Row extends Identifiable {
  private readonly _table: DataTable;
  private readonly _cells: CellMap;
  private _rowid: string = null;

  constructor(table: DataTable, values: unknown[], setDynamicProperties = false) {
    super();
    this._table = table;
    this._cells = CellMap.toCells(table.columns, ((setDynamicProperties) ? this.setDynamicProperties(values) : values));
  }

  protected setDynamicProperties(values: unknown[]): unknown[] {
    const columns = this.table.columns.values;
    const vals = (values || []);

    // Set a dynamic property on the row for each column
    for (let c = 0; (c < columns.length); c++) {
      const prop = `@query.${columns[c].name}`;

      if (c > vals.length) {
        this[prop] = null;
        continue;
      }

      this[prop] = Cell.coerce(vals[c]);
    }

    return vals;
  }

  public get id(): string {
    if (this._rowid) {
      return this._rowid;
    }

    let hash = '';

    // Create delimited hash of the primary key values
    this.table.columns.primaryKey.forEach((pk) => {
      hash += `${(this.cells.get(pk.name).value || 'null')}-`;
    });

    return (this._rowid = hash.substring(0, (hash.length - 1)));
  }

  public get isNull(): boolean {
    return false;
  }

  public get table(): DataTable {
    return this._table;
  }

  public toJson(): { [key: string]: unknown } {
    const json = {};

    this.table.columns.forEach((c) => {
      const cell = this.cells.get(c.name);
      json[c.name] = (cell ? cell.value : null);
    });

    return json;
  }

  public get cells(): CellMap {
    return this._cells;
  }

  public static from(table: DataTable, values: RowData, setDynamicProperties = false): Row {
    const vals = Object.values((values || {}));
    return (new Row(table, vals, setDynamicProperties));
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export class RowMap extends IdentifiableMap<Row> {
  private readonly _table: DataTable;

  constructor(table: DataTable) {
    super();
    this._table = table;
  }

  public get table(): DataTable {
    return this._table;
  }

  public add(values: (RowData | RowData[]), setDynamicProperties = false): RowMap {
    const setOne = (rowValues: RowData, setDynamicProperties = false) => {
      const row = Row.from(this.table, rowValues, setDynamicProperties);
      this.set(row);
    }
    
    if (Array.isArray(values)) {
      (values || []).forEach((v) => setOne(v, setDynamicProperties));
      return this;
    }
    
    setOne(values, setDynamicProperties);
    return this;
  }

  public toJson(): RowData[] {
    return this.map((r) => r.toJson());
  }

  private toCaseInsensitiveString(value: unknown): string {
    return ((value === null || value === undefined) ? '' : value).toString().toUpperCase();
  }

  public find(columns: string[], values: unknown[]): Row[] {
    const rows: Row[] = [];

    if ((!columns) || (!values) || (!columns.length) || (!values.length)) {
      return rows;
    }

    this.forEach((r) => {
      for (let v = 0; (v < values.length); v++) {
        const cell = r.cells.get(columns[v]);

        if (!cell) {
          return;
        }

        const a = this.toCaseInsensitiveString(cell.value);
        const b = this.toCaseInsensitiveString(values[v]);

        if (a !== b) {
          return;
        }
      }

      rows.push(r);
    });

    return rows;
  }
}

export class DataTable extends Identifiable {
  public static readonly Empty: DataTable = new DataTable(new DataTableColumnMap());
  private readonly _columns: DataTableColumnMap;
  private _rows: RowMap;
  private _name: string;

  constructor(columns: DataTableColumnMap, values: (RowData | RowData[]) = []) {
    super();
    this._columns = (columns || new DataTableColumnMap());
    this.rows.add(values);
  }

  public set name(value: string) {
    this._name = (value || '');
  }

  public get name(): string {
    return (this._name || (this._name = ''));
  }

  public get columns(): DataTableColumnMap {
    return this._columns;
  }

  public get rows(): RowMap {
    return (this._rows || (this._rows = new RowMap(this)));
  }

  public static from(data: (RowData | RowData[]), primaryKey: (string | string[]) = null): DataTable {
    if ((!data) || (!data.length)) {
      return DataTable.Empty;
    }

    const rowData = (Array.isArray(data) ? data : [data]);
    const set = new Set(Object.keys(rowData[0]));

    rowData.forEach((r) => {
      Object.keys(r).forEach((k) => {
        set.add(k);
      })
    });
    
    const columnNames = Array.from(set.keys());
    const columns = new DataTableColumnMap(columnNames, (primaryKey || columnNames[0]));

    return (new DataTable(columns)).rows.add(rowData, true).table;
  }

  public static merge(tables: DataTable[]): DataTable {
    const copy = (tables || []).filter((t) => {
      return (!isNullOrUndefined(t));
    });

    if (!copy.length) {
      return DataTable.Empty;
    }

    let mergedRows: RowData[] = copy[0].rows.values.map((r) => {
      return r.toJson();
    });

    for(let t = 1; (t < copy.length); t++) {
      const a = copy[t - 1];
      const b = copy[t];

      // make sure all the columns match otherwise the merge does not make sense
      if (!a.columns.equals(b.columns)) {
        throw new Error('Failed to merge data tables.  The columns for each table do not match.');
      }

      mergedRows = mergedRows.concat(copy[t].rows.values.map((r) => {
        return r.toJson();
      }));   
    }
   
    return (new DataTable(tables[0].columns, mergedRows));
  }
}

export type PivotAreaCode = ('null' | 'row' | 'column' | 'data');

export class PivotArea extends Enum<PivotArea> {
  private static readonly TypeName = 'pivot-area-or';
  public static readonly Null = new PivotArea('0', 'null');
  public static readonly Row = new PivotArea('r', 'row');
  public static readonly Column = new PivotArea('c', 'column');
  public static readonly Data = new PivotArea('d', 'data');

  private constructor(id: string, value: PivotAreaCode) {
    super(PivotArea.TypeName, id, value);
  }

  public get isRow(): boolean {
    return this.is(PivotArea.Row);
  }

  public get isColumn(): boolean {
    return this.is(PivotArea.Column);
  }

  public get isRowOrColumn(): boolean {
    return (this.isRow || this.isColumn);
  }

  public get isData(): boolean {
    return this.is(PivotArea.Data);
  }

  public static tryParse(keyOrValue: (string | PivotAreaCode)): PivotArea {
    return (<PivotArea>PivotArea.attemptParse(PivotArea.TypeName, keyOrValue));
  }

  public static get size(): number {
    return PivotArea.getSize(PivotArea.TypeName);
  }

  public static get random(): PivotArea {
    return (PivotArea.getRandom(PivotArea.TypeName) as PivotArea);
  }

  public static get entries(): PivotArea[] {
    return (PivotArea.getEntries(PivotArea.TypeName) as PivotArea[]);
  }

  public static get keys(): string[] {
    return PivotArea.getKeys(PivotArea.TypeName);
  }

  public static get values(): PivotAreaCode[] {
    return (PivotArea.getValues(PivotArea.TypeName) as PivotAreaCode[]);
  }

  public static forEach(fn: (value: PivotArea, index: number) => void): void {
    PivotArea.forEachOne(PivotArea.TypeName, fn);
  }
}

export abstract class PivotAreaFieldSpecBase extends Identifiable {
  private readonly _specification: PivotDataSpecification;
  private readonly _fieldName: string;
  private readonly _area: PivotArea;

  constructor(fieldName: string, area: (PivotArea | PivotAreaCode), specification: PivotDataSpecification) {
    super();

    if (!(fieldName || '').trim()) {
      throw new Error(`Invalid argument.  No field name specified.`);
    }

    this._specification = specification;
    this._fieldName = fieldName.trim();
    this._area = (((typeof(area) === 'string') ? PivotArea.tryParse(area) : area) || PivotArea.Null);
  }

  public get id(): string {
    return this.fieldName;
  }

  public get fieldName(): string {
    return this._fieldName;
  }

  public get area(): PivotArea {
    return this._area;
  }

  public get specification(): PivotDataSpecification {
    return this._specification;
  }

  public toString(): string {
    return `field:=${this.fieldName},area:=${this.area}`;
  }
}

export class PivotAreaFieldSpec extends PivotAreaFieldSpecBase {
  constructor(fieldName: string, area: (PivotArea | PivotAreaCode), specification: PivotDataSpecification) {
    super(fieldName, area, specification);

    if (!this.area.isRowOrColumn) {
      throw new Error(`Invalid argument.  The specified area [${area}] for the field, ${fieldName} can only be row or column.`);
    }
  }
}

export class PivotDataCellCalcContext {
  private readonly _specification: PivotDataSpecification;
  private readonly _sourceData: DataTable;
  private readonly _current: DataTable;

  constructor(specification: PivotDataSpecification, sourceData: DataTable, current: DataTable) {
    this._specification = specification;
    this._sourceData = sourceData;
    this._current = current;
  }

  public get specification():  PivotDataSpecification {
    return this._specification;
  }

  public get sourceData():  DataTable {
    return this._sourceData;
  }

  public get current():  DataTable {
    return this._current;
  }
}

export type PivotDataCellCalcFn = ((context: PivotDataCellCalcContext) => number);

export class PivotDataAreaFieldSpec extends PivotAreaFieldSpecBase {
  private readonly _fn: PivotDataCellCalcFn;

  constructor(fieldName: string, fn: PivotDataCellCalcFn, specification: PivotDataSpecification) {
    super(fieldName, PivotArea.Data, specification);
    this._fn = fn;
  }

  public get fn(): PivotDataCellCalcFn {
    return this._fn;
  } 
}

export abstract class PivotAreaFieldSpecBaseMap<T> {
  private readonly _specification: PivotDataSpecification;
  
  constructor(specification: PivotDataSpecification) {
    this._specification = specification;
  }

  public get specification(): PivotDataSpecification {
    return this._specification;
  }

  protected abstract get inner(): IdentifiableMap<T>;

  public get size(): number {
    return this.inner.size;
  }

  public get isEmpty(): boolean {
    return this.inner.isEmpty;
  }

  public get values(): T[] {
    return this.inner.values;
  }

  public get keys(): string[] {
    return this.inner.keys;
  }

  public get(value: (string | number)): T {
    return this.inner.get(value);
  }

  public has(value: (T | string | number)): boolean {
    return this.inner.has(value);
  }

  public forEach(fn: (item: T, index: number) => void): void {
    this.inner.forEach(fn);
  }

  public filter(fn: (item: T) => boolean): T[] {
    return this.inner.filter(fn);
  }

  public map(fn: (item: T, index: number) => any): any {
    return this.inner.map(fn);
  }

  public any(keys: (string[] | number[])): boolean {
    return this.inner.any(keys);
  }

  public indexOf(value: (T | string)): number {
    return this.inner.indexOf(value);
  }

  public equals(other: IdentifiableMap<T>): boolean {
    return this.inner.equals(other);
  }

  public toString(): string {
    return this.inner.toString();
  }
}

export type FieldSpec = {
  [key: string]: (PivotArea | PivotAreaCode);
}

export type DataFieldSpec = {
  [key: string]: PivotDataCellCalcFn;
}
export class PivotAreaFieldSpecMap extends PivotAreaFieldSpecBaseMap<PivotAreaFieldSpec> {
  private readonly _inner = new IdentifiableMap<PivotAreaFieldSpec>();

  constructor(specification: PivotDataSpecification) {
    super(specification);
  }

  protected get inner(): IdentifiableMap<PivotAreaFieldSpec> {
    return this._inner;
  }

  public set(specs: (FieldSpec | FieldSpec[])): PivotAreaFieldSpecMap {
    if (!specs) {
      return this;
    }

    if (!Array.isArray(specs)) {
      specs = [specs];
    }

    specs.forEach((spec) => {
      Object.keys(spec).forEach((k) => {
        this._inner.set(new PivotAreaFieldSpec(k, spec[k], this.specification));
      });
    });

    return this;
  }
}

export class PivotDataAreaFieldSpecMap extends PivotAreaFieldSpecBaseMap<PivotDataAreaFieldSpec> {
  private readonly _inner = new IdentifiableMap<PivotDataAreaFieldSpec>();
  
  constructor(specification: PivotDataSpecification) {
    super(specification);
  }

  protected get inner(): IdentifiableMap<PivotDataAreaFieldSpec> {
    return this._inner;
  }

  public set(specs: (DataFieldSpec | DataFieldSpec[])): PivotDataAreaFieldSpecMap {
    if (!specs) {
      return this;
    }

    if (!Array.isArray(specs)) {
      specs = [specs];
    }

    specs.forEach((spec) => {
      Object.keys(spec).forEach((k) => {
        this._inner.set(new PivotDataAreaFieldSpec(k, spec[k], this.specification));
      });
    });

    return this;
  }
}

export class PivotDataSpecification {
  private readonly _fields: PivotAreaFieldSpecMap;
  private readonly _dataFields: PivotDataAreaFieldSpecMap;

  constructor() {
    this._fields = new PivotAreaFieldSpecMap(this);
    this._dataFields = new PivotDataAreaFieldSpecMap(this);
  }

  public get fields(): PivotAreaFieldSpecMap {
    return this._fields;
  }

  public get dataFields(): PivotDataAreaFieldSpecMap {
    return this._dataFields;
  }

  public clone(): PivotDataSpecification {
    const target = new PivotDataSpecification();

    target.fields.forEach((spec) => {
      target.fields.set({ [spec.fieldName]: spec.area });
    });

    target.dataFields.forEach((spec) => {
      target.dataFields.set({ [spec.fieldName]: spec.fn });
    });

    return target;
  }
}

export class PivotDataResult {
  private readonly _root: PivotDataCell;
  private _data: DataTable;

  constructor(root: PivotDataCell) {
    this._root = root;
  }

  public get specification(): PivotDataSpecification {
    return this._root.specification;
  }

  public get root(): PivotDataCell {
    return this._root;
  }

  public get sourceData(): DataTable {
    return this._root.sourceData;
  }

  public get data(): DataTable {
    return this._data;
  }
}

export class PivotDataCellUrl extends Identifiable {
  public static readonly Root = new PivotDataCellUrl([]);
  private readonly _parts: string[];
  private readonly _delimiter: string;

  public constructor(parts: string[], delmiter = '/') {
    super(PivotDataCellUrl.createValue(parts, delmiter))
    this._parts = (parts || []);
    this._delimiter = delmiter;
  }

  public get parts(): string[] {
    return this._parts;
  }

  public get delimiter(): string {
    return this._delimiter;
  }

  public get isRoot(): boolean {
    return (this._parts.length === 0);
  }

  public get value(): string {
    return this.id;
  }

  public static createValue(parts: string[], delimiter = '/'): string {
    if (!parts || !parts.length) {
      return `${delimiter}root`;
    }

    const maxIndex = (parts.length - 1);
    let url = `${delimiter}root${delimiter}`;

    parts.forEach((v, index) => {
      url += v;

      if (index < maxIndex) {
        url += delimiter;
      }
    });

    return url;
  }

  public toString(): string {
    return this.value;
  }
}

export class PivotDataCell extends Composite<PivotDataCell> {
  private readonly _specification: PivotDataSpecification;
  private readonly _sourceData: DataTable;
  private readonly _url: PivotDataCellUrl;
  private _rows: Row[];
  private _isReadOnly: boolean;

  public constructor(url: PivotDataCellUrl, specification: PivotDataSpecification, sourceData: DataTable, rows: Row[] = []) {
    super(url.value);
    this._url = url;
    this._rows = rows;
    this._specification = specification;
    this._isReadOnly = false;
    this._sourceData = sourceData;
  }

  public get url(): PivotDataCellUrl {
    return this._url;
  }

  public get isReadOnly(): boolean {
    return (this._isReadOnly || this.url.isRoot);
  }

  public get sourceData(): DataTable {
    return this._sourceData;
  }

  public get rows(): Row[] {
    if (this._url.isRoot) {
      this._rows = this.sourceData.rows.values;
    }

    return this._rows;
  }

  public get specification(): PivotDataSpecification {
    return this._specification;
  }

  public setAsReadOnly(): PivotDataCell {
    this._isReadOnly = true;
    return this;
  }

  public addRow(row: Row): PivotDataCell {
    if (this.isReadOnly) {
      throw new Error(`Invalid operation expection.  Failed to add row to ${this.url}.`)
    }
    
    this._rows.push(row);
    return this;
  }  

  public get(dataField: string): number {
    // TOOD: Fill in
    return 0;
  }
}

export class PivotDataService {
  private readonly _specification: PivotDataSpecification;
  constructor() {
    this._specification = new PivotDataSpecification();
  }

  public get specification(): PivotDataSpecification {
    return this._specification;
  }

  private buildComposite(sourceData: DataTable): PivotDataCell {
    const spec = this.specification
    const root = new PivotDataCell(PivotDataCellUrl.Root, spec, sourceData);
    const nodeMap = new Map<number, Map<string, PivotDataCell>>();

    console.log(`creating composite structure from ${sourceData.rows.size} rows ...`);
    console.time(`composite`);

    sourceData.rows.forEach((row) => {
      const fvalues = [];
      let parent = root;

      spec.fields.forEach((f, level) => {        
        let urlMap = (nodeMap.get(level));
        
        if (!urlMap) {
          nodeMap.set(level, (urlMap = new Map<string, PivotDataCell>()));
        }
        
        fvalues.push((row.cells.get(f.fieldName).value || '-').toString());
        const url = new PivotDataCellUrl(fvalues);

        // Get or create node and add row
        let node = urlMap.get(url.value);
        
        if (!node) {
          urlMap.set(url.value, (node = new PivotDataCell(url, spec, sourceData)));
          parent.components.set(node);
        }

        parent = node.addRow(row);
              
        // spec.dataFields.forEach((d) => {
        //   parent.components.set(new PivotCell(new PivotDataCellUrl([...fvalues, d.fieldName]), spec).addRow(row));
        // });
      });      
    });

    console.log(`composite structure created from ${sourceData.rows.size} rows`);
    console.timeEnd(`composite`);

    return root;
  }

  public execute(sourceData: DataTable): PivotDataResult {
    const spec = this.specification;

    if (spec.fields.isEmpty) {
      throw new Error(`Invalid operation.  Pivot data operation failed.  No 'fields' set on the specification.`);
    }

    if (spec.dataFields.isEmpty) {
      throw new Error(`Invalid operation.  Pivot data operation failed.  No 'data fields' set on the specification.`);
    }

    // Validate the source data has all of the fields (not necessarily data fields)
    spec.fields.forEach((f) => {
      if (!sourceData.columns.has(f.fieldName)) {
        throw new Error(`Argument exception.  The specified data source does not have a field to pivot on named '${f.fieldName}'`);
      }
    });

    return (new PivotDataResult(this.buildComposite(sourceData)));
  }
}