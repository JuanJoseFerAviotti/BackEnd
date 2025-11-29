/* Funcion mostrar perfil extraida de index.js */
document.addEventListener("DOMContentLoaded" , function(){
  const loggedIn = localStorage.getItem("loggedIn");
  const User = JSON.parse(localStorage.getItem("usuario"));
  const usuarioDiv = document.getElementById("usuarioo");
  console.log("Elemento li:", usuarioDiv);

  if (!loggedIn) {
    window.location.href = "login.html";
  } 

  
  /* Generales */
  const contenedorInfoVisible = document.getElementById('contenedorDeProfileInfo')
  const contenedorEditable = document.getElementById('contenedorDeProfileInfoEditing')
  const updateButton = document.getElementById('btUpdateP')
  /* Contenedor Visible */
  const TextName = document.getElementById('my-nombre')
  const TextLastName = document.getElementById('my-apellido')
  const TextNumber = document.getElementById('my-telefono')
  const TextEMail = document.getElementById('my-EMail')
  const TextUser = document.getElementById('my-usuario')
  /* Contenedor Editable */
  const InputName = document.getElementById('nameInput')
  const InputLastName = document.getElementById('lastnameInput')
  const InputPhone = document.getElementById('phoneInput')
  const InputEMail = document.getElementById('eMailInput')
  const InputUser = document.getElementById('my-usuarioEdit')
  const datosGuardados = JSON.parse(localStorage.getItem("usuario"));
  if (datosGuardados) {
    TextUser.textContent = datosGuardados.usuario;
    TextName.textContent = datosGuardados.nombre;
    TextLastName.textContent = datosGuardados.apellido;
    TextNumber.textContent = datosGuardados.numero;
    TextEMail.textContent = datosGuardados.email;

    InputUser.textContent = datosGuardados.usuario;
    InputName.value = datosGuardados.nombre;
    InputLastName.value = datosGuardados.apellido;
    InputPhone.value = datosGuardados.numero;
    InputEMail.value = datosGuardados.email;
    //imageData.value = datosGuardados.imageData;
  }
  /* Estado inicial */
  contenedorInfoVisible.style.display = 'flex'
  contenedorEditable.style.display = 'none'
  updateButton.textContent = 'Editar'
  /* function */

  updateButton.addEventListener('click',()=>{
    
    if (contenedorEditable.style.display === 'none'){
      contenedorInfoVisible.style.display = 'none';
      contenedorEditable.style.display = 'flex';
      updateButton.textContent = 'Guardar';
    
    }else{
      const nombre = InputName.value.trim() || 'Nombre'
      const apellido = InputLastName.value.trim() || 'Apellido'
      const numero = InputPhone.value.trim() || 'Telefono'
      const email = InputEMail.value.trim() || 'EMail'
    
    TextName.textContent = nombre
    TextLastName.textContent = apellido
    TextNumber.textContent = numero
    TextEMail.textContent = email
    const usuario = datosGuardados.usuario

    const perfilUsuario = {usuario, nombre, apellido, numero, email };
      localStorage.setItem("usuario", JSON.stringify(perfilUsuario));
        contenedorInfoVisible.style.display = 'flex'
  contenedorEditable.style.display = 'none'
  updateButton.textContent = 'Editar'
}
    
  })
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveTEButton.click();
    });
});

    

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
//cambiar imagen
  const upload = document.getElementById('upload');
    const profilePic = document.getElementById('userImage');
    const profilePicEdit = document.getElementById('userImageedit');
   
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage){
      profilePic.src = savedImage;
      profilePicEdit.src = savedImage;
    } 
    else profilePic.src = 'img/Sample_User_Icon.png';
    upload.addEventListener('change', () => {
      const file = upload.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
       const imageData = reader.result;
        profilePic.src = imageData;
        localStorage.setItem('profileImage', imageData);
      };
      reader.readAsDataURL(file);
    });