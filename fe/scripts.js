let findProductByCodigoButton = "";
let miCarritoSinDuplicados = []
let arreglo = []
let productList = [];
let items = [];
let carrito = [];
let carritoEntrada = [];
let total = 0;
order = {
  items: [],
};
let productoParaCambiarPrecio = {}





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
    window.alert("FALLA FUNCION PAY");
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



let elements = items

elements.forEach(element => {
    element.cantidad=1;
});


miCarritoSinDuplicados = elements.reduce((acumulador, valorActual) => {
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
  
 
arreglo = miCarritoSinDuplicados

console.log("micarrito sin dupil: " + miCarritoSinDuplicados)


for(i = 0; i< arreglo.length ; i++){
    delete arreglo[i].codigo
    delete arreglo[i].subrubro
    delete arreglo[i].rubro
    delete arreglo[i].stock
    
}

window.confirm(JSON.stringify(arreglo))

for(i = 0; i< arreglo.length ; i++){
    delete arreglo[i].codigo
    delete arreglo[i].subrubro
    delete arreglo[i].rubro
    delete arreglo[i].stock
    delete arreglo[i].precio
    delete arreglo[i].descripcion
    delete arreglo[i].cantidad
    
}
items= [];
arreglo = []
miCarritoSinDuplicados = []
console.log(arreglo)
console.log(miCarritoSinDuplicados)

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
    window.alert("FALLA AL SUMAR STOCK");
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
       
       
            <input type="number" name="" id="agregar-varios">
            <button onclick="agregarVarios(${productoEncontrado.codigo})">AGREGAR VARIOS</button>

            <button id="btn-addE" class="button-entrar " onclick="addEntrada(${productoEncontrado.codigo})">ENTRADA</button> 
            </div>

            

        <button id="cancelar" class="button-cancelar btn " onclick="cancelar()">Cancelar</button> 
        </div>
        `;
  document.getElementById("producto-encontrado-entrada").innerHTML =
    productoHTML;
}

function agregarVarios(codigo){
    let cant = document.getElementById("agregar-varios").valueAsNumber
    for(let i = 0; i < cant; i++){
        carritoEntrada.push(codigo)
        const producto = productList.find((p) => p.codigo === codigo);
        items.push(producto);
    }
    
  
  document.getElementById(
    "checkoutSumarStock"
  ).innerHTML = `CONFIRMAR ENTRADA STOCK ${carritoEntrada.length}`;

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
  if(!productoBuscado){
    console.log("no se econtro el prodcut")
    window.alert("EL PRODUCTO NO SE ENCUENTRA EN EL INVENTARIO. POR FAVOR AGREGAR COMO NUEVO PRODUCTO")
  }

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
  items= [];
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
  items= [];
}

function cancelar() {
  carrito = [];
  carritoEntrada = [];
  total = 0;
  items= [];
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
let newProduct = {  }

async function agregarNuevoProducto(){
    newProduct= {
        codigo: document.getElementById("newProductCodigo").valueAsNumber,
        descripcion: document.getElementById("newProductDescripcion").value,
        rubro: document.getElementById("newProductRubro").valueAsNumber,
        subrubro: document.getElementById("newProductSubRubro").valueAsNumber,
        precio: document.getElementById("newProductPrecio").valueAsNumber,
        stock: document.getElementById("newProductStock").valueAsNumber,
    }
    //quiero que si ecneuntra el mismocodigo reemplaze el viejo

      let codigoNuevo = newProduct.codigo
      console.log (codigoNuevo)
      let productoViejo = productList.find((p) => p.codigo === codigoNuevo)

      console.log("producto viejo" ,productoViejo)
      
      
      if (productoViejo){
          if(!window.confirm("EL PRODUCTO YA EXISTE. DESEA REEMPLAZARLO?")){
            window.alert("CANCELADO")
            return 1
          } 
          

            console.log(productList.indexOf(productoViejo))
            let indexNuevo = productList.indexOf(productoViejo)
            productList[indexNuevo] = newProduct
            console.log(productList[indexNuevo])
  
            try {
              const noses = await (
                await fetch("/api/reemplazarProducto", {
                  method: "post",
                  body: JSON.stringify(productList),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
              ).json();


              document.getElementById("newProductCodigo").value= null,
              document.getElementById("newProductDescripcion").value = null,
              document.getElementById("newProductRubro").value = null,
              document.getElementById("newProductSubRubro").value= null,
              document.getElementById("newProductPrecio").value = null,
              document.getElementById("newProductStock").value = null,
              document.getElementById("formulario-nuevo-producto").classList.add("no-mostrar")

            window.alert("PRODUCTO REEMPLAZADO CORRECTAMENTE")
              } catch {
                window.alert("falla funcion remplazar productor nuevo producto");
              }
              productList = await (await fetch("/api/products")).json()
              items= []
            }





      else{




    try {
        const nose = await (
          await fetch("/api/agregarProductoNuevo", {
            method: "post",
            body: JSON.stringify(newProduct),
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).json();


    document.getElementById("newProductCodigo").value= null,
    document.getElementById("newProductDescripcion").value = null,
    document.getElementById("newProductRubro").value = null,
    document.getElementById("newProductSubRubro").value= null,
    document.getElementById("newProductPrecio").value = null,
    document.getElementById("newProductStock").value = null,
    document.getElementById("formulario-nuevo-producto").classList.add("no-mostrar")
    
    window.alert("PRODUCTO AGREGADO CORRECTAMENTE")
      } catch {
        window.alert("FALLA AL AGREGAR NUEVO PRODUCTO");
      }
      productList = await (await fetch("/api/products")).json()
      items= []
    }

 

  }


function mostrarFormularioNuevoProducto(){
    document.getElementById("formulario-nuevo-producto").classList.remove("no-mostrar")
}

function mostrarFormularioNuevoPrecio(){
  document.getElementById("formulario-nuevo-precio").classList.remove("no-mostrar")
}





function findProductByCodigoPRECIO() {

  let codigo = document.getElementById("codigoByTecladoPRECIO").valueAsNumber;

  const productoBuscadoP = productList.find((p) => p.codigo === codigo);
  console.log(productoBuscadoP);
  if(!productoBuscadoP){
    console.log("no se econtro el prodcut")
    window.alert("EL PRODUCTO NO SE ENCUENTRA EN EL INVENTARIO. POR FAVOR AGREGAR COMO NUEVO PRODUCTO")
  }

  displayProductsEncontradosParaPrecio(productoBuscadoP);
}

function displayProductsEncontradosParaPrecio(productoEncontrado){
console.log("displayProductsEncontradosParaPrecio")
productoParaCambiarPrecio = productoEncontrado
console.log('productoParaCambiarPrecio:', productoParaCambiarPrecio)


let productoHTMLprecio = `
        <div class="product-container">
            <h3 id="codigoDeProductoAcambiarPrecio">Codigo: ${productoEncontrado.codigo}</h3>
            <h3>${productoEncontrado.descripcion}</h3>
            <h3>Rubro: ${productoEncontrado.rubro}</h3>
            <h3>Subrubro: ${productoEncontrado.subrubro}</h3>
            <h3>Precio: $${productoEncontrado.precio}</h3> 
            <input type="number" id="precio" placeholder="NUEVO PRECIO">

            <h3>Stock: ${productoEncontrado.stock}</h3>
        
       
        

        <button id="cancelar" class="button-cancelar btn " onclick="cancelar()">Cancelar</button> 
        </div>
        `
        
        
        ;
  document.getElementById("producto-encontrado-para-actualizar-precio").innerHTML =
    productoHTMLprecio;

    

    document.getElementById("div-boton-confirmar-precio").innerHTML = `
    <button id="btn-precio" class="btn " onclick="actualizarPrecio()">CONFIRMAR CAMBIO</button> 
    `


  }
  
async function actualizarPrecio(){
 
  
  let nuevoPrecio = document.getElementById("precio").valueAsNumber
  const productoActualizarPrecio = productList.find((p) => p.codigo === productoParaCambiarPrecio.codigo);


  let indexProducto = productList.indexOf( productoActualizarPrecio)

  productList[indexProducto].precio= nuevoPrecio
            console.log(productList)


            try {
              const noses23 = await (
                await fetch("/api/reemplazarProducto", {
                  method: "post",
                  body: JSON.stringify(productList),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
              ).json();
             
               } catch{
                window.alert("falla del servidor al cambiar precio produto")
              }
            






              productoParaCambiarPrecio = {}
              await fetchProducts();
      window.alert("PRECIO ACTUALIZADO CORRECTAMENTE")



  
}


function mostrarContenedorActualizarPrecio(){
  document.getElementById("cambiar-precio-container").classList.remove("no-mostrar")
}