document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const perfilUsuario = {usuario, nombre:'', apellido:'', numero:'', email:'' ,ProfileImage:''};
      perfilUsuario.usuario = document.getElementById("usuario").value;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("usuario", JSON.stringify(perfilUsuario));
      console.log("Guardado en localStorage:", perfilUsuario.usuario);

      window.location.href = "index.html";
    });


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