/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AndOr, AscDesc, AscDescCode, Enum, EntityQueryPage, EntityQueryParameters, Identifiable, IdentifiableMap, DataTable } from '.';

const delimiterReducer = (delimiter: string) => {
  return (accumulator, currentValue) => `${accumulator}${delimiter}${currentValue}`;
}

const andReducer = delimiterReducer(' and ');
const orReducer = delimiterReducer(' or ');

export type DialectTypeCode = ('null' | 'lucene-azure' | 'mango');

export class DialectType extends Enum<DialectType> {
  private static readonly TypeName = 'DialectType';
  public static readonly Null = new DialectType('0', 'null');
  public static readonly LuceneAzure = new DialectType('1', 'lucene-azure');
  public static readonly Mango = new DialectType('2', 'mango');

  private constructor(id: string, value: DialectTypeCode) {
    super(DialectType.TypeName, id, value);
  }

  public get isLuceneAzure(): boolean {
    return this.is(DialectType.LuceneAzure);
  }

  public get isMango(): boolean {
    return this.is(DialectType.Mango);
  }

  public static tryParse(keyOrValue: (string | DialectTypeCode)): DialectType {
    return (DialectType.attemptParse(DialectType.TypeName, keyOrValue) as DialectType);
  }

  public static get size(): number {
    return DialectType.getSize(DialectType.TypeName);
  }

  public static get random(): DialectType {
    return (DialectType.getRandom(DialectType.TypeName) as DialectType);
  }

  public static get entries(): DialectType[] {
    return (DialectType.getEntries(DialectType.TypeName) as DialectType[]);
  }

  public static get keys(): string[] {
    return DialectType.getKeys(DialectType.TypeName);
  }

  public static get values(): DialectTypeCode[] {
    return (DialectType.getValues(DialectType.TypeName) as DialectTypeCode[]);
  }

  public static forEach(fn: (value: DialectType, index: number) => void): void {
    DialectType.forEachOne(DialectType.TypeName, fn);
  }
}

export type QueryTypeCode = ('null' | 'simple' | 'complex');

export class QueryType extends Enum<QueryType> {
  private static readonly TypeName = 'querytype';
  public static readonly Null = new QueryType('0', 'null');
  public static readonly Simple = new QueryType('1', 'simple');
  public static readonly Complex = new QueryType('2', 'complex');

  private constructor(id: string, value: QueryTypeCode) {
    super(QueryType.TypeName, id, value);
  }

  public get isSimple(): boolean {
    return this.is(QueryType.Simple);
  }

  public get isComplex(): boolean {
    return this.is(QueryType.Complex);
  }

  public static tryParse(keyOrValue: (string | QueryTypeCode)): QueryType {
    return (QueryType.attemptParse(QueryType.TypeName, keyOrValue) as QueryType);
  }

  public static get size(): number {
    return QueryType.getSize(QueryType.TypeName);
  }

  public static get random(): QueryType {
    return (QueryType.getRandom(QueryType.TypeName) as QueryType);
  }

  public static get entries(): QueryType[] {
    return (QueryType.getEntries(QueryType.TypeName) as QueryType[]);
  }

  public static get keys(): string[] {
    return QueryType.getKeys(QueryType.TypeName);
  }

  public static get values(): QueryTypeCode[] {
    return (QueryType.getValues(QueryType.TypeName) as QueryTypeCode[]);
  }

  public static forEach(fn: (value: QueryType, index: number) => void): void {
    QueryType.forEachOne(QueryType.TypeName, fn);
  }
}

export type FilterOperatorCode = ('null' | 'eq' | 'lt' | 'gt' | 'ne');

export class FilterOperator extends Enum<FilterOperator> {
  private static readonly TypeName = 'FilterOperator';
  public static readonly Null = new FilterOperator('0', 'null');
  public static readonly Equal = new FilterOperator('1', 'eq');
  public static readonly LessThan = new FilterOperator('2', 'lt');
  public static readonly GreaterThan = new FilterOperator('3', 'gt');
  public static readonly NotEqual = new FilterOperator('4', 'ne');

  private constructor(id: string, value: FilterOperatorCode) {
    super(FilterOperator.TypeName, id, value);
  }

  public get isEqualTo(): boolean {
    return this.is(FilterOperator.Equal);
  }

  public get isLessThan(): boolean {
    return this.is(FilterOperator.LessThan);
  }

  public get isGreaterThan(): boolean {
    return this.is(FilterOperator.GreaterThan);
  }

  public static tryParse(keyOrValue: (string | QueryTypeCode)): FilterOperator {
    return (FilterOperator.attemptParse(FilterOperator.TypeName, keyOrValue) as FilterOperator);
  }

