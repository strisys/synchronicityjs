import { Enum } from './entity';

export class EntityQueryParameters {
  public static readonly Null: EntityQueryParameters = new EntityQueryParameters(0, 0, '');

  private _pageNumber: number;
  private _pageSize: number;
  private _searchString: string;
  private _previous: EntityQueryParameters;

  constructor(pageNumber: number, pageSize: number, searchString: string = null, previous: EntityQueryParameters = null) {
    this._pageNumber = pageNumber;
    this._pageSize = pageSize;
    this._searchString = (searchString || '');
    this._previous = (previous || EntityQueryParameters.Null);
  }

  public get isNull(): boolean {
    return (this === EntityQueryParameters.Null);
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get pageNumber(): number {
    return this._pageNumber;
  }

  public get searchString(): string {
    return (this._searchString || '');
  }

  public set searchString(value: string) {
    this._searchString = (value || '');
  }

  public get previous(): EntityQueryParameters {
    return (this._previous || EntityQueryParameters.Null);
  }

  public static default(): EntityQueryParameters {
    return (new EntityQueryParameters(1, 10));
  }

  public changePage(pageNumber: number): EntityQueryParameters {
    return (new EntityQueryParameters(pageNumber, this.pageSize, this.searchString, this.clone()));
  }

  public changeSize(pageSize: number): EntityQueryParameters {
    return (new EntityQueryParameters(this.pageNumber, pageSize, this.searchString, this.clone()));
  }

  public changeSearchString(searchString: string): EntityQueryParameters {
    return (new EntityQueryParameters(this.pageNumber, this.pageSize, searchString, this.clone()));
  }

  public toJsonObject = (): { [key:string]: (string | number) } => {
    return {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchString: this.searchString
    };
  }

  public clone = (): EntityQueryParameters => {
    return (new EntityQueryParameters(this.pageNumber, this.pageSize, this.searchString, this.previous));
  }

  public toString(): string {
    return `pageSize:=${this.pageSize},pageNumber:=${this.pageNumber},searchString:=${this.searchString}`;
  }
}

export class EntityQueryPage<T> {
  private readonly _queryParameters: EntityQueryParameters;
  private readonly _totalRows: number;
  private readonly _previousUrl: string;
  private readonly _nextUrl: string;
  private readonly _value: T;

  constructor(queryParameters: EntityQueryParameters, value: T, totalRows: number = null, previousUrl = '', nextUrl = '') {
    this._queryParameters = queryParameters;
    this._value = value;
    this._totalRows = totalRows;
    this._previousUrl = previousUrl;
    this._nextUrl = nextUrl;
  }

  public get queryParameters(): EntityQueryParameters {
    return this._queryParameters;
  }

  public get value(): T {
    return (this._value || null);
  }

  public get totalRows(): number {
    return (this._totalRows || null);
  }

  public get previousUrl(): string {
    return (this._previousUrl || '');
  }

  public get nextUrl(): string {
    return (this._nextUrl || '');
  }
}

export type PageDirectionCode = ('Previous' | 'Next' | '');

export class PageDirection extends Enum<PageDirection> {
  private static readonly TypeName: string = 'PageDirection';
  public static readonly None: PageDirection = new PageDirection('0', '');
  public static readonly Previous: PageDirection = new PageDirection('1', 'Previous');
  public static readonly Next: PageDirection = new PageDirection('2', 'Next');

  private constructor(id: string, value: PageDirectionCode) {
    super(PageDirection.TypeName, id, value);
  }

  public get isPrevious(): boolean {
    return this.is(PageDirection.Previous);
  }

  public get isNext(): boolean {
    return this.is(PageDirection.Next);
  }

  public static tryParse(keyOrValue: (string | PageDirectionCode)): PageDirection {
    return (PageDirection.attemptParse(PageDirection.TypeName, keyOrValue) || PageDirection.None);
  }

  public static get entries(): PageDirection[] {
    return (PageDirection.getEntries(PageDirection.TypeName) as PageDirection[]);
  }

  public static get keys(): string[] {
    return PageDirection.getKeys(PageDirection.TypeName);
  }

  public static get values(): PageDirectionCode[] {
    return (PageDirection.getValues(PageDirection.TypeName) as PageDirectionCode[]);
  }

  public static forEach(fn: (value: PageDirection, index: number) => void): void {
    PageDirection.forEachOne(PageDirection.TypeName, fn);
  }
}
