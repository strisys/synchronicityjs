"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
const generateData = (searchExpression = '') => {
    const data = [];
    if (searchExpression.indexOf('property') > -1) {
        data.push({ PropertyID: 31133, PropertyCode: '83029801', PropertyAddress1: '8302 E 106th Ter Kansas City, MO 64134', ZipCode: '64134', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2019-02-24', ReadyDays: 10, SubMarketName: 'Chicago', SalesForceID: 'a0AE000000F2vKDMAZ', SalesForceCode: 3000466, GeoZoneColorValue: 'Yellow', IsFreeRent: false, IsComingSoon: false, IsNewConstruction: false, UpdateTime: new Date() });
        data.push({ PropertyID: 85130, PropertyCode: '98189801', PropertyAddress1: '9818 NW 87th Ter Kansas City, MO 64153', ZipCode: '64153', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000NSWlrEAH', SalesForceCode: 4053361, GeoZoneColorValue: 'Red', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false });
        data.push({ PropertyID: 85252, PropertyCode: '18379801', PropertyAddress1: '1837 E 152nd Cir Olathe, KS 66062', ZipCode: '66062', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000OKZj7EAH', SalesForceCode: 4053649, GeoZoneColorValue: 'Green', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false });
    }
    return data;
};
describe('DataTable', () => {
    it('kitchen sink testing for hydrated datatable', () => {
        const rowdata = generateData('property');
        const datatable = __1.DataTable.from(rowdata, 'PropertyID');
        const columnNames = Object.keys(rowdata[0]);
        const pk = columnNames[0];
        // columns
        chai_1.assert.equal(datatable.columns.size, columnNames.length);
        columnNames.forEach((k) => {
            const column = datatable.columns.get(k);
            chai_1.assert.isNotNull(column);
            chai_1.assert.isNotNull(column.type);
            chai_1.assert.equal(column.name, k);
            chai_1.assert.isFalse(column.isNull);
            chai_1.assert.isTrue(datatable.columns.has(k));
        });
        // rows
        chai_1.assert.equal(datatable.rows.size, rowdata.length);
        for (let r = 0; (r < rowdata.length); r++) {
            const pkVal = rowdata[r][pk].toString();
            const row = datatable.rows.get(pkVal);
            chai_1.assert.isNotNull(row);
            for (const columnName of columnNames) {
                const cell = row.cells.get(columnName);
                chai_1.assert.isNotNull(cell);
                chai_1.assert.isTrue(cell === row.cells.get(columnName));
                chai_1.assert.equal(cell.column.name, columnName);
                const dataVal = __1.Cell.coerce(rowdata[r][columnName]);
                chai_1.assert.equal(cell.value, dataVal, `column:=${columnName},row:=${r}`);
                chai_1.assert.equal(row[`@query.${columnName}`], dataVal, columnName);
            }
        }
    });
});
//# sourceMappingURL=query.spec.js.map