  public static get size(): number {
    return FilterOperator.getSize(FilterOperator.TypeName);
  }

  public static get random(): FilterOperator {
    return (FilterOperator.getRandom(FilterOperator.TypeName) as FilterOperator);
  }

  public static get entries(): FilterOperator[] {
    return (FilterOperator.getEntries(FilterOperator.TypeName) as FilterOperator[]);
  }

  public static get keys(): string[] {
    return FilterOperator.getKeys(FilterOperator.TypeName);
  }

  public static get values(): FilterOperatorCode[] {
    return (FilterOperator.getValues(FilterOperator.TypeName) as FilterOperatorCode[]);
  }

  public static forEach(fn: (value: FilterOperator, index: number) => void): void {
    FilterOperator.forEachOne(FilterOperator.TypeName, fn);
  }
}

export abstract class Filter extends Identifiable {
  protected static _instanceCounter: number = 0;
  public abstract toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
}

export class CompositeFilter extends Filter {
  private readonly _filters: Filter[];
  private readonly _operator: AndOr = AndOr.And;

  constructor(filters: Filter[], operator: AndOr = AndOr.And) {
    super(`cf-${Filter._instanceCounter++}`);
    this._filters = (filters || []);
    this._operator = operator;
  }

  public get filters(): Filter[] {
    return (this._filters || []);
  }

  public get operator(): AndOr {
    return this._operator;
  }

  public toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    return this.onToQueryExpression(dialect);
  }

  protected onToQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toQueryExpressionLuceneAzure();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toQueryExpressionMango();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
  }

  protected toQueryExpressionLuceneAzure(): string {
    const reducer = ((AndOr.And.value === this.operator.value) ? andReducer : orReducer);
    return `(${this.filters.map((f) => f.toQueryExpression(DialectType.LuceneAzure)).reduce(reducer)})`;
  }

  protected toQueryExpressionMango(): any {
    if (this.filters.length > 1) {
      return { [`$${this.operator.value}`]: this.filters.map((f) => f.toQueryExpression(DialectType.Mango)) };
    }

    if (this.filters.length === 1) {
      return this.filters[0].toQueryExpression(DialectType.Mango);
    }

    return {};
  }
}

export class SimpleFilter extends Filter {
  private readonly _fieldName: string;
  private readonly _operator: FilterOperator;
  private readonly _displayName: string;
  private readonly _value: any;

  constructor(fieldName: string, operator: (FilterOperator | FilterOperatorCode), value: any, displayName: string = null) {
    super(`sf-${Filter._instanceCounter++}`);
    this._fieldName = fieldName;
    this._displayName = displayName;
    this._operator = (((typeof operator === 'string') ? FilterOperator.tryParse(operator) : operator) || FilterOperator.Equal);
    this._value = value;
  }

  public get fieldName(): string {
    return this._fieldName;
  }

  public get operator(): FilterOperator {
    return this._operator;
  }

  public get value(): any {
    return this._value;
  }

  public get displayName(): string {
    return (this._displayName || this._fieldName);
  }

  public toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    return this.onToQueryExpression(dialect);
  }

  protected onToQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toQueryExpressionLuceneAzure();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toQueryExpressionMango();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
  }

  protected toQueryExpressionLuceneAzure(): string {
    const val = ((typeof this.value === 'string') ? `'${this.value}'` : this.value);
    return `(${this.fieldName} ${this.operator.value} ${val})`;
  }

  protected toQueryExpressionMango(): any {
    const operator = `$${this.operator.value}`;
    return { [this.fieldName]: {[operator]: this.value }};
  }
}

export class FilterMap extends IdentifiableMap<Filter> {
  private _operator: AndOr = AndOr.And;

  constructor(entities?: (Filter | Filter[])) {
    super(entities);
  }

  public get operator(): AndOr {
    return (this._operator || AndOr.And);
  }

  public set operator(andOr: AndOr) {
    this._operator = andOr;
  }
  
  public toJson(dialect: (DialectType | DialectTypeCode | string)): string {
    return this.onToJson(dialect);
  }

  protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toJsonLuceneAzure();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toJsonMango();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
  }

  // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#bkmk_examples
  protected toJsonLuceneAzure(): string {
    if (this.isEmpty) {
      return '';
    }

    const reducer = ((AndOr.And.value === this.operator.value) ? andReducer : orReducer);
    const val = `(${this.map((f) => f.toQueryExpression(DialectType.LuceneAzure)).reduce(reducer)})`;

    return val;
  }

  protected toJsonMango(): any {
    if (this.isEmpty) {
      return {};
    }

    if (this.size > 1) {
      return { [`$${this.operator.value}`]: this.map((f) => f.toQueryExpression(DialectType.Mango)) };
    }

    return this.get(0).toQueryExpression(DialectType.Mango);
  }
}

