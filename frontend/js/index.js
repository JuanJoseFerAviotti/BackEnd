/* Funcion mostrar perfil extraida de index.js */
document.addEventListener("DOMContentLoaded", function(){
  const loggedIn = localStorage.getItem("loggedIn");
  const usuarioDiv = document.getElementById("usuarioo");

  let userRaw = localStorage.getItem("usuario");
  let User = null;
  try {
    if (userRaw) {
      const t = userRaw.trim();
      if (t.startsWith("{") || t.startsWith("[")) {
        User = JSON.parse(userRaw);
      } else {
        User = { usuario: userRaw };
      }
    }
  } catch (e) {
    console.warn("Error parseando 'usuario' de localStorage:", e);
    User = { usuario: String(userRaw || "") };
  }

  if (!loggedIn) {
    window.location.href = "login.html";
    return;
  }

  if (usuarioDiv) {
    usuarioDiv.textContent = (User && User.usuario) ? User.usuario : "Usuario";
  }

  const attachCategory = (id, catId) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", function() {
        localStorage.setItem("catID", catId);
        window.location.href = "products.html";
      });
    }
  };

  attachCategory("autos", 101);
  attachCategory("juguetes", 102);
  attachCategory("muebles", 103);

  // modo oscuro o claro
  const body = document.body;
  const button = document.getElementById("modeButton");
  const savedTheme = localStorage.getItem("theme");

  if (button) {
    if (savedTheme === "dark") {
      body.classList.replace("light-mode", "dark-mode");
      button.classList.replace("btn-dark", "btn-light");
      button.textContent = "Light Mode";
      toggleMode(true);
    }

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
  }

  // actualizar contador al cargar
  updateCartCount();
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

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => {
      const qty = item.count ?? item.quantity ?? item.qty ?? item.cantidad ?? item.amount ?? 0;
      return sum + Number(qty || 0);
    }, 0);

    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "" : "none";
  } catch (e) {
    console.warn("Error leyendo carrito:", e);
    localStorage.removeItem("cart");
    cartCount.textContent = 0;
    cartCount.style.display = 'none';
  }
}

