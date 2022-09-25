const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./your-secret-key.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: auth });



async function read() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "StockThorMarket!A2:F",
  });

  const rows = response.data.values || [];//el OR es porque si la lista estaba vacia se romppia
  const products = rows.map((row) => ({
    codigo: +row[0],
    descripcion: row[1],
    rubro: +row[2],
    subrubro: +row[3],
    precio: +row[4],
    stock: +row[5]
  }));

  return products;
}
async function readGlobalProducts() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "Hoja1!A2:B6000",
  });

  const rows = response.data.values || [];//el OR es porque si la lista estaba vacia se romppia
  const productsGlobales = rows.map((row) => ({
    codigo: +row[0],
    descripcion: row[1],
    rubro: +row[2],
    subrubro: +row[3],
    precio: +row[4],
    stock: +row[5]
  }));

  return productsGlobales;
}



async function write(products) {
  let values = products.map((p) => [p.codigo, p.descripcion, p.rubro, p.subrubro, p.precio, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "StockThorMarket!A2:F",
    valueInputOption: "RAW",
    resource,
  });
}

async function writeOrders(orders) {
  let values = orders.map((order) => [
    order.items,
    order.fecha,
    
  ]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "EntradasThorMarket!A2:C",
    valueInputOption: "RAW",
    resource,
  });
}

async function readOrders() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "EntradasThorMarket!A2:C",
  });

  const rows = response.data.values || [];//el OR es porque si la lista estaba vacia se romppia
  const orders = rows.map((row) => ({
    productosOrden: row[0],
    date: row[1],
  }));

  return orders;
}
async function readOrdersSalida() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "SalidasThorMarket!A2:C",
  });

  

  const rows = response.data.values || [];//el OR es porque si la lista estaba vacia se romppia
  const orders = rows.map((row) => ({
    productosOrden: row[0],
    date: row[1],
  }));

  return orders;
}

async function writeOrdersSalida(orders) {
  let values = orders.map((order) => [
    order.items,
    order.fecha,
    
  ]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1gxp90SohhV0Yz_Mh4kLaEfBDxrN5HJ6I6ipz4fhcCgo",
    range: "SalidasThorMarket!A2:C",
    valueInputOption: "RAW",
    resource,
  });
}






async function updateOrderByPreferenceId(preferenceId, status) {
  const orders = await readOrders();
  const order = orders.find(o => o.preferenceId === preferenceId)
  order.status = status;
  await writeOrders(orders);
}

module.exports = {
  read,
  write,
  writeOrders,
  updateOrderByPreferenceId,
  readOrders,
  readGlobalProducts,
  readOrdersSalida,
  writeOrdersSalida,
  
};

