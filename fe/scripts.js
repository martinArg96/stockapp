
let findProductByCodigoButton= "";

let productList = [];

let carrito = [];
let carritoEntrada = []
let total = 0;



function add(codigo) {
    console.log(codigo);
    carrito.push(codigo);
    //total = total + precio;
    document.getElementById("checkout").innerHTML = `CONFIRMAR VENTA ${carrito.length}`
    

}

function addEntrada(codigo){
    console.log("entrada de "+codigo)
    carritoEntrada.push(codigo);
    document.getElementById("checkoutSumarStock").innerHTML = `CONFIRMAR ENTRADA STOCK ${carritoEntrada.length}`
}

async function pay() { //metodo post al back
    try{
        const productList = await (await fetch("/api/pay",{
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();
    }
    catch {
        window.alert("falla funcion pay()");
    }

    carrito = [];
    total = 0;
    await fetchProducts();
    let codigo = document.getElementById("codigoByTeclado").valueAsNumber
    findProductByCodigo(codigo)
    document.getElementById("checkout").innerHTML = `CONFIRMAR VENTA ${carrito.length}`
}

async function entrarProducto() { //metodo post al back
    try{
        const productList = await (await fetch("/api/entrarProducto",{
            method: "post",
            body: JSON.stringify(carritoEntrada),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();
    }
    catch {
        window.alert("falla funcion ENTRAR()");
    }

    carritoEntrada = [];
    total = 0;
    await fetchProducts();
    document.getElementById("checkoutSumarStock").innerHTML = `CONIFIRMAR SUMAR STOCK${carrito.length}`
    let codigo = document.getElementById("codigoByTeclado").valueAsNumber
    findProductByCodigo(codigo)
}



function displayProducts(productList){
    let productsHTML = ""
    productList.forEach(element => {
        productsHTML += `
        <div class="product-container">
            <h3>${element.codigo}</h3>
            <h3>${element.descripcion}</h3>
            <h3>Rubro</h3>
            <h3>Subrubro</h3>
            <h3>${element.precio}</h3>
            <h3>${element.stock}</h3>
            <button id="btn-add" class="button-add" onclick="add(${element.codigo})">SALIDA</button> 
            
            <button id="btn-addE " class="button-entrar" onclick="addEntrada(${element.codigo})">ENTRADA</button> 
            </div>
        `
        document.getElementById("page-content").innerHTML = productsHTML;
        
    });

}



async function fetchProducts(){
    productList = await (await fetch("/api/products")).json();
    displayProducts(productList);
    
    
   
}

async function fetchGlobalProducts(){
    const productListGlobales = await (await fetch("/api/productsGlobales")).json();
    return productListGlobales
}

function displayProductsEncontrados(productoEncontrado){
    let productoHTML = 
    `
        <div class="product-container">
            <h3>${productoEncontrado.codigo}</h3>
            <h3>${productoEncontrado.descripcion}</h3>
            <h3>Rubro</h3>
            <h3>Subrubro</h3>
            <h3>${productoEncontrado.precio}</h3>
            <h3>${productoEncontrado.stock}</h3>
        <button id="btn-add" class="button-add" onclick="add(${productoEncontrado.codigo})">SALIDA</button> 
       
        <button id="btn-addE " class="button-entrar" onclick="addEntrada(${productoEncontrado.codigo})">ENTRADA</button> 
        </div>
        `
        document.getElementById("producto-encontrado").innerHTML = productoHTML;
        
    

}


// findProductByCodigoButton.addEventListener('click',findProductByCodigo(7790272001029))

function findProductByCodigo(){
    let codigo = document.getElementById("codigoByTeclado").valueAsNumber
    
    const productoBuscado = productList.find((p) => p.codigo === codigo);
    console.log(productoBuscado)
    displayProductsEncontrados(productoBuscado)

}







//--- window onload se llama cuadno la ventana se termina de cargar
//--- esta en el navegador no se puede usar desde node


function mostrarStock(){
    document.getElementById("page-content").classList.remove("no-mostar")
    document.getElementsByClassName("boton").classList.add("no-mostar")
    document.getElementsByClassName("boton").classList.add("no-mostar")
}
function esconderStock(){
    document.getElementById("page-content").classList.add("no-mostar")
}


window.onload = async()=> {
    //const productList = await(await fetch('/api/products')).json();
    //console.log(productList)
    //displayProducts(productList);
    await fetchProducts()
    //await fetchGlobalProducts() 
    document.getElementById("page-content").classList.add("no-mostar")
}