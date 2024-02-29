import { checkUserLoggedIn } from "./checkUserLogin.js";
import { logOut } from "./logOut.js";


/*
Este archivo es el encargado de cargar las plantillas del navbar y el footer.

La función loadTemplates carga el contenido HTML para el navbar y el footer de la aplicación desde archivos externos.
Utiliza promesas para realizar las solicitudes fetch de manera concurrente y luego inserta
los contenidos cargados en los placeholders correspondientes del DOM. Una vez cargados,
se activa el enlace correspondiente a la página actual y se actualiza el navbar
según el estado de sesión del usuario.

*/
export function loadTemplates() {
  // Crear promesas para cargar navbar y footer
  const navbarPromise = fetch("navbar.html").then((response) =>
    response.text()
  );
  const footerPromise = fetch("footer.html").then((response) =>
    response.text()
  );

  return Promise.all([navbarPromise, footerPromise]).then((values) => {
    document.getElementById("navbar-placeholder").innerHTML = values[0];
    activeLink();
    updateNavbarForSession();

    document.getElementById("footer-placeholder").innerHTML = values[1];
  });
}


/*
Quería que una vez logueado el usuario el icono cambiara a un icono significativo para indicar
que el usuario está logueado, por eso cree la función updateNavbarForSession que se encarga de
actualizar el icono de usuario en el navbar según el estado de la sesión del usuario.

Esta función recoge el elemento con el id "icon-user" y elimina el event listener para evitar que se duplique.
Luego define la lógica basada en el estado de la sesión del usuario, si el usuario está logueado
cambia el icono a un icono de flecha y añade un event listener para que al hacer click en el icono
se desloguee el usuario, si el usuario no está logueado el icono es un icono de usuario y añade un
event listener para que al hacer click en el icono redirija al usuario a la página de login.

*/
export function updateNavbarForSession() {
  const iconUser = document.getElementById("icon-user");

  if (iconUser) {
    // Elimina el event listener para evitar que se duplique
    iconUser.removeEventListener("click", handleIconUserClick);

    // Define la lógica basada en el estado de la sesión del usuario
    if (checkUserLoggedIn()) {
      iconUser.classList.remove("fa-user");
      iconUser.classList.add("fa-right-from-bracket");
      iconUser.addEventListener("click", handleIconUserClick);
    } else {
      console.log("No hay usuario logueado");
      iconUser.classList.add("fa-user");
      iconUser.classList.remove("fa-right-from-bracket");
      iconUser.addEventListener("click", handleIconUserClick);
    }
  } else {
    console.error("Elemento 'icon-user' no encontrado en el navbar.");
  }
}

/*
Esta función se encarga de manejar el evento click en el icono de usuario en el navbar.
Lo que hacer es coger la función de checkUserLoggedIn y si el usuario está logueado
se desloguea, si no redirige al usuario a la página de login.

*/
function handleIconUserClick() {
  if (checkUserLoggedIn()) {
    // Logica para desloguear al usuario
    logOut();
  } else {
    // Redirige al usuario a la página de login
    window.location.href = "login.html";
  }
}


/*
la función activeLink se encarga de activar el enlace correspondiente en el menú,
dependiendo de la página actual. Para ello, obtiene el nombre de la página actual
y recorre todos los enlaces del menú. Si el enlace coincide con la página actual,
le añade la clase "active" para resaltarlo.
*/
export function activeLink() {
  let pageName = window.location.pathname.split("/").pop();
  let links = document.querySelectorAll("nav .nav-link");

  links.forEach((link) => {
    link.classList.remove("active");
    if (link.href.endsWith(pageName)) {
      link.classList.add("active");
    }
  });
}
