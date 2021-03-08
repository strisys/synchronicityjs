import { AndOr, AscDesc, AscDescCode, Enum, EntityQueryPage, EntityQueryParameters, Identifiable, IdentifiableMap, DataTable } from '.';
export declare type DialectTypeCode = ('null' | 'lucene-azure' | 'mango');
export declare class DialectType extends Enum<DialectType> {
    private static readonly TypeName;
    static readonly Null: DialectType;
    static readonly LuceneAzure: DialectType;
    static readonly Mango: DialectType;
    private constructor();
    get isLuceneAzure(): boolean;
    get isMango(): boolean;
    static tryParse(keyOrValue: (string | DialectTypeCode)): DialectType;
    static get size(): number;
    static get random(): DialectType;
    static get entries(): DialectType[];
    static get keys(): string[];
    static get values(): DialectTypeCode[];
    static forEach(fn: (value: DialectType, index: number) => void): void;
}
export declare type QueryTypeCode = ('null' | 'simple' | 'complex');
export declare class QueryType extends Enum<QueryType> {
    private static readonly TypeName;
    static readonly Null: QueryType;
    static readonly Simple: QueryType;
    static readonly Complex: QueryType;
    private constructor();
    get isSimple(): boolean;
    get isComplex(): boolean;
    static tryParse(keyOrValue: (string | QueryTypeCode)): QueryType;
    static get size(): number;
    static get random(): QueryType;
    static get entries(): QueryType[];
    static get keys(): string[];
    static get values(): QueryTypeCode[];
    static forEach(fn: (value: QueryType, index: number) => void): void;
}
export declare type FilterOperatorCode = ('null' | 'eq' | 'lt' | 'gt' | 'ne');
export declare class FilterOperator extends Enum<FilterOperator> {
    private static readonly TypeName;
    static readonly Null: FilterOperator;
    static readonly Equal: FilterOperator;
    static readonly LessThan: FilterOperator;
    static readonly GreaterThan: FilterOperator;
    static readonly NotEqual: FilterOperator;
    private constructor();
    get isEqualTo(): boolean;
    get isLessThan(): boolean;
    get isGreaterThan(): boolean;
    static tryParse(keyOrValue: (string | QueryTypeCode)): FilterOperator;
    static get size(): number;
    static get random(): FilterOperator;
    static get entries(): FilterOperator[];
    static get keys(): string[];
    static get values(): FilterOperatorCode[];
    static forEach(fn: (value: FilterOperator, index: number) => void): void;
}
export declare abstract class Filter extends Identifiable {
    protected static _instanceCounter: number;
    abstract toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
}
export declare class CompositeFilter extends Filter {
    private readonly _filters;
    private readonly _operator;
    constructor(filters: Filter[], operator?: AndOr);
    get filters(): Filter[];
    get operator(): AndOr;
    toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected onToQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toQueryExpressionLuceneAzure(): string;
    protected toQueryExpressionMango(): any;
}
export declare class SimpleFilter extends Filter {
    private readonly _fieldName;
    private readonly _operator;
    private readonly _displayName;
    private readonly _value;
    constructor(fieldName: string, operator: (FilterOperator | FilterOperatorCode), value: any, displayName?: string);
    get fieldName(): string;
    get operator(): FilterOperator;
    get value(): any;
    get displayName(): string;
    toQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected onToQueryExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toQueryExpressionLuceneAzure(): string;
    protected toQueryExpressionMango(): any;
}
export declare class FilterMap extends IdentifiableMap<Filter> {
    private _operator;
    constructor(entities?: (Filter | Filter[]));
    get operator(): AndOr;
    set operator(andOr: AndOr);
    toJson(dialect: (DialectType | DialectTypeCode | string)): string;
    protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toJsonLuceneAzure(): string;
    protected toJsonMango(): any;
}
export declare class OrderElement extends Identifiable {
    private readonly _fieldName;
    private readonly _direction;
    constructor(fieldName: string, direction?: (AscDesc | AscDescCode));
    get fieldName(): string;
    get direction(): AscDesc;
    toString(): string;
    toExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected onToExpression(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toExpressionLuceneAzure(): string;
    protected toExpressionMango(): any;
}
export declare class OrderElementAsc extends OrderElement {
    constructor(fieldName: string);
}
export declare class OrderElementDesc extends OrderElement {
    private static _score;
    constructor(fieldName: string);
    static get searchScore(): OrderElement;
}
export declare class OrderElementMap extends IdentifiableMap<OrderElement> {
    private static readonly reducer;
    constructor(entities?: (OrderElement | OrderElement[]));
    setSearchScore(): OrderElementMap;
    toJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toJsonLuceneAzure(): string;
    protected toJsonMango(): any;
}
export declare class Facet extends Identifiable {
    private readonly _fieldName;
    private readonly _displayName;
    private readonly _optionsExpression;
    constructor(fieldName: string, displayName?: string, optionsExpression?: string);
    get fieldName(): string;
    get displayName(): string;
    get optionsExpression(): string;
    toString(): string;
}
export declare class FacetMap extends IdentifiableMap<Facet> {
    constructor(entities?: (Facet | Facet[]));
    toJson(): string[];
}
export declare class SearchQueryParametersBase extends EntityQueryParameters {
    private _searchFields;
    private _selectFields;
    constructor(searchString: string, pageNumber: number, pageSize: number);
    get searchFields(): FieldMap;
    get selectFields(): FieldMap;
}
export declare class SearchQueryParameters extends SearchQueryParametersBase {
    private readonly _facets;
    private readonly _filters;
    private readonly _orderElements;
    private _indexName;
    private _queryType;
    private _showCount;
    private _skip;
    constructor(indexName: string, searchString: string, skip: number, pageNumber: number, pageSize: number);
    get isAllSearch(): boolean;
    get indexName(): string;
    get facets(): FacetMap;
    get filters(): FilterMap;
    get orderBy(): OrderElementMap;
    get queryType(): QueryType;
    set queryType(value: QueryType);
    get count(): boolean;
    set count(value: boolean);
    get skip(): number;
    set skip(value: number);
    get page(): number;
    toJson(dialect?: (DialectType | DialectTypeCode | string)): any;
    protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toLuceneAzureJson(): any;
    protected toMangoJson(): any;
}
export declare class FieldElement extends Identifiable {
    private readonly _displayName;
    constructor(physicalName: string, displayName?: string);
    get physicalName(): string;
    get displayName(): string;
    static from(physicalNames: string[]): FieldElement[];
}
export declare class FieldMap extends IdentifiableMap<FieldElement> {
    private static readonly reducer;
    constructor(entities?: (string | string[]));
    private static tryConvertOne;
    private static tryConvert;
    toJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toLuceneAzureJson(): any;
    protected toMangoJson(): any;
}
export declare class SearchSuggestionQueryParameters extends SearchQueryParametersBase {
    private readonly _filters;
    private readonly _orderElements;
    private _indexName;
    private _suggesterName;
    private _useFuzzySearch;
    constructor(indexName: string, suggesterName: string, searchString: string, searchFields?: string[], selectFields?: string[], pageSize?: number);
    get indexName(): string;
    get suggesterName(): string;
    get filters(): FilterMap;
    get orderBy(): OrderElementMap;
    get useFuzzySearch(): boolean;
    set useFuzzySearch(value: boolean);
    toJson(dialect?: (DialectType | DialectTypeCode | string)): any;
    protected onToJson(dialect: (DialectType | DialectTypeCode | string)): any;
    protected toLuceneAzureJson(): any;
    protected toMangoJson(): any;
}
export declare class FacetResultValue extends Identifiable {
    private readonly _value;
    private readonly _count;
    private _result;
    constructor(value: any, count: number);
    get count(): number;
    get value(): any;
    get facet(): Facet;
    get result(): FacetResult;
    set result(value: FacetResult);
    get equalityFilter(): Filter;
    toString(): string;
}
export declare class FacetResultValueMap extends IdentifiableMap<FacetResultValue> {
    private readonly _result;
    constructor(result: FacetResult, entities: (FacetResultValue | FacetResultValue[]));
    get result(): FacetResult;
    toString(): string;
}
export declare class FacetResult extends Identifiable {
    private readonly _values;
    private readonly _facet;
    constructor(facet: Facet, values: (FacetResultValue | FacetResultValue[]));
    get facet(): Facet;
    get values(): FacetResultValueMap;
    toString(): string;
}
export declare class FacetResultMap extends IdentifiableMap<FacetResult> {
    constructor(entities?: (FacetResult | FacetResult[]));
}
export declare class SearchResult {
    private readonly _data;
    private readonly _facetData;
    constructor(data: DataTable, facetData?: FacetResultMap);
    get data(): DataTable;
    get facetData(): FacetResultMap;
}
export declare class SearchResultPage extends EntityQueryPage<SearchResult> {
    constructor(searchParameters: SearchQueryParameters, value: SearchResult, totalRows?: number, executionDuration?: any);
    get totalPages(): number;
    get queryParameters(): SearchQueryParameters;
}
export declare class SearchSuggestionResult {
    private readonly _data;
    constructor(data: DataTable);
    get data(): DataTable;
}
export declare class SearchSuggestionResultPage extends EntityQueryPage<SearchSuggestionResult> {
    constructor(searchParameters: SearchSuggestionQueryParameters, value: SearchSuggestionResult, executionDuration?: any);
    get queryParameters(): SearchSuggestionQueryParameters;
}
