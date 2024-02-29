import { loadTemplates, activeLink } from "./templates.js"; // Importamos las funciones de templates.js

import { handleLoginFormSubmit } from "./login.js"; // Importamos las funciones que necesitamos de login.js
import {
  loadProducts,
  extendsDescription,
  handleMenuLinks,
} from "./products.js";
import { handleSignUpFormSubmit } from "./signUp.js"; // Importamos la función de signUp.js
import {loadAndShowProducts} from "./showProductsIndex.js";  // la utilizamos indirectamente si no no carga los productos por genero
import cart from "./cartModule.js"; 

/*
Este es el archivo principal de la aplicación. Aquí se importan las funciones de los demás archivos.
Se inicializan las funciones que se necesitan para que la aplicación funcione correctamente.
Además se configuran los eventos para los formularios y botones.
*/

// Configurar todo cuando el DOM esté completamente cargado.
// Funciones principales de inicialización y configuración de eventos.
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  setupEventListeners();
});

/*
Función principal para inicializar la página. Se encarga de configurar el navbar,
el footer, y de cargar los productos inicialmente. También inicializa y configura
el carrito de compras, incluyendo la carga de los productos en el carrito y la
configuración de la visualización del carrito.

1. Configura los enlaces del menú para manejar los clics, activando la
funcionalidad específica de cada enlace para filtrar productos o navegar.
2. Activa el enlace correspondiente en el menú, dependiendo de la página actual.
3. Configura los eventos para los formularios y botones.
4. Carga los productos a mostrar en la página
5. Inicializa y configura el carrito de compras incluyendo la
   renderización del estado actual del carrito
6. Si estamos en la pasarela de pago, renderiza el resumen del carrito.

*/
function initializePage() {
  loadTemplates().then(() => {
    document.addEventListener("click", (event) => {
      if (event.target.matches(".nav-link")) {
        handleMenuLinks(event);
      }
    });

    activeLink();
    setupEventListeners();

    // Cargar productos
    loadProducts();

    // Inicializar y configurar el carrito
    cart.init();
    cart.loadCart();
    cart.setupCartToggle();
    console.log("Carrito:", cart);
    cart.renderCart();

    // ver si estamos en la pasarela de pago
    if (window.location.pathname.includes("pay")) {
      cart.renderCartSummary(); 
    }

  });
}

/*
Esta función se encarga de configurar los eventos para los formularios y botones.

1. Configura el evento submit para el formulario de registro.
2. Configura el evento submit para el formulario de login.
3. Configura el evento click para los botones "más" de la descripción de los productos.
4. Configura el evento click para el botón de limpiar el carrito.
5. Configuración de enlaces para mostrar productos basados en el género seleccionado,
   modificando la URL para incluir el género como parámetro.
*/
function setupEventListeners() {
  const signupForm = document.querySelector("#signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignUpFormSubmit);
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  }

  const registerForm = document.querySelector("#register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleLoginFormSubmit);
  }

  const moreLinks = document.querySelectorAll(".more-link");
  moreLinks.forEach((link) =>
    link.addEventListener("click", extendsDescription)
  );

  const clearCartButton = document.querySelector("#delete-cart");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => cart.clearCart());
  }

  const showProducts = document.querySelectorAll(".show-products");
  showProducts.forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();

      console.log(event);

      // Determinar el género por el botón que se ha pulsado
      const gender = event.target.textContent === "Mujer" ? "women" : "men";

      window.location.href = `products.html?gender=${gender}`;
    })
  );
}
