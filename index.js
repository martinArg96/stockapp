const express = require("express");
const bodyParser = require("body-parser");
const repository = require("./repository");
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true })); // para body parser
app.use(bodyParser.json());

app.get("/api/products", async (req, res) => {
  res.send(await repository.read());
});

app.post("/api/entradaProductosOrden", async (req, res) => {
  
  const carritoEntradaComun = req.body;
  console.log('carritoEntrada:', carritoEntradaComun)
  
  // ORDEN DE ENTRADA
  
  let orderEntrada = {
    items: ["prueba entrada comun"],
    date  : 0,
    cantidad: 0,
    precioTotalVenta: 0
  } 

  orderEntrada.items = JSON.stringify(carritoEntradaComun)
  orderEntrada.date = orderEntrada.date = new Date().toISOString()
  carritoEntradaComun.forEach((element) => {
    orderEntrada.precioTotalVenta += element.precio * element.cantidad

  }
    );
  let orders = await repository.readOrders();
  console.log('orders:', orders)

  orders.push(orderEntrada)
  
  console.log('orders mas la nueva:', orders)
  
  
  await repository.writeOrders(orders)

  
  
  res.send(orders);
});


app.post("/api/enviarOrdenDeEntrada", async (req, res) => {
  
  const carritoEntrada = req.body;
  console.log('carritoEntrada:', carritoEntrada)
  
  // ORDEN DE ENTRADA
  
  let orderEntrada = {
    items: ["prueba"],
    date  : 0,
    cantidad: 0,
    precioTotalVenta: 0
  } 

  orderEntrada.items = JSON.stringify(carritoEntrada)
  orderEntrada.date = orderEntrada.date = new Date().toISOString()
  carritoEntrada.forEach((element) => {
    orderEntrada.precioTotalVenta += element.precio * element.stock

  }
    );
  let orders = await repository.readOrders();
  console.log('orders:', orders)

  orders.push(orderEntrada)
  
  console.log('orders mas la nueva:', orders)
  
  
  await repository.writeOrders(orders)

  
  
  res.send(orders);
});




app.post("/api/actualizarProductos", async (req, res) => {
  
  const productos = req.body;
 
  await repository.write(productos);
  const productsCopy = await repository.read();
  res.send(productsCopy);
});

app.post("/api/venta", async (req, res) => {
  try{
  let orderVenta = {
    items: [],
    totalPrecioVenta: 0,
    fecha: "fecha",
  } 

  let orders = await repository.readOrdersSalida();

  
    let carritoVenta = req.body;
    console.log('carritoVenta:', carritoVenta)
    
    let productsCopy = await repository.read();

    carritoVenta.forEach((element) => {
      console.log( "element", element)

      orderVenta.totalPrecioVenta += element.precio*element.cantidad;
      orderVenta.items.push(element);
      console.log("orderVenta:", orderVenta);
    });


    carritoVenta.forEach((element) => {
      let productoBuscado = productsCopy.find(
        (p) => p.codigo === element.codigo
      );

      let index = productsCopy.indexOf(productoBuscado);
      productsCopy[index].precio = element.precio;
      productsCopy[index].stock = element.stock - element.cantidad;
    });
    orderVenta.items= JSON.stringify(orderVenta.items)
    orderVenta.fecha = new Date().toISOString();
    orders.push(orderVenta);
    console.log("orders antes de mandarse a repositorio", orders);
    await repository.writeOrdersSalida(orders);

    await repository.write(productsCopy);
    productsCopy = await repository.read();
    res.send(productsCopy);
    orderVenta = {
      items: [],
      totalPrecioVenta: 0,
      fecha: "fecha",
    }
  }
  catch{
    console.log("falla en la venta")
    res.send("Error")
  }
 
});

app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
