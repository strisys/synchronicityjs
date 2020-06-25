"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = exports.RowMap = exports.Row = exports.CellMap = exports.Cell = exports.DataTableColumnMap = exports.ColumnMap = exports.Column = exports.ColumnType = exports.PageDirection = exports.EntityQueryPage = exports.EntityQueryParameters = void 0;
const entity_1 = require("./entity");
class EntityQueryParameters {
    constructor(pageNumber, pageSize, searchString = null, previous = null) {
        this.toJsonObject = () => {
            return {
                pageNumber: this.pageNumber,
                pageSize: this.pageSize,
                searchString: this.searchString
            };
        };
        this.clone = () => {
            return (new EntityQueryParameters(this.pageNumber, this.pageSize, this.searchString, this.previous));
        };
        this._pageNumber = pageNumber;
        this._pageSize = pageSize;
        this._searchString = (searchString || '');
        this._previous = (previous || EntityQueryParameters.Null);
    }
    get isNull() {
        return (this === EntityQueryParameters.Null);
    }
    get pageSize() {
        return this._pageSize;
    }
    get pageNumber() {
        return this._pageNumber;
    }
    get searchString() {
        return (this._searchString || '');
    }
    set searchString(value) {
        this._searchString = ((value) ? JSON.stringify(value) : '');
    }
    get previous() {
        return (this._previous || EntityQueryParameters.Null);
    }
    static default() {
        return (new EntityQueryParameters(1, 10));
    }
    changePage(pageNumber) {
        return (new EntityQueryParameters(pageNumber, this.pageSize, this.searchString, this.clone()));
    }
    changeSize(pageSize) {
        return (new EntityQueryParameters(this.pageNumber, pageSize, this.searchString, this.clone()));
    }
    changeSearchString(searchString) {
        return (new EntityQueryParameters(this.pageNumber, this.pageSize, searchString, this.clone()));
    }
    toString() {
        return `pageSize:=${this.pageSize},pageNumber:=${this.pageNumber},searchString:=${this.searchString}`;
    }
}
exports.EntityQueryParameters = EntityQueryParameters;
EntityQueryParameters.Null = new EntityQueryParameters(0, 0, '');
class EntityQueryPage {
    constructor(queryParameters, value, totalRows = null, previousUrl = '', nextUrl = '', executionDuration = null) {
        this._queryParameters = queryParameters;
        this._value = value;
        this._totalRows = totalRows;
        this._previousUrl = previousUrl;
        this._nextUrl = nextUrl;
        this._executionDuration = executionDuration;
    }
    get queryParameters() {
        return this._queryParameters;
    }
    get value() {
        return (this._value || null);
    }
    get totalRows() {
        return (this._totalRows || null);
    }
    get executionDuration() {
        return (this._executionDuration || null);
    }
    get previousUrl() {
        return (this._previousUrl || '');
    }
    get nextUrl() {
        return (this._nextUrl || '');
    }
}
exports.EntityQueryPage = EntityQueryPage;
class PageDirection extends entity_1.Enum {
    constructor(id, value) {
        super(PageDirection.TypeName, id, value);
    }
    get isPrevious() {
        return this.is(PageDirection.Previous);
    }
    get isNext() {
        return this.is(PageDirection.Next);
    }
    static get size() {
        return PageDirection.getSize(PageDirection.TypeName);
    }
    static tryParse(keyOrValue) {
        return (PageDirection.attemptParse(PageDirection.TypeName, keyOrValue) || PageDirection.None);
    }
    static get entries() {
        return PageDirection.getEntries(PageDirection.TypeName);
    }
    static get keys() {
        return PageDirection.getKeys(PageDirection.TypeName);
    }
    static get values() {
        return PageDirection.getValues(PageDirection.TypeName);
    }
    static forEach(fn) {
        PageDirection.forEachOne(PageDirection.TypeName, fn);
    }
}
exports.PageDirection = PageDirection;
PageDirection.TypeName = 'PageDirection';
PageDirection.None = new PageDirection('0', 'None');
PageDirection.Previous = new PageDirection('1', 'Previous');
PageDirection.Next = new PageDirection('2', 'Next');
class ColumnType extends entity_1.Enum {
    constructor(id, value) {
        super(ColumnType.TypeName, id, value);
    }
    static tryParse(keyOrValue) {
        return (ColumnType.attemptParse(ColumnType.TypeName, keyOrValue) || ColumnType.Null);
    }
    static get size() {
        return ColumnType.getSize(ColumnType.TypeName);
    }
    static get entries() {
        return ColumnType.getEntries(ColumnType.TypeName);
    }
    static get keys() {
        return ColumnType.getKeys(ColumnType.TypeName);
    }
    static get values() {
        return ColumnType.getValues(ColumnType.TypeName);
    }
    static forEach(fn) {
        ColumnType.forEachOne(ColumnType.TypeName, fn);
    }
}
exports.ColumnType = ColumnType;
ColumnType.TypeName = 'ColumnType';
ColumnType.Null = new ColumnType('0', 'null');
ColumnType.Any = new ColumnType('1', 'any');
ColumnType.String = new ColumnType('2', 'string');
ColumnType.Number = new ColumnType('3', 'number');
ColumnType.Date = new ColumnType('4', 'date');
ColumnType.Boolean = new ColumnType('5', 'boolean');
class Column extends entity_1.Identifiable {
    constructor(name, title = null, type = ColumnType.Any) {
        super(name);
        this._title = (title || this.id);
        this._type = (type || ColumnType.Any);
    }
    get isNull() {
        return false;
    }
    get name() {
        return (this.id || '');
    }
    get title() {
        return (this._title || '');
    }
    set title(value) {
        this._title = (value || '');
    }
    get type() {
        return (this._type || ColumnType.Any);
    }
    set type(value) {
        this._type = (value || ColumnType.Any);
    }
    static from(items) {
        const vals = (Array.isArray(items) ? items : [items]);
        const tryCreateColumn = (name) => {
            if (typeof (name) === 'string') {
                return (new Column(name));
            }
            return (name || null);
        };
        if ((vals.length > 0) && (typeof (vals[0]) === 'string')) {
            return vals.map(tryCreateColumn);
        }
        return items;
    }
    toString() {
        return this.name;
    }
}
exports.Column = Column;
class ColumnMap extends entity_1.IdentifiableMap {
    constructor(items = null) {
        super(Column.from(items));
    }
    get names() {
        return this.map((c) => c.name);
    }
}
exports.ColumnMap = ColumnMap;
class DataTableColumnMap extends ColumnMap {
    constructor(items = null, primaryKey = null) {
        super(Column.from(items));
        this._primaryKey = this.validatePrimaryKey(primaryKey);
    }
    get primaryKey() {
        return this._primaryKey;
    }
    validatePrimaryKey(primaryKey) {
        if (typeof (primaryKey) === 'string') {
            const singleKey = primaryKey;
            if (!this.has(singleKey)) {
                throw new Error(`Failed to initialize 'DataTableColumnMap'.  The primary key of ${singleKey} is not in the set of columns.`);
            }
            return (new ColumnMap([this.get(singleKey)]));
        }
        if ((primaryKey || []).length > 0) {
            return (new ColumnMap(primaryKey).map((colName) => {
                if (!this.has(colName)) {
                    throw new Error(`Failed to initialize 'DataTableColumnMap'.  The primary key of ${colName} is not in the set of columns.`);
                }
                return Column.from(colName);
            }));
        }
        return (new ColumnMap());
    }
}
exports.DataTableColumnMap = DataTableColumnMap;
class Cell extends entity_1.Identifiable {
    constructor(column, value) {
        super(column.name);
        this._value = value;
        this._column = column;
    }
    static coerce(value) {
        return ((typeof (value) === 'boolean') ? value : (value || null));
    }
    get value() {
        return Cell.coerce(this._value);
    }
    get column() {
        return this._column;
    }
    toString() {
        return `column:=${this.column},value:=${this.value}`;
    }
}
exports.Cell = Cell;
class CellMap extends entity_1.IdentifiableMap {
    constructor(items = null) {
        super(items);
    }
    static toCells(columns, values) {
        return (new CellMap(columns.values.map((c, i) => new Cell(c, values[i]))));
    }
}
exports.CellMap = CellMap;
class Row extends entity_1.Identifiable {
    constructor(table, values, setDynamicProperties = false) {
        super();
        this._rowid = null;
        this._table = table;
        this._cells = CellMap.toCells(table.columns, ((setDynamicProperties) ? this.setDynamicProperties(values) : values));
    }
    setDynamicProperties(values) {
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
    get id() {
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
    get isNull() {
        return false;
    }
    get table() {
        return this._table;
    }
    toJson() {
        const json = {};
        this.table.columns.forEach((c) => {
            const cell = this.cells.get(c.name);
            json[c.name] = (cell ? cell.value : null);
        });
        return json;
    }
    get cells() {
        return this._cells;
    }
    static from(table, values, setDynamicProperties = false) {
        const vals = Object.values((values || {}));
        return (new Row(table, vals, setDynamicProperties));
    }
    toString() {
        return JSON.stringify(this.toJson());
    }
}
exports.Row = Row;
class RowMap extends entity_1.IdentifiableMap {
    constructor(table) {
        super();
        this._table = table;
    }
    get table() {
        return this._table;
    }
    add(values, setDynamicProperties = false) {
        const setOne = (rowValues, setDynamicProperties = false) => {
            const row = Row.from(this.table, rowValues, setDynamicProperties);
            this.set(row);
        };
        if (Array.isArray(values)) {
            (values || []).forEach((v) => setOne(v, setDynamicProperties));
            return this;
        }
        setOne(values, setDynamicProperties);
        return this;
    }
    toJson() {
        return this.map((r) => r.toJson());
    }
    toCaseInsensitiveString(value) {
        return ((value === null || value === undefined) ? '' : value).toString().toUpperCase();
    }
    find(columns, values) {
        const rows = [];
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
exports.RowMap = RowMap;
class DataTable extends entity_1.Identifiable {
    constructor(columns, values = []) {
        super();
        this._columns = (columns || new DataTableColumnMap());
        this.rows.add(values);
    }
    get columns() {
        return this._columns;
    }
    get rows() {
        return (this._rows || (this._rows = new RowMap(this)));
    }
    static from(data, primaryKey = null) {
        if ((!data) || (!data.length)) {
            return DataTable.Empty;
        }
        const rowData = (Array.isArray(data) ? data : [data]);
        const set = new Set(Object.keys(rowData[0]));
        rowData.forEach((r) => {
            Object.keys(r).forEach((k) => {
                set.add(k);
            });
        });
        const columnNames = Array.from(set.keys());
        const columns = new DataTableColumnMap(columnNames, (primaryKey || columnNames[0]));
        return (new DataTable(columns)).rows.add(rowData, true).table;
    }
}
exports.DataTable = DataTable;
DataTable.Empty = new DataTable(new DataTableColumnMap());
//# sourceMappingURL=query.js.map