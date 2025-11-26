
function cambiarPesosADolar(){
  const cartProuct = JSON.parse(localStorage.getItem("cart"))
  cartProuct.forEach(element => {
    if(element.currency === "UYU" ){
      element.cost = Math.round((element.cost*0.025))
      
      element.currency = "USD"
    }
    console.log(cartProuct)
    localStorage.setItem("cart", JSON.stringify(cartProuct));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  
  cambiarPesosADolar();
  formarCarrito();
  tiposDeEnvios();
  formasDePago();
  chequeosAlComprar();
  actualizarEnvioYTotales();
});

function formarCarrito() {
  const cartContainer = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
   

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-message text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 5rem; color: #6c757d;"></i>
        <h3 class="mt-3 mb-2">Tu carrito está vacío</h3>
        <p class="text-muted mb-4">Aún no has agregado productos a tu carrito</p>
        <a href="categories.html" class="btn btn-warning btn-lg">
          <i class="bi bi-shop"></i> Ir a comprar
        </a>
      </div>
    `;
    const CostoTotal = document.getElementById("costo");
    const CostoEnvio = document.getElementById("costoEnvio");
    const TotalPrice = document.getElementById("CostoTotal");
    const BotonComprar = document.getElementById("btnComprar");
    if (BotonComprar) {
      BotonComprar.disabled = true;
    }
    if (CostoTotal) CostoTotal.textContent = "";
    if (CostoEnvio) CostoEnvio.textContent = "";
    if (TotalPrice) TotalPrice.textContent = "";
    
    actualizarContadorCarrito();
    return;
  }

  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const totalCost = item.cost * item.count;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
    <div class="card-total mode mb-3">
      <div class="card-producto container-fluid"> 
        <div class="row align-items-center" style="width: 100%;">
          <div class="col-12 col-sm-3 text-center mb-2 mb-sm-0">
            <img class="card-img img-fluid" src="${item.image}" alt="${item.name}">
          </div>
          <div class="col-12 col-sm-6 mb-2 mb-sm-0">
            <div class="cart-details">
              <div class="cart-name"><h2 class="h5 mb-1">${item.name}</h2></div>
              <div class="mb-1"><h5 class="h6">Precio unitario: ${item.currency} ${item.cost}</h5></div>
              <div class="mb-1 text-muted">${item.description || ''}</div>
            </div>
          </div>
          <div class="col-12 col-sm-3 text-end">
            <div class="card-right d-flex flex-column align-items-end">
              <input type="number" 
                     value="${item.count}" 
                     min="1" 
                     class="cantidad-input form-control mb-2" 
                     data-index="${index}"
                     data-cost="${item.cost}"
                     data-currency="${item.currency}">
              <div class="cart-price mb-2">Total: ${item.currency} ${totalCost}</div>
              <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}" title="Eliminar producto">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    cartContainer.appendChild(cartItem);

    const input = cartItem.querySelector('.cantidad-input');
    input.addEventListener('change', actualizarCantidad);

    const removeBtn = cartItem.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(removeBtn.dataset.index, 10);
      removeItem(idx);
    });
  });

  
  const cartTotal = cart.reduce((sum, item) => sum + (item.cost * item.count), 0);
  const envioC = cart.reduce((sum, item) => sum + (100 * item.count), 0);
  const totalprice = cartTotal + envioC;
  const currency = cart[0].currency || "$";

  const CostoTotal = document.getElementById("costo");
  const CostoEnvio = document.getElementById("costoEnvio");
  const TotalPrice = document.getElementById("CostoTotal");

  if (CostoTotal) CostoTotal.innerHTML = `${currency} ${cartTotal}`;
  if (CostoEnvio) CostoEnvio.innerHTML = `${currency} ${envioC}`;
  if (TotalPrice) TotalPrice.innerHTML = `${currency} ${totalprice}`;

  actualizarContadorCarrito();
  actualizarEnvioYTotales();
}


function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  formarCarrito();
}

function actualizarContadorCarrito() {
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

// Modo oscuro/claro
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


function actualizarCantidad(e) {
    const input = e.target;
    const newCount = parseInt(input.value);
    const itemIndex = parseInt(input.dataset.index);
    const cost = parseFloat(input.dataset.cost);
    const currency = input.dataset.currency;

    if (newCount < 1) {
        input.value = 1;
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[itemIndex].count = newCount;
    localStorage.setItem("cart", JSON.stringify(cart));

    const cartPrice = input.parentElement.querySelector('.cart-price');
    const totalCost = cost * newCount;
    cartPrice.textContent = `Total: ${currency} ${totalCost}`;

    const cartTotal = cart.reduce((sum, item) => sum + (item.cost * item.count), 0);
    const envioC = cart.reduce((sum, item) => sum + (100 * item.count), 0);
    const totalprice = cartTotal + envioC;

    const CostoTotal = document.getElementById("costo");
    const CostoEnvio = document.getElementById("costoEnvio");
    const TotalPrice = document.getElementById("CostoTotal");

    if (CostoTotal) CostoTotal.innerHTML = `${currency} ${cartTotal}`;
   
    actualizarEnvioYTotales();
    actualizarContadorCarrito();
}


function porcentajeSeleccionado() {
  const sel = document.querySelector('input[name="shippingType"]:checked');
  return sel ? parseFloat(sel.value) : 5;
}


function actualizarEnvioYTotales() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const currency = cart.length > 0 ? cart[0].currency : "$";
  const subtotal = cart.reduce((sum, item) => sum + (item.cost * item.count), 0);
  const pct = porcentajeSeleccionado();
  const shippingCost = +(subtotal * (pct / 100));
  const total = subtotal + shippingCost;

  const CostoTotal = document.getElementById("costo");
  const CostoEnvio = document.getElementById("costoEnvio");
  const TotalPrice = document.getElementById("CostoTotal");

  if (CostoTotal) CostoTotal.innerHTML = `${currency} ${subtotal.toFixed(2)}`;
  if (CostoEnvio) CostoEnvio.innerHTML = `${currency} ${shippingCost.toFixed(2)}`;
  if (TotalPrice) TotalPrice.innerHTML = `${currency} ${total.toFixed(2)}`;
}

function tiposDeEnvios() {
  document.querySelectorAll('.shipping-type').forEach(r => {
    r.addEventListener('change', () => {
      actualizarEnvioYTotales();
    });
  });
}

function mostrarCamposPago(tipo) {
  let camposContainer = document.getElementById('payment-fields-container');
  
  if (!camposContainer) {
    camposContainer = document.createElement('div');
    camposContainer.id = 'payment-fields-container';
    camposContainer.className = 'mt-4';
    
    const pagoCardBody = document.querySelector('#pago .card-body');
    if (pagoCardBody) {
      pagoCardBody.appendChild(camposContainer);
    }
  }
  
  camposContainer.innerHTML = '';
  
  if (tipo === 'creditCard') {
    camposContainer.innerHTML = `
      <div class="border-top pt-3">
        <h6 class="mb-3">Datos de la tarjeta</h6>
        <div class="mb-3">
          <label for="cardNumber" class="form-label">Número de tarjeta *</label>
          <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
        </div>
        <div class="mb-3">
          <label for="cardName" class="form-label">Nombre del titular *</label>
          <input type="text" class="form-control" id="cardName" placeholder="Como aparece en la tarjeta" required>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="cardExpiry" class="form-label">Fecha de vencimiento *</label>
            <input type="text" class="form-control" id="cardExpiry" placeholder="MM/AA" maxlength="5" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="cardCVV" class="form-label">CVV *</label>
            <input type="text" class="form-control" id="cardCVV" placeholder="123" maxlength="4" required>
          </div>
        </div>
        <small class="text-muted">* Campos obligatorios</small>
      </div>
    `;
    
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
      });
    }
    
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }
    
  } else if (tipo === 'bankTransfer') {
    camposContainer.innerHTML = `
      <div class="border-top pt-3">
        <h6 class="mb-3">Datos bancarios</h6>
        <div class="mb-3">
          <label for="bankName" class="form-label">Banco *</label>
          <select class="form-select" id="bankName" required>
            <option value="">Selecciona tu banco</option>
            <option value="brou">Banco República (BROU)</option>
            <option value="santander">Santander</option>
            <option value="itau">Itaú</option>
            <option value="bbva">BBVA</option>
            <option value="scotiabank">Scotiabank</option>
            <option value="heritage">Heritage</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="accountHolder" class="form-label">Titular de la cuenta *</label>
          <input type="text" class="form-control" id="accountHolder" placeholder="Nombre completo del titular" required>
        </div>
        <div class="mb-3">
          <label for="accountNumber" class="form-label">Número de cuenta *</label>
          <input type="text" class="form-control" id="accountNumber" placeholder="Número de cuenta bancaria" required>
        </div>
        <div class="mb-3">
          <label for="accountType" class="form-label">Tipo de cuenta *</label>
          <select class="form-select" id="accountType" required>
            <option value="">Selecciona el tipo</option>
            <option value="ahorro">Caja de ahorro</option>
            <option value="corriente">Cuenta corriente</option>
          </select>
        </div>
        
        <small class="text-muted">* Campos obligatorios</small>
      </div>
    `;
  }
}

function formasDePago() {
  document.querySelectorAll('.payment-type').forEach(r => {
    r.addEventListener('change', (e) => {
      console.log('Pago:', r.dataset.name);
      mostrarCamposPago(r.value);
    });
  });
  
  const defaultPayment = document.querySelector('input[name="paymentType"]:checked');
  if (defaultPayment) {
    mostrarCamposPago(defaultPayment.value);
  }
}

function validarCamposPago() {
  const pagoSel = document.querySelector('input[name="paymentType"]:checked');
  if (!pagoSel) return false;
  
  if (pagoSel.value === 'creditCard') {
    const cardNumber = (document.getElementById('cardNumber').value || '').trim().replace(/\s/g, '');
    const cardName = (document.getElementById('cardName').value || '').trim();
    const cardExpiry = (document.getElementById('cardExpiry').value || '').trim();
    const cardCVV = (document.getElementById('cardCVV').value || '').trim();
    
    if (!cardNumber || cardNumber.length < 13) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa un número de tarjeta válido."
        });
      return false;
    }
    if (!cardName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa el nombre del titular."
        });
      return false;
    }
    if (!cardExpiry || cardExpiry.length !== 5) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa una fecha de vencimiento válida (MM/AA)."
        });
      return false;
    }
    if (!cardCVV || cardCVV.length < 3) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa un CVV válido."
        });
      return false;
    }
    
  } else if (pagoSel.value === 'bankTransfer') {
    const bankName = (document.getElementById('bankName').value || '').trim();
    const accountHolder = (document.getElementById('accountHolder').value || '').trim();
    const accountNumber = (document.getElementById('accountNumber').value || '').trim();
    const accountType = (document.getElementById('accountType').value || '').trim();
    
    if (!bankName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor selecciona tu banco."
        });
      return false;
    }
    if (!accountHolder) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa el titular de la cuenta."
        });
      return false;
    }
    if (!accountNumber) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa el número de cuenta."
        });
      return false;
    }
    if (!accountType) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor selecciona el tipo de cuenta."
        });
      return false;
    }
  }
  
  return true;
}

function chequeosAlComprar() {
  const btn = document.getElementById('btnComprar');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const departmento = (document.getElementById('department').value || '').trim();
    const localidad = (document.getElementById('locality').value || '').trim();
    const calle = (document.getElementById('street').value || '').trim();
    const numero = (document.getElementById('number').value || '').trim();
    if (!departmento || !localidad || !calle || !numero) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completa los campos de dirección obligatorios."
        });
      return;
    }
    
    if (!validarCamposPago()) {
      return;
    }
    
    const envioSel = document.querySelector('input[name="shippingType"]:checked');
    const pagoSel = document.querySelector('input[name="paymentType"]:checked');
    
    let paymentData = { method: pagoSel.value || '', name: pagoSel.dataset.name || '' };
    
    if (pagoSel.value === 'creditCard') {
      paymentData.cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '').slice(-4); // Solo últimos 4 dígitos
      paymentData.cardName = document.getElementById('cardName').value;
    } else if (pagoSel.value === 'bankTransfer') {
      paymentData.bankName = document.getElementById('bankName').value;
      paymentData.accountHolder = document.getElementById('accountHolder').value;
      paymentData.accountType = document.getElementById('accountType').value;
    }
    
    const orden = {
      cart,
      shipping: { name: envioSel.dataset.name || '', pct: parseFloat(envioSel.value || 0) },
      address: {
        departmento, localidad, calle, numero, esquina: (document.getElementById('corner').value || '').trim()
      },
      payment: paymentData,
      date: new Date().toISOString()
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orden));
    localStorage.removeItem('cart');
    Swal.fire({
    title: "Compra realizada con éxito.!",
    icon: "success",
    draggable: true
    });
    formarCarrito(); 
  });
}