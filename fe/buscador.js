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
    nombresDesplegados
    if(nombresDesplegados == false){

    
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
    } else{
        console.log("los productos ya s ecnuetrandesplegados")
    }
}
  

function agregarProductoSeleccionadoPorNombre(codigo){
    let productoBuscadoPorNombre = productList.find((p) => p.codigo === codigo);
    productosSeleccionados.push(productoBuscadoPorNombre)
    productoBuscadoPorNombre = ""

}