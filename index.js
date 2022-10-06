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

app.post("/api/actualizarProductos", async (req, res) => {
  const productos = req.body;
  //

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
