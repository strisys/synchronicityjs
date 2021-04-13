"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PivotDataService = exports.PivotDataCell = exports.PivotDataCellValues = exports.PivotDataCellUrl = exports.PivotDataResult = exports.PivotDataSpecification = exports.PivotDataAreaFieldSpecMap = exports.PivotAreaFieldSpecMap = exports.PivotAreaFieldSpecBaseMap = exports.PivotDataAreaFieldSpec = exports.getPivotDataCellCalcSumFn = exports.PivotDataCellCalcContext = exports.PivotAreaFieldSpec = exports.PivotAreaFieldSpecBase = exports.PivotArea = exports.DataTable = exports.RowMap = exports.Row = exports.CellMap = exports.Cell = exports.DataTableColumnMap = exports.ColumnMap = exports.Column = exports.ColumnType = exports.PageDirection = exports.EntityQueryPage = exports.EntityQueryParameters = exports.AscDesc = exports.AndOr = void 0;
const entity_1 = require("./entity");
class AndOr extends entity_1.Enum {
    constructor(id, value) {
        super(AndOr.TypeName, id, value);
    }
    get isAnd() {
        return this.is(AndOr.And);
    }
    get isOr() {
        return this.is(AndOr.Or);
    }
    static tryParse(keyOrValue) {
        return AndOr.attemptParse(AndOr.TypeName, keyOrValue);
    }
    static get size() {
        return AndOr.getSize(AndOr.TypeName);
    }
    static get random() {
        return AndOr.getRandom(AndOr.TypeName);
    }
    static get entries() {
        return AndOr.getEntries(AndOr.TypeName);
    }
    static get keys() {
        return AndOr.getKeys(AndOr.TypeName);
    }
    static get values() {
        return AndOr.getValues(AndOr.TypeName);
    }
    static forEach(fn) {
        AndOr.forEachOne(AndOr.TypeName, fn);
    }
}
exports.AndOr = AndOr;
AndOr.TypeName = 'and-or';
AndOr.Null = new AndOr('0', 'null');
AndOr.And = new AndOr('1', 'and');
AndOr.Or = new AndOr('2', 'or');
class AscDesc extends entity_1.Enum {
    constructor(id, value) {
        super(AscDesc.TypeName, id, value);
    }
    get isAsc() {
        return this.is(AscDesc.Asc);
    }
    get isDesc() {
        return this.is(AscDesc.Desc);
    }
    static tryParse(keyOrValue) {
        return AscDesc.attemptParse(AscDesc.TypeName, keyOrValue);
    }
    static get size() {
        return AscDesc.getSize(AscDesc.TypeName);
    }
    static get random() {
        return AscDesc.getRandom(AscDesc.TypeName);
    }
    static get entries() {
        return AscDesc.getEntries(AscDesc.TypeName);
    }
    static get keys() {
        return AscDesc.getKeys(AscDesc.TypeName);
    }
    static get values() {
        return AscDesc.getValues(AscDesc.TypeName);
    }
    static forEach(fn) {
        AscDesc.forEachOne(AscDesc.TypeName, fn);
    }
}
exports.AscDesc = AscDesc;
AscDesc.TypeName = 'AscDesc';
AscDesc.Null = new AscDesc('0', 'null');
AscDesc.Asc = new AscDesc('1', 'asc');
AscDesc.Desc = new AscDesc('2', 'desc');
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
ColumnType.Object = new ColumnType('6', 'object');
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
    equals(other) {
        return ((other) ? ((this === other) || (this.name === other.name)) : false);
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
        if ((typeof (value) === 'number') || (typeof (value) === 'string')) {
            return ((value === undefined) ? null : value);
        }
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
        const pks = this.table.columns.primaryKey;
        if (pks.size === 1) {
            const pkName = pks.get(0).name;
            return (this._rowid = `${(this.cells.get(pkName).value || 'null')}`);
        }
        let hash = '';
        // Create delimited hash of the primary key values
        pks.forEach((pk) => {
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
    set name(value) {
        this._name = (value || '');
    }
    get name() {
        return (this._name || (this._name = ''));
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
    static merge(tables) {
        const copy = (tables || []).filter((t) => {
            return (!entity_1.isNullOrUndefined(t));
        });
        if (!copy.length) {
            return DataTable.Empty;
        }
        let mergedRows = copy[0].rows.values.map((r) => {
            return r.toJson();
        });
        for (let t = 1; (t < copy.length); t++) {
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
exports.DataTable = DataTable;
DataTable.Empty = new DataTable(new DataTableColumnMap());
class PivotArea extends entity_1.Enum {
    constructor(id, value) {
        super(PivotArea.TypeName, id, value);
    }
    get isRow() {
        return this.is(PivotArea.Row);
    }
    get isColumn() {
        return this.is(PivotArea.Column);
    }
    get isRowOrColumn() {
        return (this.isRow || this.isColumn);
    }
    get isData() {
        return this.is(PivotArea.Data);
    }
    static tryParse(keyOrValue) {
        return PivotArea.attemptParse(PivotArea.TypeName, keyOrValue);
    }
    static get size() {
        return PivotArea.getSize(PivotArea.TypeName);
    }
    static get random() {
        return PivotArea.getRandom(PivotArea.TypeName);
    }
    static get entries() {
        return PivotArea.getEntries(PivotArea.TypeName);
    }
    static get keys() {
        return PivotArea.getKeys(PivotArea.TypeName);
    }
    static get values() {
        return PivotArea.getValues(PivotArea.TypeName);
    }
    static forEach(fn) {
        PivotArea.forEachOne(PivotArea.TypeName, fn);
    }
}
exports.PivotArea = PivotArea;
PivotArea.TypeName = 'pivot-area-or';
PivotArea.Null = new PivotArea('0', 'null');
PivotArea.Row = new PivotArea('r', 'row');
PivotArea.Column = new PivotArea('c', 'column');
PivotArea.Data = new PivotArea('d', 'data');
class PivotAreaFieldSpecBase extends entity_1.Identifiable {
    constructor(fieldName, area, specification) {
        super();
        if (!(fieldName || '').trim()) {
            throw new Error(`Invalid argument.  No field name specified.`);
        }
        this._specification = specification;
        this._fieldName = fieldName.trim();
        this._area = (((typeof (area) === 'string') ? PivotArea.tryParse(area) : area) || PivotArea.Null);
    }
    get id() {
        return this.fieldName;
    }
    get fieldName() {
        return this._fieldName;
    }
    get area() {
        return this._area;
    }
    get specification() {
        return this._specification;
    }
    toString() {
        return `field:=${this.fieldName},area:=${this.area}`;
    }
}
exports.PivotAreaFieldSpecBase = PivotAreaFieldSpecBase;
class PivotAreaFieldSpec extends PivotAreaFieldSpecBase {
    constructor(fieldName, area, specification) {
        super(fieldName, area, specification);
        if (!this.area.isRowOrColumn) {
            throw new Error(`Invalid argument.  The specified area [${area}] for the field, ${fieldName} can only be row or column.`);
        }
    }
}
exports.PivotAreaFieldSpec = PivotAreaFieldSpec;
class PivotDataCellCalcContext {
    constructor(node, dfSpec) {
        this._node = node;
        this._dfSpec = dfSpec;
    }
    get node() {
        return this._node;
    }
    get root() {
        return this._node.root;
    }
    getValue(dataFieldName) {
        return this._node.values.get(dataFieldName);
    }
    get rows() {
        return this.node.rows;
    }
    get dataFieldSpecification() {
        return this._dfSpec;
    }
}
exports.PivotDataCellCalcContext = PivotDataCellCalcContext;
const getPivotDataCellCalcSumFn = (sourceField = null, filterFn = null) => {
    return (ctx) => {
        const rows = ((typeof (filterFn) === 'function') ? filterFn(ctx) : ctx.rows);
        const dfName = (sourceField || ctx.dataFieldSpecification.fieldName);
        let sum = 0;
        rows.forEach((r) => {
            const cell = r.cells.get(dfName);
            if (!cell) {
                return null;
            }
            const val = cell.value;
            if (typeof (val) !== 'number') {
                return;
            }
            sum += val;
        });
        return sum;
    };
};
exports.getPivotDataCellCalcSumFn = getPivotDataCellCalcSumFn;
class PivotDataAreaFieldSpec extends PivotAreaFieldSpecBase {
    constructor(fieldName, fn, specification) {
        super(fieldName, PivotArea.Data, specification);
        this._fn = fn;
    }
    get fn() {
        return this._fn;
    }
}
exports.PivotDataAreaFieldSpec = PivotDataAreaFieldSpec;
class PivotAreaFieldSpecBaseMap {
    constructor(specification) {
        this._specification = specification;
    }
    get specification() {
        return this._specification;
    }
    get size() {
        return this.inner.size;
    }
    get isEmpty() {
        return this.inner.isEmpty;
    }
    get values() {
        return this.inner.values;
    }
    get keys() {
        return this.inner.keys;
    }
    get(value) {
        return this.inner.get(value);
    }
    has(value) {
        return this.inner.has(value);
    }
    forEach(fn) {
        this.inner.forEach(fn);
    }
    filter(fn) {
        return this.inner.filter(fn);
    }
    map(fn) {
        return this.inner.map(fn);
    }
    any(keys) {
        return this.inner.any(keys);
    }
    indexOf(value) {
        return this.inner.indexOf(value);
    }
    equals(other) {
        return this.inner.equals(other);
    }
    toString() {
        return this.inner.toString();
    }
}
exports.PivotAreaFieldSpecBaseMap = PivotAreaFieldSpecBaseMap;
class PivotAreaFieldSpecMap extends PivotAreaFieldSpecBaseMap {
    constructor(specification) {
        super(specification);
        this._inner = new entity_1.IdentifiableMap();
    }
    get inner() {
        return this._inner;
    }
    set(specs) {
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
exports.PivotAreaFieldSpecMap = PivotAreaFieldSpecMap;
class PivotDataAreaFieldSpecMap extends PivotAreaFieldSpecBaseMap {
    constructor(specification) {
        super(specification);
        this._inner = new entity_1.IdentifiableMap();
    }
    get inner() {
        return this._inner;
    }
    set(specs) {
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
exports.PivotDataAreaFieldSpecMap = PivotDataAreaFieldSpecMap;
class PivotDataSpecification {
    constructor() {
        this._fields = new PivotAreaFieldSpecMap(this);
        this._dataFields = new PivotDataAreaFieldSpecMap(this);
    }
    get fields() {
        return this._fields;
    }
    get dataFields() {
        return this._dataFields;
    }
    get isValid() {
        return ((this.fields.size > 0) && (this.dataFields.size > 0));
    }
    clone() {
        return PivotDataSpecification.copyTo(this);
    }
    copy(source) {
        return PivotDataSpecification.copyTo(source, this);
    }
    static copyTo(source, target = new PivotDataSpecification()) {
        if (!source) {
            return (target || (new PivotDataSpecification()));
        }
        source.fields.forEach((spec) => {
            target.fields.set({ [spec.fieldName]: spec.area });
        });
        source.dataFields.forEach((spec) => {
            target.dataFields.set({ [spec.fieldName]: spec.fn });
        });
        return target;
    }
}
exports.PivotDataSpecification = PivotDataSpecification;
class PivotDataResult {
    constructor(root) {
        this._root = root;
    }
    get specification() {
        return this._root.specification;
    }
    get root() {
        return this._root;
    }
    get sourceData() {
        return this._root.sourceData;
    }
    get value() {
        return (this._value || (this._value = this._root.toTable()));
    }
}
exports.PivotDataResult = PivotDataResult;
class PivotDataCellUrl extends entity_1.Identifiable {
    constructor(parts, delmiter = PivotDataCellUrl.DefaultDelimiter) {
        super(PivotDataCellUrl.createValue(parts, delmiter));
        this._parts = (parts || []);
        this._delimiter = (delmiter || PivotDataCellUrl.DefaultDelimiter);
    }
    get parts() {
        return this._parts;
    }
    get delimiter() {
        return this._delimiter;
    }
    get isRoot() {
        return (this._parts.length === 0);
    }
    get value() {
        return this.id;
    }
    static create(parts, delimiter = PivotDataCellUrl.DefaultDelimiter) {
        return (new PivotDataCellUrl(parts, delimiter));
    }
    static createValue(parts, delimiter = PivotDataCellUrl.DefaultDelimiter) {
        const delim = (delimiter || PivotDataCellUrl.DefaultDelimiter);
        if (!parts || !parts.length) {
            return `${delim}root`;
        }
        const maxIndex = (parts.length - 1);
        let url = `${delim}root${delim}`;
        parts.forEach((v, index) => {
            url += v;
            if (index < maxIndex) {
                url += delim;
            }
        });
        return url;
    }
    toString() {
        return this.value;
    }
}
exports.PivotDataCellUrl = PivotDataCellUrl;
PivotDataCellUrl.Root = new PivotDataCellUrl([]);
PivotDataCellUrl.DefaultDelimiter = '/';
class PivotDataCellValues {
    constructor(node) {
        this._cached = {};
        this._node = node;
    }
    get(dataField) {
        const df = (dataField || '').trim();
        if (!df) {
            return null;
        }
        const dfSpec = this._node.specification.dataFields.get(dataField);
        if (!dfSpec) {
            console.error(`Invalid operation expection.  Failed to get calculated value for the specified field name of '${df}'.  The data field specification for that name does not exist [${JSON.stringify(dfSpec.specification.dataFields.map((f) => f.fieldName))}].`);
            return (this._cached[dfSpec.fieldName] = null);
        }
        const val = this._cached[dfSpec.fieldName];
        // Calculated or attempted before
        if ((val !== undefined) || (val === null)) {
            return val;
        }
        const fn = dfSpec.fn;
        if (!fn) {
            return (this._cached[dfSpec.fieldName] = null);
        }
        let result = null;
        try {
            result = fn(new PivotDataCellCalcContext(this._node, dfSpec));
        }
        catch (ex) {
            console.error(`Failed to get calculated value for the specified field name of '${df}'. ${ex}`);
        }
        return (this._cached[dfSpec.fieldName] = result);
    }
}
exports.PivotDataCellValues = PivotDataCellValues;
class PivotDataCell extends entity_1.Composite {
    constructor(url, specification, sourceData, rows = []) {
        super(url.value);
        this._url = url;
        this._rows = rows;
        this._specification = specification;
        this._isReadOnly = false;
        this._sourceData = sourceData;
    }
    get url() {
        return this._url;
    }
    get isReadOnly() {
        return (this._isReadOnly || this.url.isRoot);
    }
    get sourceData() {
        return this._sourceData;
    }
    get rows() {
        if (this._url.isRoot) {
            this._rows = this.sourceData.rows.values;
        }
        return this._rows;
    }
    get specification() {
        return this._specification;
    }
    setAsReadOnly() {
        this._isReadOnly = true;
        return this;
    }
    addRow(row) {
        if (this.isReadOnly) {
            throw new Error(`Invalid operation expection.  Failed to add row to ${this.url}.`);
        }
        this._rows.push(row);
        return this;
    }
    get values() {
        return (this._values || (this._values = new PivotDataCellValues(this)));
    }
    toTable() {
        const leafNodes = this.components.flatten('depth-first').filter((n) => n.isLeaf);
        const spec = this.specification;
        const rows = [];
        leafNodes.forEach((n) => {
            const row = {};
            spec.fields.forEach((f, index) => {
                row[f.fieldName] = n.url.parts[index];
            });
            spec.dataFields.forEach((f) => {
                row[f.fieldName] = n.values.get(f.fieldName);
            });
            rows.push(row);
        });
        const pk = spec.fields.map(f => f.fieldName);
        return DataTable.from(rows, pk);
    }
}
exports.PivotDataCell = PivotDataCell;
class PivotDataService {
    constructor() {
        this._specification = new PivotDataSpecification();
    }
    get specification() {
        return this._specification;
    }
    buildComposite(sourceData) {
        const spec = this.specification;
        const root = new PivotDataCell(PivotDataCellUrl.Root, spec, sourceData);
        const nodeMap = new Map();
        console.log(`creating composite structure from ${sourceData.rows.size} rows ...`);
        console.time(`composite`);
        sourceData.rows.forEach((row) => {
            const fvalues = [];
            let parent = root;
            spec.fields.forEach((f, level) => {
                let urlMap = (nodeMap.get(level));
                if (!urlMap) {
                    nodeMap.set(level, (urlMap = new Map()));
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
            });
        });
        console.log(`composite structure created from ${sourceData.rows.size} rows`);
        console.timeEnd(`composite`);
        return root;
    }
    execute(sourceData) {
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
exports.PivotDataService = PivotDataService;
//# sourceMappingURL=data.js.map