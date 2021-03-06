"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchAndPivotParameters = exports.SearchQueryAndPivotService = exports.SearchQueryAndPivotResult = exports.SearchSuggestionResultPage = exports.SearchSuggestionResult = exports.SearchResultPage = exports.SearchResult = exports.FacetResultMap = exports.FacetResult = exports.FacetResultValueMap = exports.FacetResultValue = exports.SearchSuggestionQueryParameters = exports.FieldMap = exports.FieldElement = exports.SearchQueryParameters = exports.SearchQueryParametersBase = exports.FacetMap = exports.Facet = exports.OrderElementMap = exports.OrderElementDesc = exports.OrderElementAsc = exports.OrderElement = exports.FilterMap = exports.SimpleFilter = exports.CompositeFilter = exports.Filter = exports.FilterOperator = exports.QueryType = exports.DialectType = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const _1 = require(".");
const delimiterReducer = (delimiter) => {
    return (accumulator, currentValue) => `${accumulator}${delimiter}${currentValue}`;
};
const andReducer = delimiterReducer(' and ');
const orReducer = delimiterReducer(' or ');
class DialectType extends _1.Enum {
    constructor(id, value) {
        super(DialectType.TypeName, id, value);
    }
    get isLuceneAzure() {
        return this.is(DialectType.LuceneAzure);
    }
    get isMango() {
        return this.is(DialectType.Mango);
    }
    static tryParse(keyOrValue) {
        return DialectType.attemptParse(DialectType.TypeName, keyOrValue);
    }
    static get size() {
        return DialectType.getSize(DialectType.TypeName);
    }
    static get random() {
        return DialectType.getRandom(DialectType.TypeName);
    }
    static get entries() {
        return DialectType.getEntries(DialectType.TypeName);
    }
    static get keys() {
        return DialectType.getKeys(DialectType.TypeName);
    }
    static get values() {
        return DialectType.getValues(DialectType.TypeName);
    }
    static forEach(fn) {
        DialectType.forEachOne(DialectType.TypeName, fn);
    }
}
exports.DialectType = DialectType;
DialectType.TypeName = 'DialectType';
DialectType.Null = new DialectType('0', 'null');
DialectType.LuceneAzure = new DialectType('1', 'lucene-azure');
DialectType.Mango = new DialectType('2', 'mango');
class QueryType extends _1.Enum {
    constructor(id, value) {
        super(QueryType.TypeName, id, value);
    }
    get isSimple() {
        return this.is(QueryType.Simple);
    }
    get isComplex() {
        return this.is(QueryType.Complex);
    }
    static tryParse(keyOrValue) {
        return QueryType.attemptParse(QueryType.TypeName, keyOrValue);
    }
    static get size() {
        return QueryType.getSize(QueryType.TypeName);
    }
    static get random() {
        return QueryType.getRandom(QueryType.TypeName);
    }
    static get entries() {
        return QueryType.getEntries(QueryType.TypeName);
    }
    static get keys() {
        return QueryType.getKeys(QueryType.TypeName);
    }
    static get values() {
        return QueryType.getValues(QueryType.TypeName);
    }
    static forEach(fn) {
        QueryType.forEachOne(QueryType.TypeName, fn);
    }
}
exports.QueryType = QueryType;
QueryType.TypeName = 'querytype';
QueryType.Null = new QueryType('0', 'null');
QueryType.Simple = new QueryType('1', 'simple');
QueryType.Complex = new QueryType('2', 'complex');
class FilterOperator extends _1.Enum {
    constructor(id, value) {
        super(FilterOperator.TypeName, id, value);
    }
    get isEqualTo() {
        return this.is(FilterOperator.Equal);
    }
    get isLessThan() {
        return this.is(FilterOperator.LessThan);
    }
    get isGreaterThan() {
        return this.is(FilterOperator.GreaterThan);
    }
    static tryParse(keyOrValue) {
        return FilterOperator.attemptParse(FilterOperator.TypeName, keyOrValue);
    }
    static get size() {
        return FilterOperator.getSize(FilterOperator.TypeName);
    }
    static get random() {
        return FilterOperator.getRandom(FilterOperator.TypeName);
    }
    static get entries() {
        return FilterOperator.getEntries(FilterOperator.TypeName);
    }
    static get keys() {
        return FilterOperator.getKeys(FilterOperator.TypeName);
    }
    static get values() {
        return FilterOperator.getValues(FilterOperator.TypeName);
    }
    static forEach(fn) {
        FilterOperator.forEachOne(FilterOperator.TypeName, fn);
    }
}
exports.FilterOperator = FilterOperator;
FilterOperator.TypeName = 'FilterOperator';
FilterOperator.Null = new FilterOperator('0', 'null');
FilterOperator.Equal = new FilterOperator('1', 'eq');
FilterOperator.LessThan = new FilterOperator('2', 'lt');
FilterOperator.GreaterThan = new FilterOperator('3', 'gt');
FilterOperator.NotEqual = new FilterOperator('4', 'ne');
class Filter extends _1.Identifiable {
}
exports.Filter = Filter;
Filter._instanceCounter = 0;
class CompositeFilter extends Filter {
    constructor(filters, operator = _1.AndOr.And) {
        super(`cf-${Filter._instanceCounter++}`);
        this._operator = _1.AndOr.And;
        this._filters = (filters || []);
        this._operator = (((typeof operator === 'string') ? _1.AndOr.tryParse(operator) : operator) || _1.AndOr.And);
    }
    get filters() {
        return (this._filters || []);
    }
    get operator() {
        return this._operator;
    }
    static to(filters, operator = _1.AndOr.And) {
        return (new CompositeFilter((filters || []), operator));
    }
    static map(nameValuePairs = {}, operator) {
        return CompositeFilter.to(SimpleFilter.map(nameValuePairs), operator);
    }
    static toAnd(filters) {
        return CompositeFilter.to(filters, 'and');
    }
    static mapAnd(nameValuePairs = {}) {
        return CompositeFilter.map(nameValuePairs, 'and');
    }
    static toOr(filters) {
        return CompositeFilter.to(filters, 'or');
    }
    static mapOr(nameValuePairs = {}) {
        return CompositeFilter.map(nameValuePairs, 'or');
    }
    toQueryExpression(dialect) {
        return this.onToQueryExpression(dialect);
    }
    onToQueryExpression(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toQueryExpressionLuceneAzure();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toQueryExpressionMango();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
    }
    toQueryExpressionLuceneAzure() {
        const reducer = ((_1.AndOr.And.value === this.operator.value) ? andReducer : orReducer);
        return `(${this.filters.map((f) => f.toQueryExpression(DialectType.LuceneAzure)).reduce(reducer)})`;
    }
    toQueryExpressionMango() {
        if (this.filters.length > 1) {
            return { [`$${this.operator.value}`]: this.filters.map((f) => f.toQueryExpression(DialectType.Mango)) };
        }
        if (this.filters.length === 1) {
            return this.filters[0].toQueryExpression(DialectType.Mango);
        }
        return {};
    }
}
exports.CompositeFilter = CompositeFilter;
class SimpleFilter extends Filter {
    constructor(fieldName, operator, value, displayName = null) {
        super(`sf-${Filter._instanceCounter++}`);
        this._fieldName = fieldName;
        this._displayName = displayName;
        this._operator = (((typeof operator === 'string') ? FilterOperator.tryParse(operator) : operator) || FilterOperator.Equal);
        this._value = value;
    }
    get fieldName() {
        return this._fieldName;
    }
    get operator() {
        return this._operator;
    }
    get value() {
        return this._value;
    }
    get displayName() {
        return (this._displayName || this._fieldName);
    }
    static map(nameValuePairs = {}, operator = FilterOperator.Equal) {
        const pairs = (nameValuePairs || {});
        return Object.keys(pairs).map((k) => {
            return (new SimpleFilter(k, operator, pairs[k]));
        });
    }
    toQueryExpression(dialect) {
        return this.onToQueryExpression(dialect);
    }
    onToQueryExpression(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toQueryExpressionLuceneAzure();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toQueryExpressionMango();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
    }
    toQueryExpressionLuceneAzure() {
        const val = ((typeof this.value === 'string') ? `'${this.value}'` : this.value);
        return `(${this.fieldName} ${this.operator.value} ${val})`;
    }
    toQueryExpressionMango() {
        const operator = `$${this.operator.value}`;
        return { [this.fieldName]: { [operator]: this.value } };
    }
}
exports.SimpleFilter = SimpleFilter;
class FilterMap extends _1.IdentifiableMap {
    constructor(entities) {
        super(entities);
        this._operator = _1.AndOr.And;
    }
    get operator() {
        return (this._operator || _1.AndOr.And);
    }
    set operator(andOr) {
        this._operator = andOr;
    }
    toJson(dialect) {
        return this.onToJson(dialect);
    }
    onToJson(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toJsonLuceneAzure();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toJsonMango();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
    }
    // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#bkmk_examples
    toJsonLuceneAzure() {
        if (this.isEmpty) {
            return '';
        }
        const reducer = ((_1.AndOr.And.value === this.operator.value) ? andReducer : orReducer);
        const val = `(${this.map((f) => f.toQueryExpression(DialectType.LuceneAzure)).reduce(reducer)})`;
        return val;
    }
    toJsonMango() {
        if (this.isEmpty) {
            return {};
        }
        if (this.size > 1) {
            return { [`$${this.operator.value}`]: this.map((f) => f.toQueryExpression(DialectType.Mango)) };
        }
        return this.get(0).toQueryExpression(DialectType.Mango);
    }
}
exports.FilterMap = FilterMap;
class OrderElement extends _1.Identifiable {
    constructor(fieldName, direction = _1.AscDesc.Asc) {
        super(fieldName);
        this._fieldName = fieldName;
        this._direction = (((typeof (direction) === 'string') ? _1.AscDesc.tryParse(direction) : direction) || _1.AscDesc.Asc);
    }
    get fieldName() {
        return this._fieldName;
    }
    get direction() {
        return this._direction;
    }
    static map(elements) {
        return Object.keys(elements || []).map((k) => new OrderElement(k, elements[k]));
    }
    toString() {
        return this.toExpression(DialectType.LuceneAzure);
    }
    toExpression(dialect) {
        return this.onToExpression(dialect);
    }
    onToExpression(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toExpressionLuceneAzure();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toExpressionMango();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
    }
    toExpressionLuceneAzure() {
        return `${this.fieldName} ${this.direction}`;
    }
    toExpressionMango() {
        return { [this.fieldName]: this.direction.toString() };
    }
}
exports.OrderElement = OrderElement;
class OrderElementAsc extends OrderElement {
    constructor(fieldName) {
        super(fieldName, _1.AscDesc.Asc);
    }
}
exports.OrderElementAsc = OrderElementAsc;
class OrderElementDesc extends OrderElement {
    constructor(fieldName) {
        super(fieldName, _1.AscDesc.Desc);
    }
    static get searchScore() {
        // https://docs.microsoft.com/en-us/azure/search/search-query-odata-orderby#examples
        return (OrderElementDesc._score || (OrderElementDesc._score = (new OrderElementDesc('search.score()'))));
    }
}
exports.OrderElementDesc = OrderElementDesc;
class OrderElementMap extends _1.IdentifiableMap {
    constructor(entities) {
        super(entities);
    }
    setSearchScore() {
        this.set(OrderElementDesc.searchScore);
        return this;
    }
    mapAndSet(elements) {
        return this.set(OrderElement.map(elements));
    }
    toJson(dialect) {
        return this.onToJson(dialect);
    }
    onToJson(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toJsonLuceneAzure();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toJsonMango();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
    }
    toJsonLuceneAzure() {
        if (this.isEmpty) {
            return '';
        }
        // https://docs.microsoft.com/en-us/azure/search/search-query-odata-orderby
        const expression = this.map((f) => f.toString()).reduce(OrderElementMap.reducer);
        return (expression.endsWith(',') ? expression.substring(0, (expression.length - 1)) : expression);
    }
    toJsonMango() {
        return this.map((v) => v.toExpression(DialectType.Mango));
    }
}
exports.OrderElementMap = OrderElementMap;
OrderElementMap.reducer = delimiterReducer(',');
class Facet extends _1.Identifiable {
    constructor(fieldName, displayName = null, optionsExpression = '') {
        super(fieldName);
        this._fieldName = fieldName;
        this._displayName = displayName;
        this._optionsExpression = (optionsExpression || '');
    }
    get fieldName() {
        return this._fieldName;
    }
    get displayName() {
        return (this._displayName || this._fieldName);
    }
    // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#facetstring-zero-or-more
    get optionsExpression() {
        return (this._optionsExpression || '');
    }
    toString() {
        if (!this.optionsExpression) {
            return this.fieldName;
        }
        return `${this.fieldName},${this.optionsExpression}`;
    }
}
exports.Facet = Facet;
class FacetMap extends _1.IdentifiableMap {
    constructor(entities) {
        super(entities);
    }
    toJson() {
        return this.map((f) => f.toString());
    }
}
exports.FacetMap = FacetMap;
class SearchQueryParametersBase extends _1.EntityQueryParameters {
    constructor(searchString, pageNumber, pageSize) {
        super(pageNumber, pageSize, searchString);
        this._searchFields = new FieldMap();
        this._selectFields = new FieldMap();
    }
    get searchFields() {
        return this._searchFields;
    }
    get selectFields() {
        return this._selectFields;
    }
}
exports.SearchQueryParametersBase = SearchQueryParametersBase;
class SearchQueryParameters extends SearchQueryParametersBase {
    constructor(indexName, searchString, skip = 0, pageNumber, pageSize) {
        super(searchString, pageNumber, pageSize);
        this._facets = new FacetMap();
        this._filters = new FilterMap();
        this._orderElements = new OrderElementMap();
        this._queryType = QueryType.Simple;
        this._showCount = true;
        this._indexName = indexName;
        this._skip = skip;
    }
    get isAllSearch() {
        return (this.searchString === '*');
    }
    get indexName() {
        return this._indexName;
    }
    get facets() {
        return this._facets;
    }
    get filters() {
        return this._filters;
    }
    get orderBy() {
        return this._orderElements;
    }
    get queryType() {
        return (this._queryType || QueryType.Null);
    }
    set queryType(value) {
        this._queryType = (value || QueryType.Null);
    }
    get count() {
        return this._showCount;
    }
    set count(value) {
        this._showCount = value;
    }
    get skip() {
        return (((!this._skip) || (this._skip < 0)) ? 0 : this._skip);
    }
    set skip(value) {
        this._skip = (value || 0);
    }
    get page() {
        if ((this._skip) < 0) {
            return null;
        }
        return ((this.skip / this.pageSize) + 1);
    }
    copy() {
        return SearchQueryParameters.copyOther(this);
    }
    static copyOther(source) {
        const copy = new SearchQueryParameters(source.indexName, source.searchString, source.skip, source.pageNumber, source.pageSize);
        copy.searchFields.set(source.searchFields.values);
        copy.filters.set(source.filters.values);
        copy.facets.set(source.facets.values);
        copy.orderBy.set(source.orderBy.values);
        copy.queryType = source.queryType;
        return copy;
    }
    toJson(dialect = DialectType.LuceneAzure) {
        return this.onToJson(dialect);
    }
    onToJson(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toLuceneAzureJson();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toMangoJson();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
    }
    // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#bkmk_examples
    toLuceneAzureJson() {
        const dialect = DialectType.LuceneAzure;
        const json = {
            queryType: this.queryType.toString(),
            search: this.searchString,
            filter: this.filters.toJson(dialect),
            facets: this.facets.toJson(),
            orderby: this.orderBy.toJson(dialect),
            top: this.pageSize,
            count: this.count,
            skip: this.skip,
        };
        if (this.facets.isEmpty) {
            delete json['factets'];
        }
        if (this.filters.isEmpty) {
            delete json['filters'];
        }
        if (this.orderBy.isEmpty) {
            delete json['orderby'];
        }
        return json;
    }
    // https://github.com/pouchdb/pouchdb/blob/7532eb30f514d37b94f829ed22e70da7f3c1ed3a/tests/find/test-suite-1/test.eq.js
    toMangoJson() {
        const dialect = DialectType.Mango;
        const json = {
            query: {
                use_index: this.indexName,
                selector: this.filters.toJson(dialect),
                fields: this.selectFields.toJson(dialect),
                sort: this.orderBy.toJson(dialect),
            },
            index: null
        };
        delete json.query['use_index'];
        if (this.selectFields.isEmpty) {
            delete json.query['fields'];
        }
        if (this.selectFields.size > 1) {
            let index = json['index'] = {};
            index['fields'] = this.selectFields.map((s) => s.physicalName);
            index['type'] = 'json';
        }
        if (this.orderBy.isEmpty) {
            delete json.query['sort'];
        }
        return json;
    }
}
exports.SearchQueryParameters = SearchQueryParameters;
class FieldElement extends _1.Identifiable {
    constructor(physicalName, displayName = null) {
        super(physicalName);
        this._displayName = (displayName || physicalName);
    }
    get physicalName() {
        return this.id;
    }
    get displayName() {
        return this._displayName;
    }
    static map(physicalNames) {
        let names = [];
        if (typeof physicalNames === 'string') {
            names.push(physicalNames);
        }
        if (Array.isArray(physicalNames)) {
            names = [...physicalNames];
        }
        return (names || []).map((s) => new FieldElement(s));
    }
}
exports.FieldElement = FieldElement;
class FieldMap extends _1.IdentifiableMap {
    constructor(entities) {
        super(FieldMap.tryConvert(entities));
    }
    static tryConvertOne(element) {
        return ((typeof element === 'string') ? new FieldElement(element) : element);
    }
    static tryConvert(elements) {
        if (!Array.isArray(elements)) {
            return [FieldMap.tryConvertOne(elements)];
        }
        return elements.map(FieldMap.tryConvertOne);
    }
    mapAndSet(fields) {
        return this.set(FieldElement.map(fields));
    }
    toJson(dialect) {
        return this.onToJson(dialect);
    }
    onToJson(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toLuceneAzureJson();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toMangoJson();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
    }
    toLuceneAzureJson() {
        if (this.isEmpty) {
            return '';
        }
        const expression = this.map((f) => f.physicalName).reduce(FieldMap.reducer);
        return (expression.endsWith(',') ? expression.substring(0, (expression.length - 1)) : expression);
    }
    toMangoJson() {
        if (this.isEmpty) {
            return [];
        }
        return this.map((f) => f.physicalName);
    }
}
exports.FieldMap = FieldMap;
FieldMap.reducer = (accumulator, currentValue) => `${accumulator},${currentValue}`;
class SearchSuggestionQueryParameters extends SearchQueryParametersBase {
    constructor(indexName, suggesterName, searchString, searchFields = [], selectFields = [], pageSize = 5) {
        super(searchString, 0, pageSize);
        this._filters = new FilterMap();
        this._orderElements = new OrderElementMap();
        this._useFuzzySearch = true;
        this._indexName = indexName;
        this._suggesterName = suggesterName;
        this.searchFields.set(FieldElement.map(searchFields));
        this.selectFields.set(FieldElement.map(selectFields));
    }
    get indexName() {
        return this._indexName;
    }
    get suggesterName() {
        return this._suggesterName;
    }
    get filters() {
        return this._filters;
    }
    get orderBy() {
        return this._orderElements;
    }
    get useFuzzySearch() {
        return (this._useFuzzySearch || false);
    }
    set useFuzzySearch(value) {
        this._useFuzzySearch = (value || false);
    }
    toJson(dialect = DialectType.LuceneAzure) {
        return this.onToJson(dialect);
    }
    onToJson(dialect) {
        if (DialectType.LuceneAzure.is(dialect)) {
            return this.toLuceneAzureJson();
        }
        if (DialectType.Mango.is(dialect)) {
            return this.toMangoJson();
        }
        throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
    }
    // https://docs.microsoft.com/en-us/rest/api/searchservice/suggestions#query-parameters
    toLuceneAzureJson() {
        const dialect = DialectType.LuceneAzure;
        const json = {
            suggesterName: this.suggesterName,
            search: this.searchString,
            select: this.selectFields.toJson(dialect),
            searchFields: this.searchFields.toJson(dialect),
            filter: this.filters.toJson(dialect),
            orderby: this.orderBy.toJson(dialect),
            top: this.pageSize,
            fuzzy: this.useFuzzySearch,
        };
        if (this.filters.isEmpty) {
            delete json['filters'];
        }
        if (this.orderBy.isEmpty) {
            delete json['orderby'];
        }
        if (this.selectFields.isEmpty) {
            delete json['select'];
        }
        if (this.searchFields.isEmpty) {
            delete json['searchFields'];
        }
        return json;
    }
    toMangoJson() {
        const json = {};
        return json;
    }
}
exports.SearchSuggestionQueryParameters = SearchSuggestionQueryParameters;
class FacetResultValue extends _1.Identifiable {
    constructor(value, count) {
        super(value.toString());
        this._value = value;
        this._count = count;
    }
    get count() {
        return this._count;
    }
    get value() {
        return this._value;
    }
    get facet() {
        return ((this._result) ? this.result.facet : null);
    }
    get result() {
        return this._result;
    }
    set result(value) {
        if (this._result) {
            throw new Error('Failed to set result property.  Its already been set.');
        }
        this._result = value;
    }
    get equalityFilter() {
        return new SimpleFilter(this.facet.fieldName, FilterOperator.Equal, this.value);
    }
    toString() {
        return `value:=${this.value},count:=${this.count}`;
    }
}
exports.FacetResultValue = FacetResultValue;
class FacetResultValueMap extends _1.IdentifiableMap {
    constructor(result, entities) {
        super(entities);
        this._result = result;
        this.forEach((e) => {
            e.result = result;
        });
    }
    get result() {
        return this._result;
    }
    toString() {
        return this.result.toString();
    }
}
exports.FacetResultValueMap = FacetResultValueMap;
class FacetResult extends _1.Identifiable {
    constructor(facet, values) {
        super(facet.id);
        this._facet = facet;
        this._values = new FacetResultValueMap(this, values);
    }
    get facet() {
        return this._facet;
    }
    get values() {
        return this._values;
    }
    toString() {
        return `facet:=${this.facet},count:=${this.values.size}`;
    }
}
exports.FacetResult = FacetResult;
class FacetResultMap extends _1.IdentifiableMap {
    constructor(entities = null) {
        super(entities);
    }
}
exports.FacetResultMap = FacetResultMap;
class SearchResult {
    constructor(data, facetData = null) {
        this._data = (data || _1.DataTable.Empty);
        this._facetData = (facetData || new FacetResultMap());
    }
    get data() {
        return this._data;
    }
    get facetData() {
        return this._facetData;
    }
    static toDataTable(results) {
        console.log(`merging data tables ... [count:=${results.length}]`);
        let expectedSize = 0;
        // extract tables from results
        const tables = results.map((r) => {
            expectedSize += r.data.rows.size;
            return r.data;
        });
        // merge datatables
        const merged = _1.DataTable.merge(tables);
        console.log(`data tables merged! [expected:=${expectedSize}, actual:=${merged.rows.size}]`);
        return merged;
    }
}
exports.SearchResult = SearchResult;
class SearchResultPage extends _1.EntityQueryPage {
    constructor(searchParameters, value, totalRows = null, executionDuration = null) {
        super(searchParameters, value, totalRows, '', '', executionDuration);
    }
    get totalPages() {
        const pageSize = (this.totalRows / this.queryParameters.pageSize);
        return Math.ceil(pageSize);
    }
    get queryParameters() {
        return super.queryParameters;
    }
    static toDataTable(results) {
        return SearchResult.toDataTable(results.map((r) => r.value));
    }
}
exports.SearchResultPage = SearchResultPage;
class SearchSuggestionResult {
    constructor(data) {
        this._data = (data || _1.DataTable.Empty);
    }
    get data() {
        return this._data;
    }
}
exports.SearchSuggestionResult = SearchSuggestionResult;
class SearchSuggestionResultPage extends _1.EntityQueryPage {
    constructor(searchParameters, value, executionDuration = null) {
        super(searchParameters, value, 0, '', '', executionDuration);
    }
    get queryParameters() {
        return super.queryParameters;
    }
}
exports.SearchSuggestionResultPage = SearchSuggestionResultPage;
class SearchQueryAndPivotResult {
    constructor(sqp, spec = null) {
        this._sqp = sqp;
        this._spec = spec;
    }
    get searchResult() {
        return this._sqp;
    }
    get pivotDataResult() {
        if (this._pdResult) {
            return this._pdResult;
        }
        if ((!this._spec) || (!this._spec.isValid)) {
            console.error(`Failed to get pivot data result as there was no valid pivot data specification (PivotDataSpecification) provided.`);
            return null;
        }
        const service = new _1.PivotDataService();
        service.specification.copy(this._spec);
        return (this._pdResult = service.execute(this._sqp.value.data));
    }
}
exports.SearchQueryAndPivotResult = SearchQueryAndPivotResult;
class SearchQueryAndPivotService {
    get(sqp, spec = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sr = (yield this.onGetSearchResult(sqp));
            return ((sr) ? (new SearchQueryAndPivotResult(sr, spec)) : null);
        });
    }
}
exports.SearchQueryAndPivotService = SearchQueryAndPivotService;
class SearchAndPivotParameters {
    constructor(searchParams, pds = null) {
        this._searchParams = searchParams;
        this._pds = (pds || null);
    }
    get searchParams() {
        return this._searchParams;
    }
    get pivotSpecification() {
        return this._pds;
    }
}
exports.SearchAndPivotParameters = SearchAndPivotParameters;
//# sourceMappingURL=search.js.map