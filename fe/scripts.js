let productList = []

const carritoVenta = []
const carritoIngreso = []

const carritoModificaciones = []
let carritoNuevosProductos = []

let productosSeleccionados = []

const ordenVenta = []
const ordenIngreso = []

















async function mostrarVentana(ventanaId,opcionMenu){
    await fetchProducts();
    document.getElementById(ventanaId).classList.remove("cerrar-ventana")
    document.getElementById(ventanaId).classList.add("mostrar-ventana")

    if (opcionMenu == "menu-venta"){
    document.getElementById("container1").innerHTML= `
    <div class="ventana-venta" id="ventana-venta">
            <div>
                <h3>VENTA</h3>
                <button>OK</button>
            </div>
            <div>
                <h3>BUSCAR</h3>
            </div>
            <div>
                <h3>PRODUCTOS ENCONTRADOS</h3>
            </div>
        </div>

        <button class="cerrar-ventana1" id="cerrar-ventana1" onclick="cerrarVentana('ventana1')">CERRAR</button>
    `
    } else if(opcionMenu == "menu-ingreso"){
        
        document.getElementById("container1").innerHTML= `
    <div class="ventana-ingreso" id="ventana-ingreso">
        
        <input type="number" id="codigoByTeclado" class="codigoByTeclado" placeholder="CODIGO DE BARRAS">
        
        <button id="btn-buscar-codigoByTeclado" class="btn-buscar-codigoByTeclado" onclick="findProductByCodigo() " >Buscar para sumar stock</button>
        
        <div>
            <input type="text" name="buscador-por-palabras" id="buscador-por-palabras" placeholder="Buscar...">
    
            <ul id="listaArticulos">
                <!-- aca se insertan articulos buscados por palabra -->
            </ul>

        </div> 
        
        <button> CANCELAR </button>
        <h3>PRODUCTOS ENCONTRADOS</h3>
        <div id="productos-seleccionados"> </div>
        
    </div>


        <button class="cerrar-ventana1" id="cerrar-ventana1" onclick="cerrarVentana('ventana1')">CERRAR</button>
    `
    activarBuscadorPorPalabras()
    } else if(opcionMenu == "menu-nuevoProducto"){
        document.getElementById("container1").innerHTML= `
        <div class="ventana-nuevoProducto" id="ventana-nuevoProducto">
                <div>
                    <h3> INGRESAR NUEVO PRODUCTO AL INVENTARIO</h3>
                    
                </div>
                <div id="formulario-nuevo-producto"class="formulario-nuevo-producto">
                <!-- <label for="newProductCodigo">codigo de barras</label> -->
                <input type="number"  id="newProductCodigo" placeholder="codigo de barras">
                <!-- <label for="newProductDescripcion">DESCRIPCION</label> -->
                <input type="text" name="" id="newProductDescripcion" placeholder="DESCRIPCION">
                <!-- <label for="newProductRubro">RUBRO</label> -->
                <input type="number" id="newProductRubro" placeholder="rubro">
                <!-- <label for="newProductSubRubro">SUBRUBRO</label> -->
                <input type="number" id="newProductSubRubro" placeholder="subrubro">
                <!-- <label for="newProductPrecio">PRECIO</label> -->
                <input type="number" name="" id="newProductPrecio" placeholder="precio">
                <!-- <label for="newProductStock">STOCK</label> -->
                <input type="number" id="newProductStock" placeholder="stock">
                <button  onclick="crearNuevoProducto()">SELECCIONAR PRODUCTO</button>
            </div>
                <div>
                    <h3>PRODUCTOS ENCONTRADOS</h3>
                    <div id="productos-seleccionados"> </div>
                </div>
                <button id="orden-agregar-nuevosProductos" onclick="confirmarSeleccion('orden-agregar-nuevosProductos')">CONFIRMAR SELECCION</button>
            </div>
    
            <button class="cerrar-ventana1" id="cerrar-ventana1" onclick="cerrarVentana('ventana1')">CERRAR</button>
        `
    }
}



