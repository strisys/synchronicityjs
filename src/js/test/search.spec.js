"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const __1 = require("..");
const search_1 = require("../search");
const PouchDB = require("pouchdb");
const searchResultJson = require("./search-result.json");
const suggestionResultJson = require("./suggestion-result.json");
const apiVersion = '2019-05-06';
const DefaultHeaderParams = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
class DataAccessService {
    constructor(baseUrl) {
        this.getUrl = (endpoint, queryParams = null) => {
            return `${this.getSegment(this.baseUrlSegment)}${this.getSegment(endpoint)}${this.tryToQueryParamString(queryParams)}`;
        };
        this.tryToQueryParamString = (queryParams) => {
            if (!queryParams) {
                return '';
            }
            let val = '';
            const pairString = (key) => {
                return `${key}=${queryParams[key]}`;
            };
            Object.keys(queryParams).forEach((key, index) => {
                if (0 === index) {
                    val = `?${pairString(key)}`;
                    return;
                }
                val = `${val}&${pairString(key)}`;
            });
            return val;
        };
        this.fetchByUrl = (url, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const headerParams = DefaultHeaderParams;
            const requestInit = {
                method: 'GET',
                headers: headerParams
            };
            try {
                const response = (yield fetch(url, requestInit));
                if ((!response.ok) && (throwError)) {
                    const error = new Error(`Failed to fetch response from endpoint using 'fetchByUrl'! [url:= ${url}, status:=${response.statusText}]`);
                    throw error;
                }
                return response;
            }
            catch (ex) {
                throw ex;
            }
        });
        this.getResponse = (endpoint, queryParams = null, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl(endpoint, queryParams);
            return (yield this.fetchByUrl(url, throwError));
        });
        this.getResponseById = (endpoint, id, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = `${endpoint}/${id}`;
            return (yield this.fetchByUrl(url, throwError));
        });
        this.getResponseByQuery = (endpoint, queryParams = null, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl(endpoint, queryParams);
            return yield this.fetchByUrl(url, throwError);
        });
        this.getJson = (endpoint, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.getJsonByQuery(endpoint, null, throwError));
        });
        this.getJsonByQuery = (endpoint, queryParams = null, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = (yield this.getResponseByQuery(endpoint, queryParams, throwError));
            if ((response) && (response.json)) {
                return (yield response.json());
            }
            return null;
        });
        this.getTextByQuery = (endpoint, queryParams = null, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = (yield this.getResponseByQuery(endpoint, queryParams, throwError));
            if ((response) && (response.text)) {
                return (yield response.text());
            }
            return null;
        });
        this.postForJson = (endpoint, bodyParams = null, headerParams = DefaultHeaderParams, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = (yield this.postForResponse(endpoint, bodyParams, headerParams, throwError));
            if ((response) && (response.json)) {
                return (yield response.json());
            }
            return null;
        });
        this.postForResponse = (endpoint, bodyParams = null, headerParams = DefaultHeaderParams, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl(endpoint);
            const requestInit = {
                method: 'POST',
            };
            const bodyJson = ((bodyParams) ? JSON.stringify(bodyParams) : null);
            try {
                if (bodyJson) {
                    requestInit.body = bodyJson;
                }
                const response = (yield fetch(url, requestInit));
                // const params = { url, body: bodyJson, responseStatus: response.statusText };
                if ((!response.ok) && (throwError)) {
                    const message = `Failed to post json to endpoint using 'postForResponse'.  A non-success error code (${response.status}) was returned!`;
                    const error = new Error(message);
                    throw error;
                }
                return response;
            }
            catch (ex) {
                if (!throwError) {
                    return null;
                }
                throw ex;
            }
        });
        this._baseUrl = baseUrl;
    }
    get baseUrlSegment() {
        return this._baseUrl;
    }
    getSegment(segment) {
        let value = (segment || '').trim();
        if (!value) {
            return '';
        }
        if (!value.startsWith('/')) {
            value = `/${value}`;
        }
        if (!value.endsWith('/')) {
            value = `${value}/`;
        }
        return value;
    }
}
class DataAccessServiceBase {
    constructor() {
        this._das = null;
        this.getResponse = (endpoint = null, queryParams = null, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.getResponse(this.coerceEndpoint(endpoint), queryParams, throwError));
        });
        this.getResponseById = (endpoint, id, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.getResponseById(this.coerceEndpoint(endpoint), id, throwError));
        });
        this.getJson = (endpoint = null) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.getJson(this.coerceEndpoint(endpoint)));
        });
        this.getJsonByQuery = (endpoint = null, queryParams = null) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.getJsonByQuery(this.coerceEndpoint(endpoint), queryParams));
        });
        this.postForJson = (endpoint = null, bodyParams = null, headerParams = DefaultHeaderParams, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.postForJson(this.coerceEndpoint(endpoint), bodyParams, headerParams, throwError));
        });
        this.postForResponse = (endpoint = null, bodyParams = null, headerParams = DefaultHeaderParams) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.dataAccessService.postForResponse(this.coerceEndpoint(endpoint), bodyParams, headerParams));
        });
    }
    get dataAccessService() {
        return (this._das || (this._das = new DataAccessService('')));
    }
    coerceEndpoint(endpoint = null) {
        return (endpoint || this.baseUrl);
    }
}
class SearchDataAccessService extends DataAccessServiceBase {
    constructor() {
        super(...arguments);
        this.get = (params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getImpl(params, true);
            }
            catch (ex) {
                return yield this.getImpl(params, false);
            }
        });
        this.postForJson = (endpoint = null, bodyParams = null, headerParams = DefaultHeaderParams, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return searchResultJson;
        });
        this.getImpl = (params, isFirstAttempt) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._index = params.indexName;
            const pjson = params.toJson();
            let executionTime = new Date().getTime();
            let json = null;
            try {
                json = (yield this.postForJson(null, pjson, null, isFirstAttempt));
                if (!json) {
                    throw new Error(`The JSON object returned is null.`);
                }
                executionTime = ((new Date().getTime()) - executionTime);
            }
            catch (ex) {
                throw ex;
            }
            const extractFacetResults = (json) => {
                const facetData = new __1.FacetResultMap();
                if (params.facets.isEmpty) {
                    return facetData;
                }
                const facets = (json['@search.facets'] || []);
                params.facets.forEach((facet) => {
                    const results = facets[facet.fieldName];
                    if (results) {
                        facetData.set(new __1.FacetResult(facet, results.map((d) => new __1.FacetResultValue(d.value, d.count))));
                    }
                });
                return facetData;
            };
            const searchData = __1.DataTable.from(json['value'], 'id');
            const searchResult = new __1.SearchResult(searchData, extractFacetResults(json));
            const count = json['@odata.count'];
            return (new __1.SearchResultPage(params, searchResult, count, executionTime));
        });
    }
    get baseUrl() {
        return `/search-service/indexes/${this._index}/docs/search/?api-version=${apiVersion}`;
    }
}
class SearchSuggestionDataAccessService extends DataAccessServiceBase {
    constructor() {
        super(...arguments);
        this.postForJson = (endpoint = null, bodyParams = null, headerParams = DefaultHeaderParams, throwError = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return suggestionResultJson;
        });
        this.get = (params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._index = params.indexName;
            let executionTime = new Date().getTime();
            try {
                const json = (yield this.postForJson(null, params.toJson()));
                executionTime = ((new Date().getTime()) - executionTime);
                const searchData = __1.DataTable.from(json['value'], 'id');
                const searchResult = new __1.SearchSuggestionResult(searchData);
                return (new __1.SearchSuggestionResultPage(params, searchResult, executionTime));
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    get baseUrl() {
        return `/search-service/indexes/${this._index}/docs/suggest/?api-version=${apiVersion}`;
    }
}
describe('DialectType', () => {
    it(`should have two dialects that are supported at the current time`, function () {
        chai_1.assert.equal(__1.DialectType.length, 2);
        chai_1.assert.isObject(__1.DialectType.LuceneAzure);
        chai_1.assert.isObject(__1.DialectType.Mango);
    });
    it(`should be able to resolve to dialect based on string (lucene-azure)`, function () {
        chai_1.assert.isTrue(__1.DialectType.LuceneAzure.is('lucene-azure'));
        chai_1.assert.isFalse(__1.DialectType.LuceneAzure.is('lucene-aws'));
    });
    it(`should be able to resolve to dialect based on string (mango)`, function () {
        chai_1.assert.isTrue(__1.DialectType.Mango.is('mango'));
        chai_1.assert.isFalse(__1.DialectType.Mango.is('peach'));
    });
});
describe('SearchQueryParameters', () => {
    const createSimpleFilters = (values, operator) => {
        return values.map((c) => {
            return (new __1.SimpleFilter('company', operator, c));
        });
    };
    describe('toJson', () => {
        const companies = ['microsoft', 'google', 'nvidia'];
        describe(`Dialect: ${__1.DialectType.LuceneAzure}`, () => {
            const dialect = __1.DialectType.LuceneAzure;
            describe('filter', () => {
                let sp;
                beforeEach(() => {
                    sp = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
                });
                it(`filter string should match expected string given simple filters (0), composite filters (0), composite operator (-), and filter operator (-)`, function () {
                    // Act
                    let actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        queryType: 'simple',
                        search: 'main*',
                        filter: '',
                        facets: [],
                        top: 100,
                        count: true,
                        skip: 0
                    });
                });
                it(`filter string should match expected string given simple filters (3), composite filters (0), composite operator (-), and filter operator (eq)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
                    sp.filters.set(filters);
                    // Act
                    let actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        queryType: 'simple',
                        search: 'main*',
                        filter: "((company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
                        facets: [],
                        top: 100,
                        count: true,
                        skip: 0
                    });
                });
                it(`filter string should match expected string dialect given simple filters (0), composite filters (1), composite operator (or), and filter operator (eq)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
                    sp.filters.set(new __1.CompositeFilter(filters, __1.AndOr.Or));
                    // Act
                    let actual = sp.toJson(dialect);
                    chai_1.assert.deepEqual(actual, {
                        queryType: 'simple',
                        search: 'main*',
                        filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')))",
                        facets: [],
                        top: 100,
                        count: true,
                        skip: 0
                    });
                });
                it(`filter string should match expected string dialect given composite filters (1), composite operator (or), and filter operator (eq)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
                    sp.filters.set(new __1.CompositeFilter(filters, __1.AndOr.Or));
                    sp.filters.set(filters);
                    // Act
                    let actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        queryType: 'simple',
                        search: 'main*',
                        filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')) and (company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
                        facets: [],
                        top: 100,
                        count: true,
                        skip: 0
                    });
                });
            });
        });
        describe(`Dialect: ${__1.DialectType.Mango}`, () => {
            const dialect = __1.DialectType.Mango;
            describe('selector', () => {
                let sp;
                beforeEach(() => {
                    sp = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
                });
                it(`selector shape should match expected shape given the simple filters (0), composite filters (0), simple filter operators (-), composite filter operators (-)`, function () {
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (eq), composite filter operators (-)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
                    sp.filters.set(filters);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { $and: [{ company: { $eq: 'microsoft' } }, { company: { $eq: 'google' } }, { company: { $eq: 'nvidia' } }] },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (1), composite filters (0), simple filter operators (eq), composite filter operators (-)`, function () {
                    // Arrange
                    const filters = createSimpleFilters([companies[0]], __1.FilterOperator.Equal);
                    sp.filters.set(filters);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { company: { $eq: 'microsoft' } },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (gt), composite filter operators (-)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.GreaterThan);
                    sp.filters.set(filters);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { $and: [{ company: { $gt: 'microsoft' } }, { company: { $gt: 'google' } }, { company: { $gt: 'nvidia' } }] },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (lt), composite filter operators (-)`, function () {
                    // Arrange
                    const filters = createSimpleFilters(companies, __1.FilterOperator.LessThan);
                    sp.filters.set(filters);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { $and: [{ company: { $lt: 'microsoft' } }, { company: { $lt: 'google' } }, { company: { $lt: 'nvidia' } }] },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (0), composite filters (1), simple filter operators (eq), composite filter operators (or)`, function () {
                    const filter = new __1.CompositeFilter(createSimpleFilters(companies, __1.FilterOperator.Equal), __1.AndOr.Or);
                    sp.filters.set(filter);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { $or: [{ company: { $eq: 'microsoft' } }, { company: { $eq: 'google' } }, { 'company': { $eq: 'nvidia' } }] },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (0), composite filters (1), simple filter operators (gt), composite filter operators (and)`, function () {
                    // Arrange
                    const filter = new __1.CompositeFilter(createSimpleFilters(companies, __1.FilterOperator.GreaterThan), __1.AndOr.And);
                    sp.filters.set(filter);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: { $and: [{ company: { $gt: 'microsoft' } }, { company: { $gt: 'google' } }, { 'company': { $gt: 'nvidia' } }] },
                        fields: [],
                        sort: []
                    });
                });
                it(`selector shape should match expected shape given the simple filters (2), composite filters (1), simple filter operators (eq), composite filter operators (and)`, function () {
                    // Arrange
                    const simpleFilters = [new __1.SimpleFilter('company', __1.FilterOperator.Equal, 'goog'), new __1.SimpleFilter('company', __1.FilterOperator.NotEqual, 'fb')];
                    const compositeFilter = new __1.CompositeFilter(createSimpleFilters(['msft', 'nvda'], __1.FilterOperator.GreaterThan), __1.AndOr.And);
                    sp.filters.set(simpleFilters);
                    sp.filters.set(compositeFilter);
                    // Act
                    const actual = sp.toJson(dialect);
                    const expectedShape = { $and: [{ company: { $eq: 'goog' } }, { company: { $ne: 'fb' } }, { $and: [{ company: { $gt: 'msft' } }, { company: { $gt: 'nvda' } }] }] };
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: expectedShape,
                        fields: [],
                        sort: []
                    });
                });
            });
            describe('fields', () => {
                let sp;
                beforeEach(() => {
                    sp = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
                });
                it(`fields shape should match expected shape given 'selectFields' (0)`, function () {
                    // Arrange
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: [],
                        sort: []
                    });
                });
                it(`fields shape should match expected shape given 'selectFields' (1)`, function () {
                    // Arrange
                    sp.selectFields.set(new search_1.FieldElement('company'));
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: ['company'],
                        sort: []
                    });
                });
            });
            describe('sort', () => {
                let sp;
                beforeEach(() => {
                    sp = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
                });
                it(`sort shape should match expected shape given 'orderBy' fields (0)`, function () {
                    // Arrange
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: [],
                        sort: []
                    });
                });
                it(`sort shape should match expected shape given 'orderBy' of fields (1)`, function () {
                    // Arrange
                    sp.orderBy.set(new __1.OrderElement('company', 'asc'));
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: [],
                        sort: [{ company: 'asc' }]
                    });
                });
                it(`sort shape should match expected shape given 'orderBy' of fields (2)`, function () {
                    // Arrange
                    sp.orderBy.set([new __1.OrderElement('company', 'asc'), new __1.OrderElement('address', 'desc')]);
                    // Act
                    const actual = sp.toJson(dialect);
                    // Assert
                    chai_1.assert.deepEqual(actual, {
                        selector: {},
                        fields: [],
                        sort: [{ company: 'asc' }, { address: 'desc' }]
                    });
                });
            });
            describe('pouchdb', () => {
                let db;
                beforeEach('create and hydrate pouchdb', function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        db = new PouchDB('test-db');
                        // Hydrate db
                        let result = (yield db.bulkDocs(searchResultJson['value']));
                        // Validate result
                        const reducer = (accumulator, currentValue) => {
                            if (currentValue.ok) {
                                return (accumulator + 1);
                            }
                            return null;
                        };
                        let oks = result.reduce(reducer, 0);
                        console.log(oks);
                        console.log(oks);
                        // let docs = (await db.allDocs({
                        //   include_docs: true,
                        //   attachments: true
                        // }));
                        // docs.rows.forEach(element => {
                        //   console.log(element['doc']);
                        // });
                    });
                });
                afterEach('destroy pouchdb', function () {
                    return db.destroy(() => {
                        console.log('db destroyed');
                    });
                });
                it('query against db should return expected results given parameters', function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        chai_1.expect(db).is.not.null;
                    });
                });
            });
        });
    });
});
describe('SearchService', () => {
    it('search results should match expectations', function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pm = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
            const ss = new SearchDataAccessService();
            const pg = (yield ss.get(pm));
            // TODO: More testing
            chai_1.assert.isTrue(pg.value.data.rows.size === 3);
        });
    });
});
describe('SearchSuggestionService', () => {
    it('fetch search suggestion results', function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ss = new SearchSuggestionDataAccessService();
            const pm = new __1.SearchSuggestionQueryParameters('property', 'address', 'main*');
            const pg = (yield ss.get(pm));
            // TODO: More testing
            chai_1.assert.isTrue(pg.value.data.rows.size === 10);
        });
    });
});
//# sourceMappingURL=search.spec.js.map