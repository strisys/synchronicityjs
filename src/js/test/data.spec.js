"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
let id = 0;
const generateData = (searchExpression = '') => {
    const data = [];
    if (searchExpression.indexOf('property') > -1) {
        data.push({ PropertyID: (++id), PropertyCode: '83029801', PropertyAddress1: '8302 E 106th Ter Kansas City, MO 64134', ZipCode: '64134', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2019-02-24', ReadyDays: 10, SubMarketName: 'Chicago', SalesForceID: 'a0AE000000F2vKDMAZ', SalesForceCode: 3000466, GeoZoneColorValue: 'Yellow', IsFreeRent: false, IsComingSoon: false, IsNewConstruction: false, UpdateTime: new Date() });
        data.push({ PropertyID: (++id), PropertyCode: '98189801', PropertyAddress1: '9818 NW 87th Ter Kansas City, MO 64153', ZipCode: '64153', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000NSWlrEAH', SalesForceCode: 4053361, GeoZoneColorValue: 'Red', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false });
        data.push({ PropertyID: (++id), PropertyCode: '18379801', PropertyAddress1: '1837 E 152nd Cir Olathe, KS 66062', ZipCode: '66062', UnitStatus: 'Vacant Unrented Ready', ReadyDate: '2018-11-26', ReadyDays: 100, SubMarketName: 'Kansas City', SalesForceID: 'a0A4400000OKZj7EAH', SalesForceCode: 4053649, GeoZoneColorValue: 'Green', IsFreeRent: true, IsComingSoon: false, IsNewConstruction: false });
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
};
describe('DataTable', function () {
    it('kitchen sink testing for hydrated datatable', function () {
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
    it('merge datatable happy day', function () {
        // assemble
        const dtA = __1.DataTable.from(generateData('property'), 'PropertyID');
        const dtB = __1.DataTable.from(generateData('property'), 'PropertyID');
        const dtC = __1.DataTable.from(generateData('property'), 'PropertyID');
        // act
        const com = __1.DataTable.merge([dtA, dtB, dtC]);
        // assert
        chai_1.assert.isTrue(com.columns.equals((dtA.columns)));
        chai_1.assert.equal(com.rows.size, (dtA.rows.size + dtB.rows.size + dtC.rows.size));
    });
});
describe('PivotCellUrl', function () {
    it('should be able to crate a basic url based on the parts', function () {
        // Arrange/ Act / Assert
        chai_1.expect((new __1.PivotDataCellUrl(['a', 'b', 'c'])).value).to.be.eq('/root/a/b/c');
    });
});
describe('PivotDataService', function () {
    it('should create composite structure based on specified datatable', function () {
        // Arrange
        const rowdata = generateData('risk');
        const sourceData = __1.DataTable.from(rowdata, 'id');
        const pds = new __1.PivotDataService();
        const fieldSpecs = [{ 'fund': 'column' }, { 'security': 'column' }];
        pds.specification.fields.set(fieldSpecs);
        const dfSpecs = [{ 'mv': null }];
        pds.specification.dataFields.set(dfSpecs);
        // Act
        const result = pds.execute(sourceData);
        // Assert
        chai_1.expect(result).to.be.not.null;
        chai_1.expect(result.root).to.be.not.null;
        chai_1.expect(result.sourceData).to.be.eq(sourceData);
        chai_1.expect(result.root.rows.length).to.be.eq(sourceData.rows.size);
        const nodeA = result.root.components.get(__1.PivotDataCellUrl.createValue(['hm']));
        chai_1.expect(nodeA).to.be.not.null;
        chai_1.expect(nodeA.rows.length).to.be.eq(9);
        const nodeAA = nodeA.components.get(__1.PivotDataCellUrl.createValue(['hm', 'ch']));
        chai_1.expect(nodeAA).to.be.not.null;
        chai_1.expect(nodeAA.rows.length).to.be.eq(9);
        const nodeB = result.root.components.get(__1.PivotDataCellUrl.createValue(['xm']));
        chai_1.expect(nodeB).to.be.not.null;
        chai_1.expect(nodeB.rows.length).to.be.eq(5);
        const nodeBB = nodeB.components.get(__1.PivotDataCellUrl.createValue(['xm', 'ch']));
        chai_1.expect(nodeBB).to.be.not.null;
        chai_1.expect(nodeBB.rows.length).to.be.eq(5);
    });
    it('should calculate the correct value based function and the input values in the specified datatable ', function () {
        // Arrange
        const sourceData = __1.DataTable.from(generateData('risk'), 'id');
        const pds = new __1.PivotDataService();
        pds.specification.fields.set([{ 'fund': 'column' }, { 'status': 'column' }]);
        pds.specification.dataFields.set([{ 'mv': __1.PivotDataCellCalcSumFn }, { 'repo': __1.PivotDataCellCalcSumFn }]);
        // Act
        const result = pds.execute(sourceData);
        // Assert
        const nodeA = result.root.components.get(__1.PivotDataCellUrl.createValue(['hm']));
        const valA = nodeA.values.get('mv');
        chai_1.expect(valA).to.be.eq(45);
        const nodeAA = nodeA.components.get(__1.PivotDataCellUrl.createValue(['hm', 'i']));
        const valAA = nodeAA.values.get('repo');
        chai_1.expect(valAA).to.be.eq(10);
        const nodeB = result.root.components.get(__1.PivotDataCellUrl.createValue(['xm']));
        const valB = nodeB.values.get('mv');
        chai_1.expect(valB).to.be.eq(60);
        const nodeBB = nodeB.components.get(__1.PivotDataCellUrl.createValue(['xm', 'i']));
        const valBB = nodeBB.values.get('repo');
        chai_1.expect(valBB).to.be.eq(60);
    });
});
//# sourceMappingURL=data.spec.js.map