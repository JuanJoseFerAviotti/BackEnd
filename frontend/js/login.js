document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuarioInput = document.getElementById("usuario").value;
        const passwordInput = document.getElementById("password").value;

        const datosLogin = {
            username: usuarioInput,
            password: passwordInput
        };

        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosLogin)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                localStorage.setItem("token", data.token);

                const perfilUsuario = {
                    usuario: usuarioInput, 
                    nombre: '', 
                    apellido: '', 
                    numero: '', 
                    email: '', 
                    ProfileImage: ''
                };

                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("usuario", JSON.stringify(perfilUsuario));
                
                console.log("Login correcto. Token guardado.");
                window.location.href = "index.html";

            } else {
                alert("Error: " + data.msg);
            }
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            alert("Error al intentar conectar con el servidor.");
        });
    });

    const body = document.body;
    const button = document.getElementById("modeButton");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.replace("light-mode", "dark-mode");
        button.classList.replace("btn-dark", "btn-light");
        button.textContent = "Light Mode";
        // toggleMode(true); 
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
        // toggleMode(isDark);
    });
});