export class OrderElement extends Identifiable {
  private readonly _fieldName: string;
  private readonly _direction: AscDesc;

  constructor(fieldName: string, direction: (AscDesc | AscDescCode) = AscDesc.Asc) {
    super(fieldName);
    this._fieldName = fieldName;
    this._direction = (((typeof(direction) === 'string') ? AscDesc.tryParse(direction) : direction) || AscDesc.Asc);
  }

  public get fieldName(): string {
    return this._fieldName;
  }

  public get direction(): AscDesc {
    return this._direction;
  }

  public toString(): string {
    return this.toExpression(DialectType.LuceneAzure);
  }

  public toExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    return this.onToExpression(dialect);
  }

  protected onToExpression(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toExpressionLuceneAzure();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toExpressionMango();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
  }

  protected toExpressionLuceneAzure(): string {
    return `${this.fieldName} ${this.direction}`;
  }

  protected toExpressionMango(): any {
    return { [this.fieldName]: this.direction.toString() };
  }
}

export class OrderElementAsc extends OrderElement {
  constructor(fieldName: string) {
    super(fieldName, AscDesc.Asc);
  }
}

export class OrderElementDesc extends OrderElement {
  private static _score;

  constructor(fieldName: string) {
    super(fieldName, AscDesc.Desc);
  }

  public static get searchScore(): OrderElement {
    // https://docs.microsoft.com/en-us/azure/search/search-query-odata-orderby#examples
    return (OrderElementDesc._score || (OrderElementDesc._score = (new OrderElementDesc('search.score()'))));
  }
}

export class OrderElementMap extends IdentifiableMap<OrderElement> {
  private static readonly reducer =  delimiterReducer(',');

  constructor(entities?: (OrderElement | OrderElement[])) {
    super(entities);
  }

  public setSearchScore(): OrderElementMap {
    this.set(OrderElementDesc.searchScore);
    return this;
  }

  public toJson(dialect: (DialectType | DialectTypeCode | string)): any {
    return this.onToJson(dialect);
  }

  protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toJsonLuceneAzure();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toJsonMango();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported.`);
  }

  protected toJsonLuceneAzure(): string {
    if (this.isEmpty) {
      return '';
    }

    // https://docs.microsoft.com/en-us/azure/search/search-query-odata-orderby
    const expression: string =  this.map((f) => f.toString()).reduce(OrderElementMap.reducer);
    return (expression.endsWith(',') ? expression.substring(0, (expression.length - 1)) : expression);
  }

  protected toJsonMango(): any {
    return this.map((v) => v.toExpression(DialectType.Mango));
  }
}

export class Facet extends Identifiable {
  private readonly _fieldName: string;
  private readonly _displayName: string;
  private readonly _optionsExpression: string;

  constructor(fieldName: string, displayName: string = null, optionsExpression = '') {
    super(fieldName);
    this._fieldName = fieldName;
    this._displayName = displayName;
    this._optionsExpression = (optionsExpression || '');
  }

  public get fieldName(): string {
    return this._fieldName;
  }

  public get displayName(): string {
    return (this._displayName || this._fieldName);
  }

  // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#facetstring-zero-or-more
  public get optionsExpression(): string {
    return (this._optionsExpression || '');
  }

  public toString(): string {
    if (!this.optionsExpression) {
      return this.fieldName;
    }

    return `${this.fieldName},${this.optionsExpression}`;
  }
}

export class FacetMap extends IdentifiableMap<Facet> {
  constructor(entities?: (Facet | Facet[])) {
    super(entities);
  }

  public toJson(): string[] {
    return this.map((f) => f.toString());
  }
}

export class SearchQueryParametersBase extends EntityQueryParameters {
  private _searchFields: FieldMap;
  private _selectFields: FieldMap;

  constructor(searchString: string, pageNumber: number, pageSize: number) {
    super(pageNumber, pageSize, searchString);

    this._searchFields = new FieldMap();
    this._selectFields = new FieldMap();
  }

  public get searchFields(): FieldMap {
    return this._searchFields;
  }

  public get selectFields(): FieldMap {
    return this._selectFields;
  }
}

export class SearchQueryParameters extends SearchQueryParametersBase {
  private readonly _facets = new FacetMap();
  private readonly _filters = new FilterMap();
  private readonly _orderElements = new OrderElementMap();
  private _indexName: string;
  private _queryType = QueryType.Simple;
  private _showCount = true;
  private _skip;

  constructor(indexName: string, searchString: string, skip = 0, pageNumber: number, pageSize: number) {
    super(searchString, pageNumber, pageSize);
    this._indexName = indexName;
    this._skip = skip;
  }

  public get isAllSearch(): boolean {
    return (this.searchString === '*');
  }

  public get indexName(): string {
    return this._indexName;
  }

  public get facets(): FacetMap {
    return this._facets;
  }

  public get filters(): FilterMap {
    return this._filters;
  }

  public get orderBy(): OrderElementMap {
    return this._orderElements;
  }

  public get queryType(): QueryType {
    return (this._queryType || QueryType.Null);
  }

  public set queryType(value: QueryType) {
    this._queryType = (value || QueryType.Null);
  }

  public get count(): boolean {
    return this._showCount;
  }

  public set count(value: boolean) {
    this._showCount = value;
  }

  public get skip(): number {
    return (((!this._skip) || (this._skip < 0)) ? 0 : this._skip);
  }

  public set skip(value: number) {
    this._skip = (value || 0);
  }

  public get page(): number {
    if ((this._skip) < 0) {
      return null;
    }

    return ((this.skip / this.pageSize) + 1);
  }
  
  public toJson(dialect: (DialectType | DialectTypeCode | string) = DialectType.LuceneAzure): any {
    return this.onToJson(dialect);
  }

  protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toLuceneAzureJson();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toMangoJson();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
  }

  // https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents#bkmk_examples
  protected toLuceneAzureJson(): any {
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
    }

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
  protected toMangoJson(): any {
    const dialect = DialectType.Mango;

    const json = {
      selector: this.filters.toJson(dialect),
      fields: this.selectFields.toJson(dialect),
      sort: this.orderBy.toJson(dialect),
    };

    return json;
  }
}

export class FieldElement extends Identifiable {
  private readonly _displayName: string;

  constructor(physicalName: string, displayName: string = null) {
    super(physicalName);
    this._displayName = (displayName || physicalName);
  }

  public get physicalName(): string {
    return this.id;
  }

  public get displayName(): string {
    return this._displayName;
  }

  public static from(physicalNames: string[]): FieldElement[] {
    return (physicalNames || []).map((s) => new FieldElement(s));
  }
}

export class FieldMap extends IdentifiableMap<FieldElement> {
  private static readonly reducer = (accumulator, currentValue) => `${accumulator},${currentValue}`;

  constructor(entities?: (string | string[])) {
    super(FieldMap.tryConvert(entities));
  }

  private static tryConvertOne(element: (FieldElement | string)): FieldElement {
    return ((typeof element === 'string') ? new FieldElement(element) : element);
  }

  private static tryConvert(elements: (FieldElement | FieldElement[] | string | string[])): FieldElement[] {
    if (!Array.isArray(elements)) {
      return [FieldMap.tryConvertOne(elements)]
    }

    return (elements as []).map(FieldMap.tryConvertOne);
  }

  public toJson(dialect: (DialectType | DialectTypeCode | string)): any {
    return this.onToJson(dialect);
  }

  protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toLuceneAzureJson();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toMangoJson();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
  }

  protected toLuceneAzureJson(): any {
    if (this.isEmpty) {
      return '';
    }

    const expression: string =  this.map((f) => f.physicalName).reduce(FieldMap.reducer);
    return (expression.endsWith(',') ? expression.substring(0, (expression.length - 1)) : expression);
  }

  protected toMangoJson(): any {
    if (this.isEmpty) {
      return [];
    }

    return this.map((f) => f.physicalName);
  }
}

export class SearchSuggestionQueryParameters extends SearchQueryParametersBase {
  private readonly _filters = new FilterMap();
  private readonly _orderElements = new OrderElementMap();
  private _indexName: string;
  private _suggesterName: string;
  private _useFuzzySearch = true;

  constructor(indexName: string, suggesterName: string, searchString: string, searchFields: string[] = [], selectFields: string[] = [], pageSize = 5) {
    super(searchString, 0, pageSize);
    this._indexName = indexName;
    this._suggesterName = suggesterName;
    this.searchFields.set(FieldElement.from(searchFields));
    this.selectFields.set(FieldElement.from(selectFields));
  }

  public get indexName(): string {
    return this._indexName;
  }

  public get suggesterName(): string {
    return this._suggesterName;
  }

  public get filters(): FilterMap {
    return this._filters;
  }

  public get orderBy(): OrderElementMap {
    return this._orderElements;
  }

  public get useFuzzySearch(): boolean {
    return (this._useFuzzySearch || false);
  }

  public set useFuzzySearch(value: boolean) {
    this._useFuzzySearch = (value || false);
  }
  
  public toJson(dialect: (DialectType | DialectTypeCode | string) = DialectType.LuceneAzure): any {
    return this.onToJson(dialect);
  }

  protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any {
    if (DialectType.LuceneAzure.is(dialect)) {
      return this.toLuceneAzureJson();
    }

    if (DialectType.Mango.is(dialect)) {
      return this.toMangoJson();
    }

    throw new Error(`The specified dialect [${dialect || 'null'}] is not supported by default.`);
  }

  // https://docs.microsoft.com/en-us/rest/api/searchservice/suggestions#query-parameters
  protected toLuceneAzureJson(): any {
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
    }

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

  protected toMangoJson(): any {
    const json = {
    };

    return json;
  }
}

export class FacetResultValue extends Identifiable {
  private readonly _value: any;
  private readonly _count: number;
  private _result: FacetResult;

  constructor(value: any, count: number) {
    super(value.toString());
    this._value = value;
    this._count = count;
  }

  public get count(): number {
    return this._count;
  }

  public get value(): any {
    return this._value;
  }

  public get facet(): Facet {
    return ((this._result) ? this.result.facet : null);
  }

  public get result(): FacetResult {
    return this._result;
  }

  public set result(value: FacetResult) {
    if (this._result) {
      throw new Error('Failed to set result property.  Its already been set.');
    }

    this._result = value;
  }

  public get equalityFilter(): Filter {
    return new SimpleFilter(this.facet.fieldName, FilterOperator.Equal, this.value); 
  }

  public toString(): string {
    return `value:=${this.value},count:=${this.count}`;
  }
}

export class FacetResultValueMap extends IdentifiableMap<FacetResultValue> {
  private readonly _result: FacetResult;

  constructor(result: FacetResult, entities: (FacetResultValue | FacetResultValue[])) {
    super(entities);
    this._result = result;

    this.forEach((e) => {
      e.result = result;
    })
  }

  public get result(): FacetResult {
    return this._result;
  }

  public toString(): string {
    return this.result.toString();
  }
}

export class FacetResult extends Identifiable {
  private readonly _values: FacetResultValueMap;
  private readonly _facet: Facet;

  constructor(facet: Facet, values: (FacetResultValue | FacetResultValue[])) {
    super(facet.id);
    this._facet = facet;
    this._values = new FacetResultValueMap(this, values);
  }

  public get facet(): Facet {
    return this._facet;
  }

  public get values(): FacetResultValueMap {
    return this._values;
  }

  public toString(): string {
    return `facet:=${this.facet},count:=${this.values.size}`;
  }
}

export class FacetResultMap extends IdentifiableMap<FacetResult> {
  constructor(entities: (FacetResult | FacetResult[]) = null) {
    super(entities);
  }
}

export class SearchResult {
  private readonly _data: DataTable;
  private readonly _facetData: FacetResultMap;
  
  constructor(data: DataTable, facetData: FacetResultMap = null) {
    this._data = (data || DataTable.Empty);
    this._facetData = (facetData || new FacetResultMap());
  }

  public get data(): DataTable {
    return this._data;
  }

  public get facetData(): FacetResultMap {
    return this._facetData;
  }
}

export class SearchResultPage extends EntityQueryPage<SearchResult> {
  constructor(searchParameters: SearchQueryParameters, value: SearchResult, totalRows: number = null, executionDuration = null) {
    super(searchParameters, value, totalRows, '', '', executionDuration);
  }

  public get totalPages(): number {
    const pageSize = (this.totalRows / this.queryParameters.pageSize);
    return Math.ceil(pageSize);
  }

  public get queryParameters(): SearchQueryParameters {
    return (super.queryParameters as SearchQueryParameters);
  }
}

export class SearchSuggestionResult {
  private readonly _data: DataTable;
  
  constructor(data: DataTable) {
    this._data = (data || DataTable.Empty);
  }

  public get data(): DataTable {
    return this._data;
  }
}

export class SearchSuggestionResultPage extends EntityQueryPage<SearchSuggestionResult> {
  constructor(searchParameters: SearchSuggestionQueryParameters, value: SearchSuggestionResult, executionDuration = null) {
    super(searchParameters, value, 0, '', '', executionDuration);
  }

  public get queryParameters(): SearchSuggestionQueryParameters {
    return (super.queryParameters as SearchSuggestionQueryParameters);
  }
}