const express = require("express");
const bodyParser = require("body-parser");
const repository = require("./repository");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true })); // para body parser
app.use(bodyParser.json()); //para body oparser

//products seria = stock thor market
let products = [
  // {
  //     codigo:7790070228666,
  //     descripcion: "Aceite Rocio Vegetal Clasico Aerosol Cocinero 120 Gr",
  //     rubro: 1,
  //     subrubro: 7,
  //     precio: 0,
  //     stock: 20
  // },
  // {
  //     codigo:7790060023684,
  //     descripcion: "Aceite De Girasol Cocinero 1.5 Lt",
  //     rubro: 1,
  //     subrubro: 7,
  //     precio: 0,
  //     stock: 20
  // }
];

app.get("/api/products", async (req, res) => {
  res.send(await repository.read());
});

app.get("/api/productsGlobales", async (req, res) => {
  res.send(await repository.readGlobalProducts());
});

app.get("/api/orders", async (req, res) => {
  res.send(await repository.readOrders());

});
// app.post("/api/pay", async (req, res) => {
//   const codigos = req.body;
//   const procutsCopy = await repository.read();
//   codigos.forEach((codigo) => {
//     const product = procutsCopy.find((p) => p.codigo === codigo);

//     product.stock--;
//   });
//   await repository.write(productsCopy);
// es.send(productsCopy)
//   products = procutsCopy;
// //   res.send(products);
// });

app.post("/api/orders",async (req,res)=> {    //ordenes de entrada
  let order = req.body
  let orders = await repository.readOrders();
  order = {
    items: order.items,
    fecha: new Date().toISOString(),
  }
  orders.push(order)
  await repository.writeOrders(orders)
  res.send(orders)
})

app.post("/api/ordersSalida",async (req,res)=> {    //ordenes de entrada
  let order = req.body
  let orders = await repository.readOrdersSalida();
  order = {
    items: order.items,
    fecha: new Date().toISOString(),
  }
  orders.push(order)
  await repository.writeOrdersSalida(orders)
  res.send(orders)
})




app.post("/api/pay", async (req, res) => {
    const codigos = req.body;
    const productsCopy = await repository.read();
  
    let error = false;
    codigos.forEach((codigo) => {
      const product = productsCopy.find((p) => p.codigo === codigo);
      if (product.stock > 0) {
        product.stock--;
      } else {
        error = true;
      }
    });
  
    if (error) {
      res.send("Sin stock").statusCode(400);
    }
    else {
      await repository.write(productsCopy);
      res.send(productsCopy);
    }
  });

  app.post("/api/entrarProducto", async (req, res) => {
    const codigos = req.body;
    const productsCopy = await repository.read();
    
    let error = false;
    codigos.forEach((codigo) => {
      const product = productsCopy.find((p) => p.codigo === codigo);
      if (product.stock > 0) {
        product.stock++;
      } else {
        error = true;
      }
    });
  
    if (error) {
      res.send("error al agregar producto").statusCode(400);
    }
    else {
      // let order = {
      //   productsInOrder: [...codigos],
      //   fecha: new Date().toISOString(),
      // }
      // console.log("estae s una orden actual" + order)
      // const orders= await repository.readOrders()
      // orders.push(order)
      // console.log("esta son las ordenes: " +orders)
      // await repository.writeOrders(orders)

      await repository.write(productsCopy);
      res.send(productsCopy);
      
    }
  });

  app.post("/api/agregarProductoNuevo", async (req, res) => {
    const newProduct = req.body;
    const productsCopy = await repository.read();
  
     
      productsCopy.push(newProduct)
      await repository.write(productsCopy);
      res.send(productsCopy);
      
    }
  );

  app.post("/api/reemplazarProducto", async (req, res) => {
    const newProductList = req.body;
    
  
     
      
      await repository.write(newProductList);
      res.send(newProductList);
      
    }
  );




  






app.use("/", express.static("fe"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
