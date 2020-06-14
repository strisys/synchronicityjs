import { Enum, Identifiable, IdentifiableMap } from './entity';
export declare class EntityQueryParameters {
    static readonly Null: EntityQueryParameters;
    private _pageNumber;
    private _pageSize;
    private _searchString;
    private _previous;
    constructor(pageNumber: number, pageSize: number, searchString?: string, previous?: EntityQueryParameters);
    get isNull(): boolean;
    get pageSize(): number;
    get pageNumber(): number;
    get searchString(): string;
    set searchString(value: string);
    get previous(): EntityQueryParameters;
    static default(): EntityQueryParameters;
    changePage(pageNumber: number): EntityQueryParameters;
    changeSize(pageSize: number): EntityQueryParameters;
    changeSearchString(searchString: string): EntityQueryParameters;
    toJsonObject: () => {
        [key: string]: string | number;
    };
    clone: () => EntityQueryParameters;
    toString(): string;
}
export declare class EntityQueryPage<T> {
    private readonly _queryParameters;
    private readonly _totalRows;
    private readonly _previousUrl;
    private readonly _nextUrl;
    private readonly _value;
    constructor(queryParameters: EntityQueryParameters, value: T, totalRows?: number, previousUrl?: string, nextUrl?: string);
    get queryParameters(): EntityQueryParameters;
    get value(): T;
    get totalRows(): number;
    get previousUrl(): string;
    get nextUrl(): string;
}
export declare type PageDirectionCode = ('Previous' | 'Next' | '');
export declare class PageDirection extends Enum<PageDirection> {
    private static readonly TypeName;
    static readonly None: PageDirection;
    static readonly Previous: PageDirection;
    static readonly Next: PageDirection;
    private constructor();
    get isPrevious(): boolean;
    get isNext(): boolean;
    static get size(): number;
    static tryParse(keyOrValue: (string | PageDirectionCode)): PageDirection;
    static get entries(): PageDirection[];
    static get keys(): string[];
    static get values(): PageDirectionCode[];
    static forEach(fn: (value: PageDirection, index: number) => void): void;
}
export declare type ColumnTypeName = ('null' | 'any' | 'string' | 'number' | 'date' | 'boolean');
export declare class ColumnType extends Enum<ColumnType> {
    private static readonly TypeName;
    static readonly Null: ColumnType;
    static readonly Any: ColumnType;
    static readonly String: ColumnType;
    static readonly Number: ColumnType;
    static readonly Date: ColumnType;
    static readonly Boolean: ColumnType;
    private constructor();
    static tryParse(keyOrValue: (string | PageDirectionCode)): PageDirection;
    static get size(): number;
    static get entries(): ColumnType[];
    static get keys(): string[];
    static get values(): ColumnTypeName[];
    static forEach(fn: (value: ColumnType, index: number) => void): void;
}
export declare class Column extends Identifiable {
    private _title;
    private _type;
    constructor(name: string, title?: string, type?: ColumnType);
    get isNull(): boolean;
    get name(): string;
    get title(): string;
    set title(value: string);
    get type(): ColumnType;
    set type(value: ColumnType);
    static toColumms(items: (string[] | Column[])): Column[];
    static toColumn(column: (string | Column)): Column;
}
export declare class ColumnMap extends IdentifiableMap<Column> {
    constructor(items?: (string[] | Column[]));
    get names(): string[];
    protected static toColumms(items: (string[] | Column[])): Column[];
    protected static toColumn(column: (string | Column)): Column;
}
export declare class DataTableColumnMap extends ColumnMap {
    private readonly _primaryKey;
    constructor(items?: (string[] | Column[]), primaryKey?: (string | string[]));
    get primaryKey(): ColumnMap;
    private validatePrimaryKey;
}
export declare class Cell extends Identifiable {
    private readonly _value;
    private readonly _column;
    constructor(column: Column, value: unknown);
    get value(): unknown;
    get column(): Column;
}
export declare class CellMap extends IdentifiableMap<Cell> {
    constructor(items?: Cell[]);
    static toCells(columns: ColumnMap, values: unknown[]): CellMap;
}
export declare type RowData = {
    [key: string]: unknown;
};
export declare class Row extends Identifiable {
    private readonly _table;
    private readonly _cells;
    private _json;
    private _rowid;
    constructor(table: DataTable, values: unknown[], setDynamicProperties?: boolean);
    protected setDynamicProperties(values: unknown[]): unknown[];
    get id(): string;
    get isNull(): boolean;
    get table(): DataTable;
    toJson(): {
        [key: string]: unknown;
    };
    get cells(): CellMap;
    static toRow: (table: DataTable, values: RowData, setDynamicProperties?: boolean) => Row;
    toString(): string;
}
export declare class RowMap extends IdentifiableMap<Row> {
    private readonly _table;
    constructor(table: DataTable);
    get table(): DataTable;
    add(values: (RowData | RowData[]), setDynamicProperties?: boolean): RowMap;
    toJson(): RowData[];
    private toCaseInsensitiveString;
    find(columns: string[], values: unknown[]): Row[];
}
export declare class DataTable extends Identifiable {
    static readonly Empty: DataTable;
    private readonly _columns;
    private _rows;
    constructor(columns: DataTableColumnMap, values?: (RowData | RowData[]));
    get columns(): DataTableColumnMap;
    get rows(): RowMap;
}
