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
describe('Search Service', () => {
    it('fetch search results', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ss = new SearchDataAccessService();
        const pm = new __1.SearchQueryParameters('property', 'main*', 0, 0, 100);
        const pg = (yield ss.get(pm));
        chai_1.assert.isTrue(pg.value.data.rows.size === 3);
    }));
});
describe('Search Suggestion Service', () => {
    it('fetch search suggestion results', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const ss = new SearchSuggestionDataAccessService();
        const pm = new __1.SearchSuggestionQueryParameters('property', 'address', 'main*');
        const pg = (yield ss.get(pm));
        console.log(pg.value.data.rows.size);
        chai_1.assert.isTrue(pg.value.data.rows.size === 10);
    }));
});
//# sourceMappingURL=search.spec.js.map