import { assert, expect } from 'chai';
import { DataTable, RowData, Cell, DataFieldSpec, FieldSpec, PivotDataService, PivotDataCell, PivotDataCellUrl, PivotDataResult, PivotDataCellCalcContext, PivotDataCellCalcSumFn } from '../';

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
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'c', strategy3: 'c', strategy4: 'c', asset: 'c', mv: 1, repo: 1, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 2, repo: 2, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 3, repo: 3, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'p', strategy4: 'o', asset: 'n', mv: 4, repo: 4, dv01: 0.0 });
  
    reportDate = new Date('2021-03-01');
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'n', strategy1: 'h', strategy2: 'c', strategy3: 'c', strategy4: 'c', asset: 'c', mv: 5, repo: 5, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'n', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 6, repo: 6, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'n', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 7, repo: 7, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'n', strategy1: 'h', strategy2: 'u', strategy3: 'p', strategy4: 'o', asset: 'n', mv: 8, repo: 8, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'hm', security: 'ch', status: 'n', strategy1: 'h', strategy2: 'n', strategy3: 'n', strategy4: 'o', asset: 'n', mv: 9, repo: 9, dv01: 0.0 });
  
    reportDate = new Date('2021-03-02');
    data.push({ id: (++id), date: reportDate, fund: 'xm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'c', strategy3: 'c', strategy4: 'c', asset: 'c', mv: 10, repo: 10, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'xm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 11, repo: 11, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'xm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'h', strategy4: 'h', asset: 'n', mv: 12, repo: 12, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'xm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'u', strategy3: 'p', strategy4: 'o', asset: 'n', mv: 13, repo: 13, dv01: 0.0 });
    data.push({ id: (++id), date: reportDate, fund: 'xm', security: 'ch', status: 'i', strategy1: 'h', strategy2: 'n', strategy3: 'n', strategy4: 'o', asset: 'n', mv: 14, repo: 14, dv01: 0.0 });
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
  it('should create composite structure based on specified datatable', function() {
    // Arrange
    const rowdata = generateData('risk');
    const sourceData = DataTable.from(rowdata, 'id');

    const pds = new PivotDataService();
    const fieldSpecs: FieldSpec[] = [{ 'fund': 'column' }, { 'security': 'column' }];
    pds.specification.fields.set(fieldSpecs);

    const dfSpecs: DataFieldSpec[] = [{ 'mv': null }];
    pds.specification.dataFields.set(dfSpecs);

    // Act
    const result: PivotDataResult = pds.execute(sourceData);

    // Assert
    expect(result).to.be.not.null;
    expect(result.root).to.be.not.null;
    expect(result.sourceData).to.be.eq(sourceData);

    expect(result.root.rows.length).to.be.eq(sourceData.rows.size);

    const nodeA = result.root.components.get(PivotDataCellUrl.createValue(['hm']));
    expect(nodeA).to.be.not.null;
    expect(nodeA.rows.length).to.be.eq(9);

    const nodeAA = nodeA.components.get(PivotDataCellUrl.createValue(['hm', 'ch']));
    expect(nodeAA).to.be.not.null;
    expect(nodeAA.rows.length).to.be.eq(9);

    const nodeB = result.root.components.get(PivotDataCellUrl.createValue(['xm']));
    expect(nodeB).to.be.not.null;
    expect(nodeB.rows.length).to.be.eq(5);

    const nodeBB = nodeB.components.get(PivotDataCellUrl.createValue(['xm', 'ch']));
    expect(nodeBB).to.be.not.null;
    expect(nodeBB.rows.length).to.be.eq(5);
  });

  it('should calculate the correct value based on the function and the input values in the specified datatable', function() {
    // Arrange
    const pds = new PivotDataService();
    pds.specification.fields.set([{ 'fund': 'column' }, { 'status': 'column' }]);
    pds.specification.dataFields.set([{ 'mv': PivotDataCellCalcSumFn }, { 'repo': PivotDataCellCalcSumFn }]);

    // Act
    const root = pds.execute(DataTable.from(generateData('risk'), 'id')).root;

    // Assert
    const nodeA = root.components.get(PivotDataCellUrl.create(['hm']).value);
    expect(nodeA.values.get('mv')).to.be.eq(45);

    const nodeAA = nodeA.components.get(PivotDataCellUrl.create(['hm', 'i']).value);
    expect(nodeAA.values.get('repo')).to.be.eq(10);

    const nodeB = root.components.get(PivotDataCellUrl.create(['xm']).value);
    expect(nodeB.values.get('mv')).to.be.eq(60);

    const nodeBB = nodeB.components.get(PivotDataCellUrl.create(['xm', 'i']).value);
    expect(nodeBB.values.get('repo')).to.be.eq(60);
  });

  it('should be able to write composite structure to a datatable', function() {
    // Arrange
    const pds = new PivotDataService();
    pds.specification.fields.set([{ 'fund': 'column' }, { 'status': 'column' }]);
    pds.specification.dataFields.set([{ 'mv': PivotDataCellCalcSumFn }, { 'repo': PivotDataCellCalcSumFn }]);

    // Act
    const value: DataTable = pds.execute(DataTable.from(generateData('risk'), 'id')).value;

    // Assert
    expect(value).to.be.not.null;
    expect(value.rows.size).to.be.eq(3);
  });
});