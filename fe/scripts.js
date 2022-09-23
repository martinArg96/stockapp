let carrito = [];
let total = 0;

function add(codigo) {
    console.log(codigo);
    carrito.push(codigo);
    //total = total + precio;
    // document.getElementById("checkout").innerHTML = `Pagar $${total}`
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
    document.getElementById("checkout").innerHTML = `Pagar $${total}`
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
            <h3>${element.cantidad}</h3>
        <button class="button-add" onclick="add(${element.codigo})">Agregar</button> 
        </div>
        `
        document.getElementById("page-content").innerHTML = productsHTML;
        
    });
}


//--- window onload se llama cuadno la ventana se termina de cargar
//--- esta en el navegador no se puede usar desde node



window.onload = async()=> {
    const productList = await(await fetch('/api/products')).json();
    console.log(productList)
    displayProducts(productList);
}