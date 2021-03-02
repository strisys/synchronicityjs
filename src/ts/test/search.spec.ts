import { assert } from 'chai';
import { AndOr, DataTable, DialectType, FacetResult, FacetResultMap, FacetResultValue, SearchQueryParameters, SearchResult, SearchResultPage, SearchSuggestionResultPage, SearchSuggestionQueryParameters, SearchSuggestionResult, SimpleFilter, CompositeFilter, Filter, FilterOperator } from '..';
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
    if (!queryParams) {
      return '';
    }

    let val = '';

    const pairString = (key: string): string => {
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

describe('SearchQueryParameters', () => {
  describe(`Dialect: ${DialectType.LuceneAzure}`, () => {
    const createSimpleFilters = (values: string[], operator: FilterOperator): Filter[] => {
      return values.map((c) => {
        return (new SimpleFilter('company', operator, c));
      })
    }

    it(`search parameters should match expected dialect`, async () => {
      const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);
       
      assert.deepEqual(pm.toJson(DialectType.LuceneAzure), {
        queryType: 'simple',
        search: 'main*',
        filter: '',
        facets: [],
        top: 100,
        count: true,
        skip: 0
      });
    });

    it(`search parameters should match expected dialect - Simple Filter`, async () => {
      const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);

      const filters = createSimpleFilters(['microsoft', 'google', 'nvidia'], FilterOperator.Equal);
      pm.filters.set(filters);

      assert.deepEqual(pm.toJson(DialectType.LuceneAzure), {
        queryType: 'simple',
        search: 'main*',
        filter: "((company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
        facets: [],
        top: 100,
        count: true,
        skip: 0
      });
    });

    it(`search parameters should match expected dialect - Composite Filter`, async () => {
      const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);

      const filters = createSimpleFilters(['microsoft', 'google', 'nvidia'], FilterOperator.Equal);
      pm.filters.set(new CompositeFilter(filters, AndOr.Or));

      assert.deepEqual(pm.toJson(DialectType.LuceneAzure), {
        queryType: 'simple',
        search: 'main*',
        filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')))",
        facets: [],
        top: 100,
        count: true,
        skip: 0
      });
    });

    it(`search parameters should match expected dialect - Complex Filter`, async () => {
      const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);

      const filters = createSimpleFilters(['microsoft', 'google', 'nvidia'], FilterOperator.Equal);
      pm.filters.set(new CompositeFilter(filters, AndOr.Or));
      pm.filters.set(filters);
      
      assert.deepEqual(pm.toJson(DialectType.LuceneAzure), {
        queryType: 'simple',
        search: 'main*',
        filter: "(((company eq 'microsoft') or (company eq 'google') or (company eq 'nvidia')) and (company eq 'microsoft') and (company eq 'google') and (company eq 'nvidia'))",
        facets: [],
        top: 100,
        count: true,
        skip: 0
      });
    });
  })

  describe(`Dialect: ${DialectType.Mango}`, () => {
  });
});

describe('SearchService', () => {
  it('search results should match expectations', async () => {
    const pm = new SearchQueryParameters('property', 'main*', 0, 0, 100);

    const ss = new SearchDataAccessService();
    const pg: SearchResultPage = (await ss.get(pm));

    assert.isTrue(pg.value.data.rows.size === 3);
  });
});

describe('SearchSuggestionService', () => {
  it('fetch search suggestion results', async () => {
    const ss = new SearchSuggestionDataAccessService();
    const pm = new SearchSuggestionQueryParameters('property', 'address', 'main*');
    const pg: SearchSuggestionResultPage = (await ss.get(pm));

    assert.isTrue(pg.value.data.rows.size === 10);
  });
});

