import { Enum, Identifiable, IdentifiableMap } from './entity';

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
    this._searchString = (value || '');
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

  constructor(queryParameters: EntityQueryParameters, value: T, totalRows: number = null, previousUrl = '', nextUrl = '') {
    this._queryParameters = queryParameters;
    this._value = value;
    this._totalRows = totalRows;
    this._previousUrl = previousUrl;
    this._nextUrl = nextUrl;
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

  public get previousUrl(): string {
    return (this._previousUrl || '');
  }

  public get nextUrl(): string {
    return (this._nextUrl || '');
  }
}

export type PageDirectionCode = ('Previous' | 'Next' | '');

export class PageDirection extends Enum<PageDirection> {
  private static readonly TypeName: string = 'PageDirection';
  public static readonly None: PageDirection = new PageDirection('0', '');
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


export type ColumnTypeName = ('null' | 'any' | 'string' | 'number' | 'date' | 'boolean');

export class ColumnType extends Enum<ColumnType> {
  private static readonly TypeName: string = 'ColumnType';

  public static readonly Null: ColumnType = new ColumnType('0', 'null');
  public static readonly Any: ColumnType = new ColumnType('1', 'any');
  public static readonly String: ColumnType = new ColumnType('2', 'string');
  public static readonly Number: ColumnType = new ColumnType('3', 'number');
  public static readonly Date: ColumnType = new ColumnType('4', 'date');
  public static readonly Boolean: ColumnType = new ColumnType('5', 'boolean');

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
    super((name || 'null'));
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
    return ((typeof(value) === 'boolean') ? value : (value || null))
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
  private _json: { [key: string]: unknown } = null;
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
      const column = columns[c];

      if (c > vals.length) {
        this[column.name] = null;
        continue;
      }

      const hasProperty = Object.prototype.hasOwnProperty.call(this, column.name);
      this[((hasProperty) ? `_${column.name}`: column.name)] = Cell.coerce(vals[c]);
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
    if (!this._json) {
      const json = {};

      this.table.columns.forEach((c) => {
        const cell = this.cells.get(c.name);
        json[c.name] = (cell ? cell.value : null);
      });

      return (this._json = json);
    }

    return this._json;
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
    const setOne = (rowValues: { [key: string]: unknown }, setDynamicProperties = false) => {
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

  constructor(columns: DataTableColumnMap, values: (RowData | RowData[]) = []) {
    super();
    this._columns = (columns || new DataTableColumnMap());
    this.rows.add(values);
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
}