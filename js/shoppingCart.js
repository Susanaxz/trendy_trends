/* 
He optado por crear una clase ShoppingCart para gestionar el carrito de la compra.
Gestiona la adición, eliminación y actualización de productos en el carrito,
así como el cálculo del total y el almacenamiento local para persistir el estado del carrito entre sesiones.

La clase ShoppingCart tiene los siguientes métodos:

- El constructor inicializa un array de productos vacío para almacenar los productos.
- getUserName: obtiene el nombre de usuario del localStorage.
- getCartKey: genera una clave única para el carrito en localStorage basada en el nombre de usuario.
              eso permite que cada usuario tenga su propio carrito aunque estén en el mismo ordenador.
- init: inicializa el carrito, carga los productos guardados en localStorage.
- setupCartToggle: Configura los eventos para abrir y cerrar el carrito mediante botones específicos en la UI.
                   Permite a los usuarios mostrar y ocultar el carrito con facilidad.
- toggle: muestra o esconde el carrito. Alterna la visibilidad del carrito en pantalla.
- renderCart: renderiza el contenido del carrito en el DOM añade los botones de eliminar y cambiar cantidad.
- addRemoveEvent: añade los eventos a los botones de eliminar y cambiar cantidad.
- getTotal: calcula el total del carrito.
- updateTotal: Actualiza el precio del carrito y se usa en otros métodos para actualizar el total.
- clearCart: limpia el carrito y el localStorage.
- saveCart: guarda el estado actual del carrito en localStorage.
- loadCart: carga el carrito desde localStorage y lo pinta en el DOM.
- addProduct: añade un producto al carrito y lo guarda en localStorage.
- removeProduct: elimina un producto del carrito y lo guarda en localStorage.
- changeProductQuantity: cambia la cantidad de un producto del carrito y lo guarda en localStorage.
- renderCartSummary: renderiza el resumen del carrito en el DOM para usar después en la pasarela de pago.
- updateCartCount: actualiza el contador del carrito para que de un número de elementos y ese nº ponerlo en el navbar.
*/

export class ShoppingCart {
  constructor() {
    this.products = [];
  }

  //Métodos auxiliares para obtener el nombre de usuario y la clave del carrito
  getUserName() {
    return localStorage.getItem("username");
  }

  // Genera una clave única para el carrito en localStorage basada en el nombre de usuario
  getCartKey() {
    const username = this.getUserName();
    return username ? `shoppingCart-${username}` : "shoppingCart";
  }

  // Inicializa el carrito, carga los productos guardados en localStorage
  init() {
    console.log("Inicializando ShoppingCart");
    this.loadCart();
    this.updateCartCount();
  }

