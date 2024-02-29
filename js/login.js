import { setUserAuthenticated } from "./checkUserLogin.js";
import { API_URL } from "./config.js";


/*
Esta función se encarga de manejar el evento submit del formulario de login.
Se obtienen los valores de los campos username y password.
Intenta autenticar al usuario utilizando primero los datos almacenados en localStorage.
Si la autenticación con localStorage falla, realiza un intento de autenticación a través de la API.
En caso de éxito en cualquiera de los métodos, marca al usuario como autenticado y muestra un mensaje de bienvenida.
Si ambos métodos fallan, muestra un mensaje de error al usuario.
*/
export async function handleLoginFormSubmit(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (authenticateWithLocalStorage(username, password)) {
    // Usuario autenticado exitosamente con localStorage
    console.log("Usuario autenticado con localStorage");
    setUserAuthenticated(username);

    welcomeMessage(username);
  } else if (await authenticateWithAPI(username, password)) {
    // Usuario autenticado exitosamente con la API
    console.log("Usuario autenticado con la API");
    setUserAuthenticated(username);

    welcomeMessage(username);
  } else {
    // Autenticación fallida en ambos métodos
    console.log("Error en la autenticación");
    alert("Usuario incorrecto o contraseña incorrecta");
  }
}

/*
Esta función complementa a la función handleLoginFormSubmit.
Autentica un usuario mediante una busqueda en el localStorage.
Busca en el localStorage si existe un usuario con el nombre de usuario y contraseña.
Si el usuario existe, retorna true, si no, retorna false.
*/
function authenticateWithLocalStorage(username, password) {
  const usersJson = localStorage.getItem("users");
  if (usersJson) {
    const users = JSON.parse(usersJson);
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user !== undefined;
  }
  return false;
}

/*
Esta función complementa a la función handleLoginFormSubmit.
Autentica un usuario mediante una solicitud POST a la API fakestoreapi.com.
Realiza una solicitud POST a la API con el nombre de usuario y contraseña.
Si la respuesta incluye un token, la autenticación es exitosa, almacena
el token y el nombre de usuario en localStorage, y retorna true.
Retorna false si la autenticación falla.
*/
async function authenticateWithAPI(username, password) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return false;
    }

    const json = await response.json();
    if (json.token) {
      localStorage.setItem("userToken", json.token);
      localStorage.setItem("username", username);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error en la solicitud a la API", error);
    return false;
  }
}

/*
Muestra un mensaje de bienvenida al usuario y redirige a la página de inicio.
Coloca un mensaje de bienvenida personalizado en la página y redirige al usuario
a la página de inicio después de un breve retraso. Si el elemento contenedor del
mensaje no se encuentra, registra un error.
*/
function welcomeMessage(username) {
  const message = document.querySelector(".message");
  if (message) {
    message.innerHTML = `<div class='welcome-message'>Nos alegra mucho volver a verte por aquí!! ${username.toUpperCase()}</div>`;
    setTimeout(() => {
      window.location.href = "./home.html";
    }, 2000);
  } else {
    console.error("Elemento principal no encontrado");
  }
}
