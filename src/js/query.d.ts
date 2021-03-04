import { Enum, Identifiable, IdentifiableMap } from './entity';
export declare type AndOrCode = ('null' | 'and' | 'or');
export declare class AndOr extends Enum<AndOr> {
    private static readonly TypeName;
    static readonly Null: AndOr;
    static readonly And: AndOr;
    static readonly Or: AndOr;
    private constructor();
    get isAnd(): boolean;
    get isOr(): boolean;
    static tryParse(keyOrValue: (string | AndOrCode)): AndOr;
    static get size(): number;
    static get random(): AndOr;
    static get entries(): AndOr[];
    static get keys(): string[];
    static get values(): AndOrCode[];
    static forEach(fn: (value: AndOr, index: number) => void): void;
}
export declare type AscDescCode = ('null' | 'asc' | 'desc');
export declare class AscDesc extends Enum<AscDescCode> {
    private static readonly TypeName;
    static readonly Null: AscDesc;
    static readonly Asc: AscDesc;
    static readonly Desc: AscDesc;
    private constructor();
    get isAsc(): boolean;
    get isDesc(): boolean;
    static tryParse(keyOrValue: (string | AscDescCode)): AscDesc;
    static get size(): number;
    static get random(): AscDesc;
    static get entries(): AscDesc[];
    static get keys(): string[];
    static get values(): AscDescCode[];
    static forEach(fn: (value: AscDesc, index: number) => void): void;
}
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
    private _executionDuration;
    constructor(queryParameters: EntityQueryParameters, value: T, totalRows?: number, previousUrl?: string, nextUrl?: string, executionDuration?: any);
    get queryParameters(): EntityQueryParameters;
    get value(): T;
    get totalRows(): number;
    get executionDuration(): number;
    get previousUrl(): string;
    get nextUrl(): string;
}
export declare type PageDirectionCode = ('Previous' | 'Next' | 'None');
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
    static from(items: (string | Column | string[] | Column[])): Column[];
    equals(other: Column): boolean;
    toString(): string;
}
export declare class ColumnMap extends IdentifiableMap<Column> {
    constructor(items?: (string[] | Column[]));
    get names(): string[];
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
    static coerce(value: unknown): unknown;
    get value(): unknown;
    get column(): Column;
    toString(): string;
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
    static from(table: DataTable, values: RowData, setDynamicProperties?: boolean): Row;
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
    static from(data: (RowData | RowData[]), primaryKey?: (string | string[])): DataTable;
    static merge(tables: DataTable[]): DataTable;
}