async function cerrarVentana(ventanaId){
    document.getElementById(ventanaId).classList.remove("mostrar-ventana")
    document.getElementById(ventanaId).classList.add("cerrar-ventana")
    document.getElementById("container1").innerHTML= `
    <button class="cerrar-ventana1" id="cerrar-ventana1" onclick="cerrarVentana('ventana1')">CERRAR</button>
    `
    carritoNuevosProductos = []
    nombresDesplegados = false
    productosSeleccionados = []
    await fetchProducts();

}
async function cerrarVentanas(){
    document.getElementById("ventana1").classList.remove("mostrar-ventana")
    document.getElementById("ventana1").classList.add("cerrar-ventana")
    document.getElementById("ventana2").classList.remove("mostrar-ventana")
    document.getElementById("ventana2").classList.add("cerrar-ventana")
    
    

    carritoNuevosProductos = []
    nombresDesplegados = false
    productosSeleccionados = []
    await fetchProducts();
}


function mostrarVentana2(tipoOperacionId){
    console.log("ejecutando mostrarventana2()")
    document.getElementById("ventana2").classList.remove("cerrar-ventana")
    document.getElementById("ventana2").classList.add("mostrar-ventana2")
    
    if(tipoOperacionId == "orden-agregar-nuevosProductos"){
        console.log("entrando al if de ventana2 orden nuevos productos")
        
        document.getElementById("container2").innerHTML= `
                <h2>Orden de ingreso de nuevos productos</h2>
                <div id="carrito-nuevosProductos"></div>
                <h2>total</h2>
                <button onclick="confirmarNuevosProductos()"> ACTUALIZAR STOCK</button>
                <button onclick="cerrarVentanas()">SALIR AL MENU</button>
        `
        mostrarCarritoNuevosProductos()

    }

}




function mostrarCarritoNuevosProductos(){
    console.log("ejecutando mostrarCarritoNuevosProductos()")
    let carritoNuevosProductosHTML = ""
    console.log(carritoNuevosProductos)  
    carritoNuevosProductos.forEach(element => {
    carritoNuevosProductosHTML += `<div class="product-container">
    <h3>${element.codigo}</h3>
    <h3>${element.descripcion}</h3>
    <h3>Rubro: ${element.rubro}</h3>
    <h3>Subrubro: ${element.subrubro}</h3>
    <h3>precio: $${element.precio}</h3>
    <h3>stock: ${element.stock}</h3>
    
    </div>
`

});

document.getElementById("carrito-nuevosProductos").innerHTML = carritoNuevosProductosHTML;

}

//CREA NUEVO PRODUCTO Y LO INGRESA A ARRAY DE PRODUCTOS SELECCIONADOS
function crearNuevoProducto(){
    //creacion objeto nuevo producto
    let newProduct= {
        codigo: document.getElementById("newProductCodigo").valueAsNumber,
        descripcion: document.getElementById("newProductDescripcion").value,
        rubro: document.getElementById("newProductRubro").valueAsNumber,
        subrubro: document.getElementById("newProductSubRubro").valueAsNumber,
        precio: document.getElementById("newProductPrecio").valueAsNumber,
        stock: document.getElementById("newProductStock").valueAsNumber,
    }
    //se ingresa a productos seleccionados
    productosSeleccionados.push(newProduct)
    console.log('productosSeleccionados:', productosSeleccionados)

    //se limpia el formulario
    document.getElementById("newProductCodigo").value= null,
    document.getElementById("newProductDescripcion").value = null,
    document.getElementById("newProductRubro").value = null,
    document.getElementById("newProductSubRubro").value= null,
    document.getElementById("newProductPrecio").value = null,
    document.getElementById("newProductStock").value = null

    //mustra productos seleccionados
    mostrarProductosSeleccionados()
}

function mostrarProductosSeleccionados(){
    let productosSeleccionadosHTML =""
    productosSeleccionados.forEach(element => {
        productosSeleccionadosHTML += `<div class="product-container">
        <h3>${element.codigo}</h3>
        <h3>${element.descripcion}</h3>
        <h3>Rubro: ${element.rubro}</h3>
        <h3>Subrubro: ${element.subrubro}</h3>
        <h3>precio: $${element.precio}</h3>
        <h3>stock: ${element.stock}</h3>
        
        
        
        </div>
    `
    document.getElementById("productos-seleccionados").innerHTML = productosSeleccionadosHTML;
    });
}




