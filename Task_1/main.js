const odataLink = 'Sales.xsodata/sales?$format=json';
const xsjsLink = 'Sales.xsjs';
let headerData = [];

const start = (e) => {
    checkTableExist();
    if (e.target.value == 'odata') {
        appStart(odataLink);
    } else if (e.target.value == 'xsjs') {
        appStart(xsjsLink);
    }
}

async function appStart(link) {
    const salesData = await getSalesData(link);
    renderSalesDataTable(salesData);
}

async function getSalesData(link) {
    const url = 'http://sndbx:8006/training/vhrakholskaya/Task_1/' + link;
    const responce = await fetch(url);
    let salesData = await responce.json();
    if (link == odataLink) {
        headerData = Object.keys(salesData.d.results[0]).slice(1);
        salesData = salesData.d.results.map(data => Object.values(data).slice(1));
        return salesData;
    } else {
        headerData = Object.keys(salesData[0]);
        salesData = salesData.map(data => Object.values(data));
        console.log(salesData);
        return salesData;
    }
}

const renderSalesDataTable = (salesData) => {
    const table = document.createElement('table');
    document.body.appendChild(table);
    table.classList.add('uk-table', 'uk-table-hover', 'uk-table-divider');
    table.style.cssText = "width: 98%;  margin: auto;";

    const tableHead = document.createElement('thead');
    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    tableHead.insertAdjacentElement('afterend', tableBody);

    renderTableHeader(tableHead);
    renderTableBody(salesData, tableBody);
}

const renderTableHeader = (tableHead) => {
    const mappedHeaderData = headerData.map(header => `<th>${header.toUpperCase()}</th>`).join('');
    const header = `<tr>${mappedHeaderData}</tr>`;
    tableHead.innerHTML = header;
};

const renderTableBody = (data, tableBody) => {
    const mappedData = data.map(dataRow => {
        tableBody.appendChild(renderRow(dataRow));
    });
}

const renderRow = (data) => {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';
    row.innerHTML = renderCell(data);
    return row;
}

const renderCell = (data) => {
    const dataCell = data.map(dataCell => `<td>${dataCell}</td>`).join('');
    return dataCell;
}

const checkTableExist = () => {
    if(document.body.contains(document.getElementsByTagName('table')[0])){
        document.getElementsByTagName('table')[0].remove();
    } else {
        return;
    }
}
