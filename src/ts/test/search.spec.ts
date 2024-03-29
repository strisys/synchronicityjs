import { assert, expect } from 'chai';
import { AndOr, AscDesc, DataTable, DialectType, FacetResult, FacetResultMap, FacetResultValue, OrderElement, SearchQueryParameters, SearchResult, SearchResultPage, SearchSuggestionResultPage, SearchSuggestionQueryParameters, SearchSuggestionResult, SimpleFilter, CompositeFilter, Filter, FilterOperator } from '..';
import { FieldElement } from '../search';
import PouchDB from 'pouchdb';

// Load plug-in
PouchDB.plugin(require('pouchdb-find'));

import searchResultJson = require('./search-result.json');
import suggestionResultJson = require('./suggestion-result.json');

const apiVersion = '2019-05-06';
type QueryParams = { [key: string]: string };
type BodyParams = { [key: string]: string };
type HeaderParams = { [key: string]: string };

const DefaultHeaderParams: HeaderParams = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

class DataAccessService {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  protected get baseUrlSegment(): string {
    return this._baseUrl;
  }

  protected getSegment(segment: string): string {
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

  protected getUrl = (endpoint: string, queryParams: QueryParams = null): string => {
    return `${this.getSegment(this.baseUrlSegment)}${this.getSegment(endpoint)}${this.tryToQueryParamString(queryParams)}`;
  }

  
  private tryToQueryParamString = (queryParams: QueryParams): string => {
    return ((queryParams) ? (new URLSearchParams(queryParams)).toString() : '');
  }

  private fetchByUrl = async (url: string, throwError = true): Promise<Response> => {
    const headerParams = DefaultHeaderParams;
    
    const requestInit: RequestInit = {
      method: 'GET',
      headers: headerParams
    };

    try {
      const response: Response = (await fetch(url, requestInit));

      if ((!response.ok) && (throwError)) {
        const error = new Error(`Failed to fetch response from endpoint using 'fetchByUrl'! [url:= ${url}, status:=${response.statusText}]`);
        throw error;
      }
  
      return response;
    }
    catch (ex) {
      throw ex;
    }
  }

  public getResponse = async (endpoint: string, queryParams: QueryParams = null, throwError = true): Promise<Response> => {
    const url = this.getUrl(endpoint, queryParams);
    return (await this.fetchByUrl(url, throwError));
  }

  public getResponseById = async (endpoint: string, id: string, throwError = true): Promise<Response> => {
    const url = `${endpoint}/${id}`;
    return (await this.fetchByUrl(url, throwError));
  }

  public getResponseByQuery = async (endpoint: string, queryParams: QueryParams = null, throwError = true): Promise<Response> => {
    const url = this.getUrl(endpoint, queryParams);
    return await this.fetchByUrl(url, throwError);
  }

  public getJson = async (endpoint: string, throwError = true): Promise<any> => {
    return (await this.getJsonByQuery(endpoint, null, throwError));
  }

  public getJsonByQuery = async (endpoint: string, queryParams: QueryParams = null, throwError = true): Promise<any> => {
    const response = (await this.getResponseByQuery(endpoint, queryParams, throwError));

    if ((response) && (response.json)) {
      return (await response.json());
    }

    return null;
  }

  public getTextByQuery = async (endpoint: string, queryParams: QueryParams = null, throwError = true): Promise<string> => {
    const response = (await this.getResponseByQuery(endpoint, queryParams, throwError));

    if ((response) && (response.text)) {
      return (await response.text());
    }

    return null;
  }

  public postForJson = async (endpoint: string, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true): Promise<any> => {
    const response = (await this.postForResponse(endpoint, bodyParams, headerParams, throwError));

    if ((response) && (response.json)) {
      return (await response.json());
    }

    return null;
  }

  public postForResponse = async (endpoint: string, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true): Promise<Response> => {
    const url: string = this.getUrl(endpoint);

    const requestInit: RequestInit = {
      method: 'POST',
    };

    const bodyJson = ((bodyParams) ? JSON.stringify(bodyParams) : null);

    try {
      if (bodyJson) {
        requestInit.body = bodyJson;
      }

      const response: Response = (await fetch(url, requestInit));
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
  }
}

abstract class DataAccessServiceBase {
  private _das: DataAccessService = null;
  
  protected abstract get baseUrl(): string;

  protected get dataAccessService(): DataAccessService {
    return (this._das || (this._das = new DataAccessService('')));
  }

  protected coerceEndpoint(endpoint: string = null): string {
    return (endpoint || this.baseUrl);
  }

  protected getResponse = async (endpoint: string = null, queryParams: QueryParams = null, throwError = true): Promise<Response> => {
    return (await this.dataAccessService.getResponse(this.coerceEndpoint(endpoint), queryParams, throwError));
  }

  public getResponseById = async (endpoint: string, id: string, throwError = true): Promise<Response> => {
    return (await this.dataAccessService.getResponseById(this.coerceEndpoint(endpoint), id, throwError));
  }

  protected getJson = async (endpoint: string = null): Promise<any> => {
    return (await this.dataAccessService.getJson(this.coerceEndpoint(endpoint)));
  }

  protected getJsonByQuery = async (endpoint: string = null, queryParams: QueryParams = null): Promise<any> => {
    return (await this.dataAccessService.getJsonByQuery(this.coerceEndpoint(endpoint), queryParams));
  }

  protected postForJson = async (endpoint: string = null, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true): Promise<any> => {
    return (await this.dataAccessService.postForJson(this.coerceEndpoint(endpoint), bodyParams, headerParams, throwError));
  }

  protected postForResponse = async (endpoint: string = null, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams): Promise<any> => {
    return (await this.dataAccessService.postForResponse(this.coerceEndpoint(endpoint), bodyParams, headerParams));
  }
}

class SearchDataAccessService extends DataAccessServiceBase {
  private _index: string;

  protected get baseUrl(): string {
    return `/search-service/indexes/${this._index}/docs/search/?api-version=${apiVersion}`;
  }

  public get = async (params: SearchQueryParameters): Promise<SearchResultPage> => {
    try {
      return await this.getImpl(params, true);
    }
    catch (ex) {
      return await this.getImpl(params, false);
    }
  }

  protected postForJson = async (endpoint: string = null, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true): Promise<any> => {
    return searchResultJson;
  }

  private getImpl = async (params: SearchQueryParameters, isFirstAttempt: boolean): Promise<SearchResultPage> => {
    this._index = params.indexName;
    const pjson = params.toJson();

    let executionTime = new Date().getTime();
    let json = null;

    try {
      json = (await this.postForJson(null, pjson, null, isFirstAttempt));

      if (!json) {
        throw new Error(`The JSON object returned is null.`);
      }

      executionTime = ((new Date().getTime()) - executionTime);
    }
    catch (ex) {      
      throw ex;
    }

    const extractFacetResults = (json): FacetResultMap => {
      const facetData = new FacetResultMap();

      if (params.facets.isEmpty) {
        return facetData;
      }

      const facets = (json['@search.facets'] as [] || []);

      params.facets.forEach((facet) => {
        const results = (facets[facet.fieldName] as { value: any, count: number }[]);

        if (results) {
          facetData.set(new FacetResult(facet, results.map((d) => new FacetResultValue(d.value, d.count))));
        }
      });

      return facetData;
    }

    const searchData = DataTable.from(json['value'], 'id');
    const searchResult = new SearchResult(searchData, extractFacetResults(json));
    const count = json['@odata.count'] as number;
    
    return (new SearchResultPage(params, searchResult, count, executionTime));
  }
}

class SearchSuggestionDataAccessService extends DataAccessServiceBase {
  private _index: string;

  protected get baseUrl(): string {
    return `/search-service/indexes/${this._index}/docs/suggest/?api-version=${apiVersion}`;
  }

  protected postForJson = async (endpoint: string = null, bodyParams: BodyParams = null, headerParams: HeaderParams = DefaultHeaderParams, throwError = true): Promise<any> => {
    return suggestionResultJson;
  }

  public get = async (params: SearchSuggestionQueryParameters): Promise<SearchSuggestionResultPage> => {
    this._index = params.indexName;
    let executionTime = new Date().getTime();

    try {
      const json = (await this.postForJson(null, params.toJson()));
      executionTime = ((new Date().getTime()) - executionTime);
  
      const searchData = DataTable.from(json['value'], 'id');
      const searchResult = new SearchSuggestionResult(searchData);
      
      return (new SearchSuggestionResultPage(params, searchResult, executionTime));
    }
    catch (ex) {
      throw ex;
    }
  }
}

describe('DialectType', () => {
  it(`should have two dialects that are supported at the current time`, function() {    
    assert.equal(DialectType.length, 2);
    assert.isObject(DialectType.LuceneAzure);
    assert.isObject(DialectType.Mango);
  });

  it(`should be able to resolve to dialect based on string (lucene-azure)`, function() {    
    assert.isTrue(DialectType.LuceneAzure.is('lucene-azure'));
    assert.isFalse(DialectType.LuceneAzure.is('lucene-aws'));
  });

  it(`should be able to resolve to dialect based on string (mango)`, function() {    
    assert.isTrue(DialectType.Mango.is('mango'));
    assert.isFalse(DialectType.Mango.is('peach'));
  });
});

describe('SearchQueryParameters', () => {
  const createSimpleFilters = (values: string[], operator: FilterOperator): Filter[] => {
    return values.map((c) => {
      return (new SimpleFilter('company', operator, c));
    })
  }

  describe('toJson', () => {
    const companies = ['microsoft', 'google', 'nvidia'];

    describe(`Dialect: ${DialectType.LuceneAzure}`, () => {
      const dialect = DialectType.LuceneAzure;

      describe('filter', () => {        
        let sp: SearchQueryParameters;
    
        beforeEach(() => {
          sp = new SearchQueryParameters('property', 'main*', 0, 0, 100);
        });
    
        it(`filter string should match expected string given simple filters (0), composite filters (0), composite operator (-), and filter operator (-)`, function() {
          // Act
          let actual = sp.toJson(dialect);
          
          // Assert
          assert.deepEqual(actual, {
            queryType: 'simple',
            search: 'main*',
            filter: '',
            facets: [],
            top: 100,
            count: true,
            skip: 0
          });
        });
    
        it(`filter string should match expected string given simple filters (3), composite filters (0), composite operator (-), and filter operator (eq)`, function() {
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.Equal);
          sp.filters.set(filters);

          // Act
          let actual = sp.toJson(dialect);
    
          // Assert
          assert.deepEqual(actual, {
            queryType: 'simple',
            search: 'main*',
            filter: "((company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
            facets: [],
            top: 100,
            count: true,
            skip: 0
          });
        });
    
        it(`filter string should match expected string dialect given simple filters (0), composite filters (1), composite operator (or), and filter operator (eq)`, function() {
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.Equal);
          sp.filters.set(new CompositeFilter(filters, AndOr.Or));
    
          // Act
          let actual = sp.toJson(dialect);

          assert.deepEqual(actual, {
            queryType: 'simple',
            search: 'main*',
            filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')))",
            facets: [],
            top: 100,
            count: true,
            skip: 0
          });
        });
    
        it(`filter string should match expected string dialect given composite filters (1), composite operator (or), and filter operator (eq)`, function() {
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.Equal);
          sp.filters.set(new CompositeFilter(filters, AndOr.Or));
          sp.filters.set(filters);
    
          // Act
          let actual = sp.toJson(dialect);

          // Assert
          assert.deepEqual(actual, {
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

    describe(`Dialect: ${DialectType.Mango}`, () => {
      const dialect = DialectType.Mango;

      describe('selector', () => {
        let sp: SearchQueryParameters;
    
        beforeEach(() => {
          sp = new SearchQueryParameters('property', 'main*', 0, 0, 100);
        }); 
    
        it(`selector shape should match expected shape given the simple filters (0), composite filters (0), simple filter operators (-), composite filter operators (-)`, function() {  
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {}
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (eq), composite filter operators (-)`, function() {  
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.Equal);
          sp.filters.set(filters);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { $and: [{company: { $eq: 'microsoft' }}, {company: { $eq: 'google' }}, {company: { $eq: 'nvidia' }}] }
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (1), composite filters (0), simple filter operators (eq), composite filter operators (-)`, function() {  
          // Arrange
          const filters = createSimpleFilters([companies[0]], FilterOperator.Equal);
          sp.filters.set(filters);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { company: { $eq: 'microsoft' } }
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (gt), composite filter operators (-)`, function() {  
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.GreaterThan);
          sp.filters.set(filters);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { $and: [{company: { $gt: 'microsoft' }}, {company: { $gt: 'google' }}, {company: { $gt: 'nvidia' }}] }
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (3), composite filters (0), simple filter operators (lt), composite filter operators (-)`, function() {  
          // Arrange
          const filters = createSimpleFilters(companies, FilterOperator.LessThan);
          sp.filters.set(filters);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { $and: [{company: { $lt: 'microsoft' }}, {company: { $lt: 'google' }}, {company: { $lt: 'nvidia' }}] }
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (0), composite filters (1), simple filter operators (eq), composite filter operators (or)`, function() {            // Arrange
          const filter = new CompositeFilter(createSimpleFilters(companies, FilterOperator.Equal), AndOr.Or);
          sp.filters.set(filter);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { $or: [{company: {$eq: 'microsoft'}}, {company: {$eq: 'google'}}, {'company': {$eq: 'nvidia'}}] }
          });
        });
    
        it(`selector shape should match expected shape given the simple filters (0), composite filters (1), simple filter operators (gt), composite filter operators (and)`, function() {            // Arrange
          // Arrange
          const filter = new CompositeFilter(createSimpleFilters(companies, FilterOperator.GreaterThan), AndOr.And);
          sp.filters.set(filter);
    
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: { $and: [{company: {$gt: 'microsoft'}}, {company: {$gt: 'google'}}, {'company': {$gt: 'nvidia'}}] }
          });
        });

        it(`selector shape should match expected shape given the simple filters (2), composite filters (1), simple filter operators (eq), composite filter operators (and)`, function() {            // Arrange
          // Arrange
          const simpleFilters = [new SimpleFilter('company', FilterOperator.Equal, 'goog'), new SimpleFilter('company', FilterOperator.NotEqual, 'fb')];
          const compositeFilter = new CompositeFilter(createSimpleFilters(['msft', 'nvda'], FilterOperator.GreaterThan), AndOr.And);
          
          sp.filters.set(simpleFilters);
          sp.filters.set(compositeFilter);
    
          // Act
          const actual = sp.toJson(dialect).query;
          const expectedSelectorShape = { 
            $and: [{company:{$eq: 'goog'}},{company:{$ne:'fb'}}, { $and:[{company:{$gt: 'msft'}}, {company:{$gt: 'nvda'}}]}]
          };
    
          // Assert
          assert.deepEqual(actual, {
            // use_index: 'property',
            selector: expectedSelectorShape
          });
        });
      });

      describe('fields', () => {
        let sp: SearchQueryParameters;
    
        beforeEach(() => {
          sp = new SearchQueryParameters('property', 'main*', 0, 0, 100);
        }); 

        it(`fields shape should match expected shape given 'selectFields' (0)`, function() {  
          // Arrange
        
          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {}
          });
        });

        it(`fields shape should match expected shape given 'selectFields' (1)`, function() {  
          // Arrange
          sp.selectFields.set(new FieldElement('company'));

          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {},
              fields: ['company']
          });
        });
      });

      describe('sort', () => {
        let sp: SearchQueryParameters;
    
        beforeEach(() => {
          sp = new SearchQueryParameters('property', 'main*', 0, 0, 100);
        }); 
    
        it(`sort shape should match expected shape given 'orderBy' fields (0)`, function() {  
          // Arrange

          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {}
          });
        });

        it(`sort shape should match expected shape given 'orderBy' of fields (1)`, function() {  
          // Arrange
          sp.orderBy.set(new OrderElement('company', 'asc'));

          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {},
              sort: [{company: 'asc'}]
          });
        });

        it(`sort shape should match expected shape given 'orderBy' of fields (2)`, function() {  
          // Arrange
          sp.orderBy.set([new OrderElement('company', 'asc'), new OrderElement('address', 'desc')]);

          // Act
          const actual = sp.toJson(dialect).query;
    
          // Assert
          assert.deepEqual(actual, {
              // use_index: 'property',
              selector: {},
              sort: [{company: 'asc'}, {address: 'desc'}]
          });
        });
      });

      describe('pouchdb', () => {
        let debugOn = false;
        let sp: SearchQueryParameters;
        const dbName = 'test-db';
        let db: PouchDB.Database<{}>;

        beforeEach('create and hydrate pouchdb', async function() {
          sp = new SearchQueryParameters('property', 'main*', 0, 0, 100);
          db  = new PouchDB(dbName);

          // Hydrate db
          let result = (await db.bulkDocs(searchResultJson['value']));

          // Validate result
          const reducer = (accumulator, currentValue) => {
            if (currentValue.ok) {
              return (accumulator + 1);
            }
            
            return null;
          }

          let oks = result.reduce(reducer, 0);
          expect(oks).to.be.eq(3);

          if (!debugOn) {
            return;
          }

          let docs = (await db.allDocs({
            include_docs: true,
            attachments: true
          }));

          docs.rows.forEach(element => {
            console.log(element['doc']);
          });
        });

        afterEach(`destroy pouchdb [${dbName}]`, function() {
          return db.destroy(null, () => {
            if (debugOn) {
              console.log('db destroyed');
            }
            
          });
        });

        it('query against db should return expected results given parameters and use default index', async function() {
          let debugOn = false;

          // Arrange
          sp.selectFields.set([new FieldElement('address'), new FieldElement('_id')]);
          sp.filters.set(new CompositeFilter([new SimpleFilter('address', 'eq', '3731 Village Main Street'), new SimpleFilter('address', 'eq', '3116 Main Street')], 'or'));
          sp.orderBy.set(new OrderElement('_id', 'asc'));
          
          const query = sp.toJson(dialect).query;
          
          if (debugOn) {
            console.log(query);
          }

          // Act (https://github.com/pouchdb/pouchdb/tree/7532eb30f514d37b94f829ed22e70da7f3c1ed3a/tests/find/test-suite-1)
          let docs = (await db.find(query));

          if (debugOn) {
            console.log(docs);
          }

          // Assert
          expect(docs).to.be.eql({
            docs: [
              { 
                _id: "83e43a8f-6a8d-9daa-c0d5-592276d65bb6",
                address: '3116 Main Street'
              },
              { 
                _id: "892daff0-307b-cce7-58ca-3dc3dbec12b7",
                address: '3731 Village Main Street' 
              } 
            ],
            warning: 'No matching index found, create an index to optimize query time.'
          });
        });

        // https://pouchdb.com/api.html#query_index
        it('query against db should return expected results given parameters and created index when using AND composite filter', async function() {
          let debugOn = false;

          // Arrange
          sp.selectFields.mapAndSet(['address', 'city', '_id']);
          sp.filters.set(CompositeFilter.mapAnd({'address': '3731 Village Main Street', 'city': 'Loganville'}));
          sp.orderBy.mapAndSet({'address': 'asc'});
          
          const json = sp.toJson(dialect);
                    
          if (debugOn) {
            console.log(JSON.stringify(json));
          }
          
          // NOTE: This index will not be used because using and OR (https://github.com/pouchdb/pouchdb/issues/6371)
          let idx = (await db.createIndex(json.index));

          if (debugOn) {
            console.log(idx);
          }
          
          // Act (https://github.com/pouchdb/pouchdb/tree/7532eb30f514d37b94f829ed22e70da7f3c1ed3a/tests/find/test-suite-1)
          let docs = (await db.find(json.query));

          if (debugOn) {
            console.log(docs);
          }

          // Assert
          expect(docs).to.be.eql({
            docs: [{ 
                _id: "892daff0-307b-cce7-58ca-3dc3dbec12b7",
                address: '3731 Village Main Street',
                city: 'Loganville'
              } 
            ],
            // warning: "No matching index found, create an index to optimize query time."
          });
        });
      });
    });
  });
});

describe('SearchService', () => {
  it('search results should match expectations', async function() {
    const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);

    const ss = new SearchDataAccessService();
    const pg: SearchResultPage = (await ss.get(pm));

    // TODO: More testing
    assert.isTrue(pg.value.data.rows.size === 3);
  });
});

describe('SearchSuggestionService', () => {
  it('fetch search suggestion results', async function() {
    const ss = new SearchSuggestionDataAccessService();
    const pm = new SearchSuggestionQueryParameters('property', 'address', 'main*');
    const pg: SearchSuggestionResultPage = (await ss.get(pm));

    // TODO: More testing
    assert.isTrue(pg.value.data.rows.size === 10);
  });
});

