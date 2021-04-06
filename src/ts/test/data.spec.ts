import { assert, expect } from 'chai';
import { DataTable, RowData, Cell, DataFieldSpec, FieldSpec, PivotDataService, PivotDataCell, PivotDataCellUrl } from '../';

let id = 0;

const generateData = (searchExpression = ''): RowData[] => {
  const data = [];

  if (searchExpression.indexOf('property') > -1) {
    data.push({ PropertyID: (++id), PropertyCode: '83029801', PropertyAddress1: '8302 E 106th Ter Kansas City, MO 64134', ZipCode: '64134', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2019-02-24', ReadyDays: 10, SubMarketName: 'Chicago', SalesForceID: 'a0AE000000F2vKDMAZ', SalesForceCode: 3000466, GeoZoneColorValue: 'Yellow', IsFreeRent: false, IsComingSoon: false, IsNewConstruction: false, UpdateTime: new Date()  });
    data.push({ PropertyID: (++id), PropertyCode: '98189801', PropertyAddress1: '9818 NW 87th Ter Kansas City, MO 64153', ZipCode: '64153', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000NSWlrEAH', SalesForceCode: 4053361, GeoZoneColorValue: 'Red', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
    data.push({ PropertyID: (++id), PropertyCode: '18379801', PropertyAddress1: '1837 E 152nd Cir Olathe, KS 66062', ZipCode: '66062', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000OKZj7EAH', SalesForceCode: 4053649, GeoZoneColorValue: 'Green', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
  }

  if (searchExpression.indexOf('risk') > -1) {
    let reportDate = new Date('2021-02-24');
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'c', strategy3: 'c', strategy4: 'c', asset: 'c', mv: 69190, repo: 0.0, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 218206, repo: 0.0, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 840833411, repo: 543146579, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'p', strategy4: 'o', asset: 'n', mv: 12124105, repo: 0.0, dv01: 0.0 });
  
    reportDate = new Date('2021-03-01');
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'c', strategy3: 'c', strategy4: 'c', asset: 'c', mv: 69190, repo: 0.0, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 201684, repo: 0.0, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 835740618, repo: 534255894, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'p', strategy4: 'o', asset: 'n', mv: 11925647, repo: 0.0, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'n', strategy3: 'n', strategy4: 'o', asset: 'n', mv: -1774228, repo: 0.0, dv01: 0.0 });
  }

  return data;
}

describe('DataTable', function() {
  it('kitchen sink testing for hydrated datatable', function() {
    const rowdata = generateData('property');
    const datatable = DataTable.from(rowdata, 'PropertyID');
    const columnNames = Object.keys(rowdata[0]);
    const pk = columnNames[0];

    // columns
    assert.equal(datatable.columns.size, columnNames.length);

    columnNames.forEach((k) => {
      const column = datatable.columns.get(k);
      assert.isNotNull(column);
      assert.isNotNull(column.type);
      assert.equal(column.name, k);
      assert.isFalse(column.isNull);
      assert.isTrue(datatable.columns.has(k));
    });
    
    // rows
    assert.equal(datatable.rows.size, rowdata.length);
    
    for(let r = 0; (r < rowdata.length); r++) {
      const pkVal = rowdata[r][pk].toString();
      const row = datatable.rows.get(pkVal)

      assert.isNotNull(row);

      for(const columnName of columnNames) {
        const cell = row.cells.get(columnName);
        assert.isNotNull(cell);
        assert.isTrue(cell === row.cells.get(columnName));
        assert.equal(cell.column.name, columnName);

        const dataVal = Cell.coerce(rowdata[r][columnName]);
        assert.equal(cell.value, dataVal, `column:=${columnName},row:=${r}`);
        assert.equal(row[`@query.${columnName}`], dataVal, columnName);
      }
    }
  });

  it('merge datatable happy day', function() {
    // assemble
    const dtA = DataTable.from(generateData('property'), 'PropertyID');
    const dtB = DataTable.from(generateData('property'), 'PropertyID');
    const dtC = DataTable.from(generateData('property'), 'PropertyID');

    // act
    const com = DataTable.merge([dtA, dtB, dtC]);

    // assert
    assert.isTrue(com.columns.equals((dtA.columns)));
    assert.equal(com.rows.size, (dtA.rows.size + dtB.rows.size + dtC.rows.size));
  });
});

describe('PivotCellUrl', function() {
  it('should be able to crate a basic url based on the parts', function() {
    // Arrange/ Act / Assert
    expect((new PivotDataCellUrl(['a', 'b', 'c'])).value).to.be.eq('/root/a/b/c');
  });
});

describe('PivotDataService', function() {
  it('should do basic summation based on specified criteria', function() {
    // Arrange
    const rowdata = generateData('risk');
    const datatable = DataTable.from(rowdata, 'id');

    const pds = new PivotDataService();
    const fieldSpecs: FieldSpec[] = [{ 'date': 'column' }, { 'fund': 'column' }, { 'security': 'column' }];
    pds.specification.fields.set(fieldSpecs);

    const dfSpecs: DataFieldSpec[] = [{ 'mv': () => 1 }];
    pds.specification.dataFields.set(dfSpecs);

    // Act
    const root: PivotDataCell = pds.execute(datatable)

    // Assert
    expect(root).to.be.not.null;

  });
});