function confirmarSeleccion(tipoOrden){
    
    if(tipoOrden == "orden-agregar-nuevosProductos"){

    console.log("confirmar seleccion orden nuevos productos")
    
    productosSeleccionados.forEach(element => {
        carritoNuevosProductos.push(element)
    });
    productosSeleccionados = []
    console.log('carritoNuevosProductos:', carritoNuevosProductos)
    mostrarVentana2(tipoOrden)
    }
}




async function fetchProducts() {
    productList = await (await fetch("/api/products")).json();
    // displayProducts(productList);
  }



  async function confirmarNuevosProductos() {
    carritoNuevosProductos.forEach(element => {
        productList.push(element)
    });
    carritoNuevosProductos = []

    //metodo post al back
    try {
      const ALGO = await (
        await fetch("/api/actualizarProductos", {
          method: "post",
          body: JSON.stringify(productList),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
    } catch {
      window.alert("FALLA AL AGREGAR NUEVOS PRODUCTOS");
    }
    ;
  
    await fetchProducts();
    

    carritoNuevosProductos = []

    productosSeleccionados = []
    window.alert("PRODUCTOS AGREGADOS CORRECTAMENTE")
    cerrarVentanas()

  }


function findProductByCodigo() {
    let codigo = document.getElementById("codigoByTeclado").valueAsNumber;

    let productoBuscado = productList.find((p) => p.codigo === codigo);
    productosSeleccionados.push(productoBuscado)
    productoBuscado = null
    mostrarProductosSeleccionados()


 }





  window.onload = async () => {
    await fetchProducts();
  };


//BUSCADOR POR PALABRAS
 
let nombresDesplegados = false

document.addEventListener("keyup", e=>{

    if (e.target.matches("#buscador-por-palabras")){
        
        if (e.key ==="Escape")e.target.value = ""
        console.log(e.target.value)
        document.querySelectorAll(".articulo-nombre").forEach(articulo =>{
  
            articulo.textContent.toLowerCase().includes(e.target.value.toLowerCase())
              ?articulo.classList.remove("filtro")
              :articulo.classList.add("filtro")
        })
  
    }
  })


//   document.getElementById("buscador-por-palabras").addEventListener("keyup",filtrarPorPalabras)
//   function filtrarPorPalabras(){

//     if (e.key ==="Escape")e.target.value = ""
//         console.log(e.target.value)
//         document.getElementsByClassName("articulo").forEach(articulo =>{
  
//             articulo.textContent.toLowerCase().includes(e.target.value.toLowerCase())
//               ?articulo.classList.remove("filtro")
//               :articulo.classList.add("filtro")
//         })
//   }

  
function activarBuscadorPorPalabras(){
document.getElementById("buscador-por-palabras").addEventListener("focus",mostrarNombresDeProductList)
}
  function mostrarNombresDeProductList(){
    document.getElementById("buscador-por-palabras").value=""
    //si encuentra los producots ya desplegaddos que no haga nada
    
    // if(nombresDesplegados == false){

    
    console.log("displayProducts nombres")
    let nombreProductoHTML = "";
  productList.forEach((element) => {
    nombreProductoHTML += `
    
            <li class="articulo-nombre">${element.descripcion}
            <button onclick="agregarProductoSeleccionadoPorNombre(${element.codigo})"> SELECCIONAR </button></li>
            
            
        `;
    document.getElementById("listaArticulos").innerHTML = nombreProductoHTML;
nombresDesplegados= true
  });
    // } else{
    //     console.log("los productos ya s ecnuetrandesplegados")
    // }
}
  

function agregarProductoSeleccionadoPorNombre(codigo){
    let productoBuscadoPorNombre = productList.find((p) => p.codigo === codigo);
    productosSeleccionados.push(productoBuscadoPorNombre)
    productoBuscadoPorNombre = ""
    mostrarProductosSeleccionados()

}

//termina buscador por palabras