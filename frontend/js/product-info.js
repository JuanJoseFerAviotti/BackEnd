const producto = JSON.parse(localStorage.getItem("productoSeleccionado"));
const usuario = JSON.parse(localStorage.getItem("usuario"));
const detalle = document.getElementById("detalle");
const titulo = document.getElementById("tituloproducto");
const productoId = producto.id;
let productoComentarios = [];
const url = PRODUCT_INFO_COMMENTS_URL + productoId + EXT_TYPE;
let calificacionSeleccionada = 0;
const stars = document.querySelectorAll('.star');
const form = document.getElementById('formCalificacion');
const ProductoRelLugar = document.getElementById("productos-relacionados");

let productos = [];

const urlProducto = PRODUCT_INFO_URL + productoId + EXT_TYPE;
let productoRelacionado = [];

function mostrarProductosRelacionados(array) {
    array.forEach(element => {
         ProductoRelLugar.innerHTML += `
            
            
            <div class="PR-card mode" data-id="${element.id}">
                    <img class="PR-Img" src="` + element.image + `" alt="` + element.name + `" class="img-thumbnail">
                        <div class="PR-name">
                            <h2 class="mode">`+ element.name +`</h2>    
                        </div>
                </div>

         `;
       });
       document.querySelectorAll(".PR-card").forEach(item => {
        item.addEventListener("click", async () => {
            const id = item.getAttribute("data-id");
            
            const urlProductoCompleto = PRODUCT_INFO_URL + id + EXT_TYPE;
            
            try {
                const resultObj = await getJSONData(urlProductoCompleto);
                
                if (resultObj.status === "ok") {
                    localStorage.setItem("productoSeleccionado", JSON.stringify(resultObj.data));
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error al cargar el producto:", error);
            }
        });
    });
}

function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.count, 0);
        cartCount.textContent = totalItems;
    }
  } catch (e) {
    localStorage.removeItem("cart");
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = 0;
      cartCount.style.display = 'none';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});


        
function agregarCarrito() {
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    
    const productoParaCarrito = {
        id: producto.id,
        name: producto.name,
        description: producto.description,
        currency: producto.currency,
        cost: producto.cost,
        image: producto.image || producto.images[0],
        count: 1  
    };
    const productoExistente = cart.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.count++;
    } else {
        cart.push(productoParaCarrito);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.count, 0);
        cartCount.textContent = totalItems;
    }
    Swal.fire({
    title: "Producto agregado al carrito!",
    icon: "success",
    draggable: true
    });
}


stars.forEach(star => {
    star.addEventListener('click', function() {
        calificacionSeleccionada = parseInt(this.dataset.rating);
        actualizarEstrellas();
    });
});

function actualizarEstrellas() {
    stars.forEach((star, index) => {
        if (index < calificacionSeleccionada) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}


form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const comentario = document.getElementById('comentario').value;
    if (calificacionSeleccionada === 0) {
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, selecciona una calificación!"
        });
        return;
    }
    if (comentario.trim() === '') {
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, escribe un comentario!"
        });
        return;
    }
    const nuevoComentario = {
        user: usuario.usuario,
        description: comentario,
        score: calificacionSeleccionada,
        dateTime: new Date().toISOString()
    };
    productoComentarios.push(nuevoComentario);
    mostrarComentarios();
    
    Swal.fire({
    title: "Comentario enviado con éxito!",
    icon: "success",
    draggable: true
    });
    
    
    form.reset();
    calificacionSeleccionada = 0;
    actualizarEstrellas();
});


    if (producto) {
      detalle.innerHTML = `
        
        <img src="${producto.image|| producto.images[0]}" alt="${producto.name}" class="img-info" >
        <div id="Descripciontotal"> 
        <p id="precio"> ${producto.currency} ${producto.cost}</p>
        
        <p id="vendidos"><b>Vendidos:</b> ${producto.soldCount}</p>
        <h2 id=Tdesc>Descripcion </h2>
        <p id="descripcion"> ${producto.description}</p>
        </div>
        
      `;
      titulo.innerHTML = `${producto.name}`;

      
    } else {
      detalle.textContent = "No se encontró información del producto.";
    }
    


function mostrarComentarios() {
    const comentarios = document.getElementById('comentarios');
  
    comentarios.innerHTML = '';
    productoComentarios.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    productoComentarios.forEach(comentario => {
        const fecha = new Date(comentario.dateTime);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
        const comentarioHTML = `
            <div class="comentario mode">
                <h3 class="usuario">${comentario.user}</h4>
                <label class="descripcion mode">${comentario.description}</label>
                <label class="fecha">${fechaFormateada}</label>
                <p class="puntuacion" style="text-align: end;">Puntuación: ${convertirEstrellas(comentario.score)}</p>
            </div>
            <hr>    
        `;
        comentarios.innerHTML += comentarioHTML;
    });
}

function convertirEstrellas(vote) {
  return "★".repeat(vote) + "☆".repeat(5 - vote);
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(url).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productoComentarios = resultObj.data;
            mostrarComentarios();
        }
    });
   

    getJSONData(urlProducto).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productos = resultObj.data;
            productoRelacionado = resultObj.data.relatedProducts;
            mostrarProductosRelacionados(productoRelacionado);
        }
    });

    

});
/* Funcion mostrar perfil extraida de index.js */
document.addEventListener("DOMContentLoaded", function(){
    const loggedIn = localStorage.getItem("loggedIn");
    const User = JSON.parse(localStorage.getItem("usuario"));
  const usuarioDiv = document.getElementById("usuarioo");
  console.log("Elemento li:", usuarioDiv);

  if (!loggedIn) {
    window.location.href = "login.html";
  } else {
    usuarioDiv.textContent = User.usuario;
  }


    if (!loggedIn) {

      window.location.href = "login.html";
    }


//modo oscuro o claro
     const body = document.body;
    const button = document.getElementById("modeButton");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      body.classList.replace("light-mode", "dark-mode");
      button.classList.replace("btn-dark", "btn-light");
      button.textContent = "Light Mode";
      toggleMode(true);
      
    }
 
    let dark = false;
    button.addEventListener("click", () => {
      
     const isDark = body.classList.toggle("dark-mode");
      body.classList.toggle("light-mode", !isDark); 
      if (isDark) {
        button.classList.replace("btn-dark", "btn-light");
        button.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
      } else {
        button.classList.replace("btn-light", "btn-dark");
        button.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
      } 

toggleMode(isDark);
    });
});
function toggleMode(isDark) {

  for (let sheet of document.styleSheets) {
    try {
      for (let rule of sheet.cssRules) {
        if (rule.selectorText === '.mode') {
          
          if (isDark) {
              rule.style.setProperty('background-color', 'black', 'important');
            rule.style.setProperty('color', 'white', 'important');
          } else {
            rule.style.setProperty('background-color', 'white', 'important');
            rule.style.setProperty('color', 'black', 'important');
          }
        }
      }
    } catch (e) {
      
    }
  }
}
