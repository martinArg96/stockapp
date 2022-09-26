let findProductByCodigoButton = "";
let miCarritoSinDuplicados = []
let productList = [];
let items = [];
let carrito = [];
let carritoEntrada = [];
let total = 0;
order = {
  items: [],
};

function habilitarEntradas() {
  document.getElementById("entrada-stock").classList.add("mostrar-flex");
  document.getElementById("salida-stock").classList.add("no-mostrar");
  document.getElementById("salida-stock").classList.remove("mostrar-flex");

  document.getElementById("checkoutSumarStock").classList.remove("no-mostrar");

  document.getElementById("checkout").classList.add("no-mostrar");
}
function habilitarSalidas() {
  document.getElementById("salida-stock").classList.add("mostrar-flex");
  document.getElementById("entrada-stock").classList.add("no-mostrar");
  document.getElementById("entrada-stock").classList.remove("mostrar-flex");

  document.getElementById("checkout").classList.remove("no-mostrar");

  document.getElementById("checkoutSumarStock").classList.add("no-mostrar");
}

function add(codigo) {
  console.log(codigo);
  carrito.push(codigo);
  //total = total + precio;
  document.getElementById(
    "checkout"
  ).innerHTML = `CONFIRMAR VENTA ${carrito.length}`;
}

function addEntrada(codigo) {
  console.log("entrada de " + codigo);
  carritoEntrada.push(codigo);
  const producto = productList.find((p) => p.codigo === codigo);
  items.push(producto);
  document.getElementById(
    "checkoutSumarStock"
  ).innerHTML = `CONFIRMAR ENTRADA STOCK ${carritoEntrada.length}`;
}