  // configura los eventos para abrir y cerrar el carrito
  setupCartToggle() {
    const cartButton = document.querySelector("#cart-button");
    console.log("Botón del carrito:", cartButton);
    const cartCloseButton = document.querySelector("#cart-close-button");

    if (cartButton) {
      cartButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.toggle();
      });
    }

    if (cartCloseButton) {
      cartCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.toggle();
      });
    }
  }

  // muestra o esconde el carrito
  toggle() {
    const cart = document.querySelector("#cartSlider");
    if (cart) {
      cart.classList.toggle("active-cart");
    }
  }

  // Renderiza el contenido del carrito en el DOM añade los botones de eliminar y cambiar cantidad
  renderCart() {
    const cartContainer = document.querySelector("#cartSlider .cart-content");
    if (!cartContainer) {
      console.error("El contenedor del carrito no fue encontrado.");
      return;
    }

    while (cartContainer.firstChild) {
      cartContainer.removeChild(cartContainer.firstChild);
    }

    if (this.products.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Tu carrito está vacío.";
      cartContainer.textContent = emptyMessage.textContent;
      return;
    }

    this.products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("cart-item");

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;

      const description = document.createElement("p");
      description.textContent = `${product.title} - Talla: ${product.size} - Precio: ${product.price}€`;

      const removeButton = document.createElement("button");
      removeButton.textContent = "Eliminar";
      removeButton.classList.add("remove-product");
      removeButton.dataset.id = product.id;
      removeButton.dataset.size = product.size;
      removeButton.addEventListener("click", () => {
        this.removeProduct(product.id, product.size);
      });

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "-";
      decreaseButton.classList.add("change-quantity", "decrease");
      decreaseButton.dataset.id = product.id;
      decreaseButton.dataset.size = product.size;
      decreaseButton.addEventListener("click", () => {
        this.changeProductQuantity(product.id, product.size, -1);
      });

      const quantitySpan = document.createElement("span");
      quantitySpan.textContent = product.amount;
      quantitySpan.classList.add("quantity");

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.classList.add("change-quantity", "increase");
      increaseButton.dataset.id = product.id;
      increaseButton.dataset.size = product.size;
      increaseButton.addEventListener("click", () => {
        this.changeProductQuantity(product.id, product.size, 1);
      });

      productElement.appendChild(img);
      productElement.appendChild(description);
      productElement.appendChild(removeButton);
      productElement.appendChild(decreaseButton);
      productElement.appendChild(quantitySpan);
      productElement.appendChild(increaseButton);

      cartContainer.appendChild(productElement);
    });

    this.addRemoveEvent();
    this.updateTotal();
  }

  // Añade los eventos a los botones de eliminar y cambiar cantidad
  addRemoveEvent() {
    document.querySelectorAll(".remove-product").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = button.dataset.id;
        const size = button.dataset.size;
        this.removeProduct(id, size);
      });
    });

    document.querySelectorAll(".change-quantity.decrease").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = button.dataset.id;
        const size = button.dataset.size;
        this.changeProductQuantity(id, size, -1);
      });
    });

    document.querySelectorAll(".change-quantity.increase").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = button.dataset.id;
        const size = button.dataset.size;
        this.changeProductQuantity(id, size, 1);
      });
    });
  }

  // Calcula el total del carrito
  getTotal() {
    return this.products.reduce(
      (acc, product) => acc + product.price * product.amount,
      0
    );
  }

  // Pinta el total del carrito en el DOM
  updateTotal() {
    const total = this.getTotal();
    const totalElement = document.querySelector("#total-cart");
    if (totalElement) {
      totalElement.textContent = total.toFixed(2) + "€";
    }
  }

  // Limpia el carrito y el localStorage
  clearCart() {
    this.products = [];
    localStorage.removeItem(this.getCartKey());
    this.renderCart();
    this.updateTotal();
    this.saveCart();
    this.updateCartCount();
  }

  // Guarda el estado actual del carrito en localStorage
  saveCart() {
    localStorage.setItem(this.getCartKey(), JSON.stringify(this.products));
  }

  // Carga el carrito desde localStorage y lo pinta en el DOM
  loadCart() {
    const savedCart = localStorage.getItem(this.getCartKey());
    this.products = savedCart ? JSON.parse(savedCart) : [];
    this.renderCart();
    this.updateCartCount();
  }

  // Añade un producto al carrito y lo guarda en localStorage
  addProduct(product) {
    const existingProductIndex = this.products.findIndex(
      (p) => p.id === product.id && p.size === product.size
    );

    if (existingProductIndex !== -1) {
      // Producto existente, incrementa la cantidad
      this.products[existingProductIndex].amount += product.amount;
    } else {
      // Producto nuevo, lo añade al array
      this.products.push(product);
    }

    this.saveCart(); // Guarda el estado actual del carrito en localStorage
    this.renderCart(); // Actualiza la visualización del carrito
    this.updateCartCount(); // Actualiza el globito del carrito
  }

  removeProduct(productId, productSize) {
    const productIndex = this.products.findIndex(
      (product) => product.id === productId && product.size === productSize
    );
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveCart();
      this.renderCart();
      this.updateCartCount();
    }
  }
  changeProductQuantity(productId, productSize, change) {
    const product = this.products.find(
      (product) => product.id === productId && product.size === productSize
    );
    if (product) {
      product.amount = Math.max(product.amount + change, 1);
      this.saveCart();
      this.renderCart();
      this.updateTotal();
      this.updateCartCount();
    }
  }

  // Renderiza el resumen del carrito en el DOM
  renderCartSummary() {
    const cartSummaryContainer = document.querySelector(".summary-content");
    if (!cartSummaryContainer) return;

    cartSummaryContainer.textContent = "";

    const totalElement = document.createElement("h5");
    totalElement.textContent = `Total del Carrito: ${this.getTotal().toFixed(
      2
    )}€`;

    cartSummaryContainer.appendChild(totalElement);
    this.products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("cart-summary-item");

      const img = document.createElement("img");
      img.setAttribute("src", product.image);
      img.setAttribute("alt", product.title);

      const description = document.createElement("p");
      description.textContent = `${product.title} - Talla: ${product.size} - Cantidad: ${product.amount} - Precio: ${product.price}€`;

      productElement.appendChild(img);
      productElement.appendChild(description);

      cartSummaryContainer.appendChild(productElement);
    });
  }

  updateCartCount() {
    const totalItems = this.products.reduce(
      (total, product) => total + product.amount,
      0
    );
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }
}
