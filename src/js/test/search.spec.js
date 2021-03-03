"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const __1 = require("..");
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
describe('SearchQueryParameters', () => {
    const createSimpleFilters = (values, operator) => {
        return values.map((c) => {
            return (new __1.SimpleFilter('company', operator, c));
        });
    };
    describe(`Dialect: ${__1.DialectType.LuceneAzure}`, () => {
        const companies = ['microsoft', 'google', 'nvidia'];
        const dialect = __1.DialectType.LuceneAzure;
        let pm;
        beforeEach(() => {
            pm = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
        });
        it(`search parameters should match expected dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            chai_1.assert.deepEqual(pm.toJson(dialect), {
                queryType: 'simple',
                search: 'main*',
                filter: '',
                facets: [],
                top: 100,
                count: true,
                skip: 0
            });
        }));
        it(`search parameters should match expected dialect - Simple Filter`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
            pm.filters.set(filters);
            chai_1.assert.deepEqual(pm.toJson(dialect), {
                queryType: 'simple',
                search: 'main*',
                filter: "((company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
                facets: [],
                top: 100,
                count: true,
                skip: 0
            });
        }));
        it(`search parameters should match expected dialect - Composite Filter`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
            pm.filters.set(new __1.CompositeFilter(filters, __1.AndOr.Or));
            chai_1.assert.deepEqual(pm.toJson(dialect), {
                queryType: 'simple',
                search: 'main*',
                filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')))",
                facets: [],
                top: 100,
                count: true,
                skip: 0
            });
        }));
        it(`search parameters should match expected dialect - Complex Filter`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const filters = createSimpleFilters(companies, __1.FilterOperator.Equal);
            pm.filters.set(new __1.CompositeFilter(filters, __1.AndOr.Or));
            pm.filters.set(filters);
            chai_1.assert.deepEqual(pm.toJson(dialect), {
                queryType: 'simple',
                search: 'main*',
                filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')) and (company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
                facets: [],
                top: 100,
                count: true,
                skip: 0
            });
        }));
    });
    describe(`Dialect: ${__1.DialectType.Mango}`, () => {
        const companies = ['microsoft', 'google', 'nvidia'];
        const dialect = __1.DialectType.Mango;
        let sp;
        beforeEach(() => {
            sp = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
        });
        it(`selector structure should match expected shape given this filters (0) specified and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // Act
            const actual = sp.toJson(dialect);
            chai_1.assert.deepEqual(actual, {
                selector: {},
                fields: [],
                sort: []
            });
        }));
        it(`selector structure should match expected shape given the filters (3) and operator (eq) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        }));
        it(`selector structure should match expected shape given the filters (1) and operator (eq) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        }));
        it(`selector structure should match expected shape given the filters (3) and operator (gt) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        }));
        it(`selector structure should match expected shape given the filter (3) and operator (lt) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        }));
        it(`selector structure should match expected shape given the filter (1 composite), composite operator (or), and filter operator (eq) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // Arrange
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
        }));
        it(`selector structure should match expected shape given the filter (1 composite), composite operator (and), and filter operator (gt) and dialect`, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
        }));
    });
});
describe('SearchService', () => {
    it('search results should match expectations', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const pm = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
        const ss = new SearchDataAccessService();
        const pg = (yield ss.get(pm));
        chai_1.assert.isTrue(pg.value.data.rows.size === 3);
    }));
});
describe('SearchSuggestionService', () => {
    it('fetch search suggestion results', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ss = new SearchSuggestionDataAccessService();
        const pm = new __1.SearchSuggestionQueryParameters('property', 'address', 'main*');
        const pg = (yield ss.get(pm));
        chai_1.assert.isTrue(pg.value.data.rows.size === 10);
    }));
});
//# sourceMappingURL=search.spec.js.map