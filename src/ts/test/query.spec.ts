import { assert } from 'chai';
import { DataTable, DataTableColumnMap, RowData } from '../query';

const generateData = (searchExpression = ''): RowData[] => {
  const data = [];

  if (searchExpression.indexOf('property') > -1) {
    data.push({ PropertyID: 31133, PropertyCode: '83029801', PropertyAddress1: '8302 E 106th Ter Kansas City, MO 64134', ZipCode: '64134', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2019-02-24', ReadyDays: 10, SubMarketName: 'Chicago', SalesForceID: 'a0AE000000F2vKDMAZ', SalesForceCode: 3000466, GeoZoneColorValue: 'Yellow', IsFreeRent: false, IsComingSoon: false, IsNewConstruction: false  });
    data.push({ PropertyID: 85130, PropertyCode: '98189801', PropertyAddress1: '9818 NW 87th Ter Kansas City, MO 64153', ZipCode: '64153', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000NSWlrEAH', SalesForceCode: 4053361, GeoZoneColorValue: 'Red', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
    data.push({ PropertyID: 85252, PropertyCode: '18379801', PropertyAddress1: '1837 E 152nd Cir Olathe, KS 66062', ZipCode: '66062', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000OKZj7EAH', SalesForceCode: 4053649, GeoZoneColorValue: 'Green', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false  });
  }

  return data;
}

const hydrate = (data: RowData[]): DataTable => {
  if ((!data) || (!data.length)) {
    return DataTable.Empty;
  }

  // Assume the column names are in the first row and the first cell is the primary key
  const columnNames = Object.keys(data[0]);
  const table = new DataTable(new DataTableColumnMap(columnNames, columnNames[0]));

  return table.rows.add(data).table;
}

describe('DataTable', () => {
  it('kitchen sink testing for hydrated datatable', () => {
    const data = generateData('property');
    const datatable = hydrate(data);

    // columns
    const columnNames = Object.keys(data[0]);
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
  });
});