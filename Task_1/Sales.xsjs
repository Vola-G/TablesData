const selectSalesData = 'SELECT * FROM "_SYS_BIC"."training.vhrakholskaya.Task_1/CV_CUBE_Petshop_Sales"';

const close = (closables) => {
    let closable;
    for (let i = 0; i < closables.length; i++) {
        closable = closables[i];
        if (closable) {
            closable.close();
        }
    }
}

const getSalesOrders = () => {
    const shopsList = [];
    const connection = $.db.getConnection();
    let statement = null;
    let resultSet = null;
    try {
        statement = connection.prepareStatement(selectSalesData);
        resultSet = statement.executeQuery();
        let salesData;

        while (resultSet.next()) {
            salesData = {};
            salesData.id = resultSet.getDouble(1);
            salesData.year = resultSet.getDouble(2);
            salesData.month = resultSet.getDouble(3);
            salesData.day = resultSet.getDouble(4);
            salesData.shop = resultSet.getString(5);
            salesData.country = resultSet.getString(6);
            salesData.products = resultSet.getString(7);
            salesData.type = resultSet.getString(8);
            salesData.price = resultSet.getDouble(9);
            salesData.amount = resultSet.getDouble(10);
            shopsList.push(salesData);
        }
    } finally {
        close([resultSet, statement, connection]);
    }
    return shopsList.sort(function (a, b) {
        return a.id - b.id
    });
}

const doGet = () => {
    try {
        $.response.contentType = "application/json";
        $.response.setBody(JSON.stringify(getSalesOrders()));
    }
    catch (err) {
        $.response.contentType = "text/plain";
        $.response.setBody("Error while executing query: [" + err.message + "]");
        $.response.returnCode = 200;
    }
}

doGet();