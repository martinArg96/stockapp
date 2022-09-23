const express = require("express")
const bodyParser = require("body-parser") //para poder acceder albody al hacer post
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true })); // para body parser
app.use(bodyParser.json());  //para body oparser

//products seria = stock thor market
const products = [
    {
        codigo:7790070228666,
        descripcion: "Aceite Rocio Vegetal Clasico Aerosol Cocinero 120 Gr",
        rubro: 1,
        subrubro: 7,
        precio: 0,
        cantidad: 0

    },
    {
        codigo:7790060023684,
        descripcion: "Aceite De Girasol Cocinero 1.5 Lt",
        rubro: 1,
        subrubro: 7,
        precio: 0,
        cantidad: 0

    }
]

app.post("/api/pay",(req,res) => {
    console.log(req.body)
    res.send(products);
})

app.get('/api/products', (req, res) => {
  res.send(products)
})

app.use("/", express.static("fe"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


