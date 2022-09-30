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













app.use("/", express.static("fe"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