async function pay() {
  //metodo post al back
  try {
    const productList = await (
      await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(carrito),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  } catch {
    window.alert("falla funcion pay()");
  }
  enviarOrdenesSalida();

  carrito = [];
  total = 0;
  await fetchProducts();
  let codigo = document.getElementById("codigoByTecladoVENTA").valueAsNumber;
  findProductByCodigoVENTA(codigo);
  document.getElementById(
    "checkout"
  ).innerHTML = `CONFIRMAR VENTA: ${carrito.length}`;
}

async function entrarProducto() {
  //metodo post al back

//   let itemos = [...items];
//   let nombresDeProductos = [];
//   console.log(itemos);
//   itemos.forEach((element) => {
//     total += element.precio;

//     nombresDeProductos.push(element.descripcion);
//   });
items.forEach(element => {
    element.cantidad=1;
});


miCarritoSinDuplicados = items.reduce((acumulador, valorActual) => {
    const elementoYaExiste = acumulador.find(elemento => elemento.codigo === valorActual.codigo);
    if (elementoYaExiste) {
      return acumulador.map((elemento) => {
        if (elemento.codigo === valorActual.codigo) {
          return {
            ...elemento,
            cantidad: elemento.cantidad + valorActual.cantidad
          }
        }
  
        return elemento;
      });
    }
  
    return [...acumulador, valorActual];
  }, []);
  


let arreglo = miCarritoSinDuplicados
for(i = 0; i< arreglo.length ; i++){
    delete arreglo[i].codigo
    delete arreglo[i].subrubro
    delete arreglo[i].rubro
    delete arreglo[i].stock
}

window.confirm(JSON.stringify(arreglo))
arreglo = []
miCarritoSinDuplicados = []


//   for(let i= 0 ; i<= miCarritoSinDuplicados.length ; i++){
//     console.log(miCarritoSinDuplicados[0].descripcion)
//   }















  

  
  try {
    const productList = await (
      await fetch("/api/entrarProducto", {
        method: "post",
        body: JSON.stringify(carritoEntrada),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  } catch {
    window.alert("falla funcion ENTRARPRoducto()");
  }

  enviarOrdenes();

  carritoEntrada = [];
  total = 0;
  await fetchProducts();
  document.getElementById(
    "checkoutSumarStock"
  ).innerHTML = `CONIFIRMAR SUMAR STOCK: ${carritoEntrada.length}`;
  let codigo = document.getElementById("codigoByTecladoENTRADA").valueAsNumber;
  findProductByCodigoENTRADA(codigo);
}

function displayProducts(productList) {
  let productsHTML = "";
  productList.forEach((element) => {
    productsHTML += `
        <div class="product-container">
            <h3>${element.codigo}</h3>
            <h3>${element.descripcion}</h3>
            <h3>Rubro: ${element.rubro}</h3>
            <h3>Subrubro: ${element.subrubro}</h3>
            <h3>precio: $${element.precio}</h3>
            <h3>stock: ${element.stock}</h3>
            <button id="btn-add" class="button-add " onclick="add(${element.codigo})">SALIDA</button> 
            
            <button id="btn-addE" class="button-entrar " onclick="addEntrada(${element.codigo})">ENTRADA</button> 
            </div>
        `;
    document.getElementById("page-content").innerHTML = productsHTML;
  });
}

async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts(productList);
}
async function fetchOrders() {
  orderList = await (await fetch("/api/orders")).json();
  console.log(orderList);
  return orderList;
}

async function fetchGlobalProducts() {
  const productListGlobales = await (
    await fetch("/api/productsGlobales")
  ).json();
  return productListGlobales;
}

function displayProductsEncontrados(productoEncontrado) {
  let productoHTML = `
        <div class="product-container">
            <h3>Codigo: ${productoEncontrado.codigo}</h3>
            <h3>${productoEncontrado.descripcion}</h3>
            <h3>Rubro: ${productoEncontrado.rubro}</h3>
            <h3>Subrubro: ${productoEncontrado.subrubro}</h3>
            <h3>Precio: $${productoEncontrado.precio}</h3>
            <h3>Stock: ${productoEncontrado.stock}</h3>
        <button id="btn-add" class="button-add " onclick="add(${productoEncontrado.codigo})">SALIDA/VENTA</button> 
       
        <button id="btn-addE" class="button-entrar " onclick="addEntrada(${productoEncontrado.codigo})">ENTRADA</button> 
        </div>

        <button id="cancelar" class="button-cancelar btn " onclick="cancelar()">Cancelar</button> 
        </div>
        `;
  document.getElementById("producto-encontrado").innerHTML = productoHTML;
}

function displayProductsEncontradosParaVenta(productoEncontrado) {
  let productoHTML = `
        <div class="product-container">
            <h3>Codigo: ${productoEncontrado.codigo}</h3>
            <h3>${productoEncontrado.descripcion}</h3>
            <h3>Rubro: ${productoEncontrado.rubro}</h3>
            <h3>Subrubro: ${productoEncontrado.subrubro}</h3>
            <h3>Precio: $${productoEncontrado.precio}</h3>
            <h3>Stock: ${productoEncontrado.stock}</h3>
        <button id="btn-add" class="button-add " onclick="add(${productoEncontrado.codigo})">SALIDA/VENTA</button> 
       
        

        <button id="cancelar" class="button-cancelar btn " onclick="cancelar()">Cancelar</button> 
        </div>
        `;
  document.getElementById("producto-encontrado-salida").innerHTML =
    productoHTML;
}

function displayProductsEncontradosParaEntrada(productoEncontrado) {
  let productoHTML = `
        <div class="product-container">
            <h3>Codigo: ${productoEncontrado.codigo}</h3>
            <h3>${productoEncontrado.descripcion}</h3>
            <h3>Rubro: ${productoEncontrado.rubro}</h3>
            <h3>Subrubro: ${productoEncontrado.subrubro}</h3>
            <h3>Precio: $${productoEncontrado.precio}</h3>
            <h3>Stock: ${productoEncontrado.stock}</h3>
       
       
            <button id="btn-addE" class="button-entrar " onclick="addEntrada(${productoEncontrado.codigo})">ENTRADA</button> 
            </div>

        <button id="cancelar" class="button-cancelar btn " onclick="cancelar()">Cancelar</button> 
        </div>
        `;
  document.getElementById("producto-encontrado-entrada").innerHTML =
    productoHTML;
}

// findProductByCodigoButton.addEventListener('click',findProductByCodigo(7790272001029))

function findProductByCodigo() {
  let codigo = document.getElementById("codigoByTeclado").valueAsNumber;

  const productoBuscado = productList.find((p) => p.codigo === codigo);
  console.log(productoBuscado);
  displayProductsEncontrados(productoBuscado);
}

function findProductByCodigoVENTA() {
  let codigo = document.getElementById("codigoByTecladoVENTA").valueAsNumber;

  const productoBuscado = productList.find((p) => p.codigo === codigo);
  console.log(productoBuscado);
  displayProductsEncontradosParaVenta(productoBuscado);
}

function findProductByCodigoENTRADA() {
  let codigo = document.getElementById("codigoByTecladoENTRADA").valueAsNumber;

  const productoBuscado = productList.find((p) => p.codigo === codigo);
  console.log(productoBuscado);

  displayProductsEncontradosParaEntrada(productoBuscado);
}

//--- window onload se llama cuadno la ventana se termina de cargar
//--- esta en el navegador no se puede usar desde node

function mostrarStock() {
  document.getElementById("page-content").classList.remove("no-mostrar");
}
function esconderStock() {
  document.getElementById("page-content").classList.add("no-mostrar");
}

window.onload = async () => {
  //const productList = await(await fetch('/api/products')).json();
  //console.log(productList)
  //displayProducts(productList);
  await fetchProducts();
  //await fetchGlobalProducts()
  document.getElementById("page-content").classList.add("no-mostar");
};

// async function entrarProducto() { //metodo post al back
//     try{
//         const productList = await (await fetch("/api/entrarProducto",{
//             method: "post",
//             body: JSON.stringify(carritoEntrada),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })).json();
//     }
//     catch {
//         window.alert("falla funcion ENTRAR()");
//     }

//     carritoEntrada = [];
//     total = 0;
//     await fetchProducts();
//     document.getElementById("checkoutSumarStock").innerHTML = `CONIFIRMAR SUMAR STOCK${carrito.length}`
//     let codigo = document.getElementById("codigoByTeclado").valueAsNumber
//     findProductByCodigo(codigo)
// }

async function enviarOrdenes() {
  //metodo post al back  oredenes de entradaaaa

  let order = {
    items: JSON.stringify(carritoEntrada),
    date: "fecha",
  };
  try {
    const orders = await (
      await fetch("/api/orders", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  } catch {
    window.alert("falla funcion ENTRAR()");
  }
}

async function enviarOrdenesSalida() {
  //metodo post al back   oprdenes de salida

  let order = {
    items: JSON.stringify(carrito),
    date: "fecha",
  };
  try {
    const orders = await (
      await fetch("/api/ordersSalida", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  } catch {
    window.alert("falla funcion ENTRAR()");
  }
}

function cancelar() {
  carrito = [];
  carritoEntrada = [];
  total = 0;
  order = {
    items: [],
  };
  document.getElementById(
    "checkoutSumarStock"
  ).innerHTML = `CONFIRMAR SUMAR STOCK: ${carrito.length}`;
  document.getElementById(
    "checkout"
  ).innerHTML = `CONFIRMAR VENTA ${carrito.length}`;
}
