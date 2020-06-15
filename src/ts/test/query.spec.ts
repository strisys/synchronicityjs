import { assert } from 'chai';
import { DataTable, RowData, Cell } from '../query';

const generateData = (searchExpression = ''): RowData[] => {
  const data = [];

  if (searchExpression.indexOf('property') > -1) {
    data.push({ PropertyID: 31133, PropertyCode: '83029801', PropertyAddress1: '8302 E 106th Ter Kansas City, MO 64134', ZipCode: '64134', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2019-02-24', ReadyDays: 10, SubMarketName: 'Chicago', SalesForceID: 'a0AE000000F2vKDMAZ', SalesForceCode: 3000466, GeoZoneColorValue: 'Yellow', IsFreeRent: false, IsComingSoon: false, IsNewConstruction: false, UpdateTime: new Date()  });
    data.push({ PropertyID: 85130, PropertyCode: '98189801', PropertyAddress1: '9818 NW 87th Ter Kansas City, MO 64153', ZipCode: '64153', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000NSWlrEAH', SalesForceCode: 4053361, GeoZoneColorValue: 'Red', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
    data.push({ PropertyID: 85252, PropertyCode: '18379801', PropertyAddress1: '1837 E 152nd Cir Olathe, KS 66062', ZipCode: '66062', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000OKZj7EAH', SalesForceCode: 4053649, GeoZoneColorValue: 'Green', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
  }

  return data;
}

describe('DataTable', () => {
  it('kitchen sink testing for hydrated datatable', () => {
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

        let dataVal = Cell.coerce(rowdata[r][columnName]);
        assert.equal(cell.value, dataVal, `column:=${columnName},row:=${r}`);
        assert.equal(row[columnName], dataVal, columnName);
      }
    }
  });
});