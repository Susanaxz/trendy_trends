import { API_URL_CATEGORY, MY_JSON } from "./config.js";
import cart from "./cartModule.js";

/*
Get category from URL obtiene un parámetro de la URL utilizando el método URLSearchParams.
Este método devuelve un objeto URLSearchParams que permite acceder a los parámetros de la URL.
En este caso, se obtiene el valor del parámetro "category" con el método get.
*/
function getCategoryFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("category");
}

/*
Hace una petición asíncrona a la API Fake Store para obtener los productos de una categoría.
Retorna un JSON con los productos de la categoría indicada. Si hay un error, retorna un array vacío.
*/
export async function loadProductsFromAPI(category) {
  try {
    const responseAPI = await fetch(API_URL_CATEGORY + `${category}`);
    return await responseAPI.json();
  } catch (error) {
    console.error("Error al cargar productos de la API", error);
    return [];
  }
}

/*
Aquí hacemos lo mismo que en la función anterior 
pero con un JSON local con el resto de productos
*/
export async function loadProductsFromJson() {
  try {
    const responseMyJson = await fetch(MY_JSON);
    return await responseMyJson.json();
  } catch (error) {
    console.error("Error al cargar productos del JSON", error);
    return [];
  }
}

/*
Esta función recibe un array de productos desde la API o el JSON local y una categoría.
Si la categoría no es nula, filtra los productos por la categoría indicada.
Devuelve un array con los productos filtrados por categoría o el array original si la categoría es nula.
*/
export function filterProductsByCategory(products, category) {
  return category
    ? products.filter((product) => product.category === category)
    : products;
}


/*
La función loadProducts es la encargada de cargar los productos en la página.
Lo hace determinando si vienen de la API o del JSON local, filtrándolos por categoría y mostrándolos en la página.
Además, también realiza una paginación, mostrando 4 productos por página.
Se encarga de renderizar los productos y de actualizar los enlaces de paginación
*/
export async function loadProducts(page = 1) {
  const productsPerPage = 4;
  console.log("Cargando productos");
  const categoryFromUrl = getCategoryFromUrl();
  let products = [];

  const apiCategories = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];
  if (apiCategories.includes(categoryFromUrl)) {
    products = await loadProductsFromAPI(categoryFromUrl);
  } else {
    products = await loadProductsFromJson();
  }

  products = filterProductsByCategory(products, categoryFromUrl);

  // Calcular el rango de productos a mostrar basado en la página actual
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);

  renderProducts(productsToShow);
  const totalPages = Math.ceil(products.length / productsPerPage);
  updatePaginationLinks(page, totalPages, loadProducts);
}


/*
Esta función es la encargada de extender la descripción de los productos.
Por defecto, la descripción de los productos se muestra recortada a 3 líneas
con ayuda de CSS. Al hacer click en el enlace "Ver más" se muestra la descripción completa.
En caso de que la descripción esté extendida, al hacer click en el enlace "Ver menos" se oculta.
PreviousElementSibling es una propiedad de solo lectura que devuelve el elemento inmediatamente anterior.

*/
export function extendsDescription() {
  document.querySelectorAll(".more-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const description = this.previousElementSibling;

      if (description.classList.contains("description-extended")) {
        description.classList.remove("description-extended");
        this.textContent = "Ver más +";
      } else {  
        description.classList.add("description-extended");
        this.textContent = "Ver menos -";
      }
    }
    );
  });
}

/*
Esta función es la encargada de renderizar los productos en la página.
Recibe un array de productos y los muestra en la página.
Para cada producto, crea un elemento HTML con la información del producto y lo añade al contenedor de productos.
Además, añade un botón de compra y un botón de favoritos todavía sin funcionalidad. (hacer a futuro)
TODO: Añadir funcionalidad al botón de favoritos
*/
export function renderProducts(products) {
  const productsContainer = document.querySelector("#products-container");

  if (productsContainer) {
    productsContainer.textContent = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card", "card-product");

      const img = document.createElement("img");
      img.src = product.image;
      img.alt = `Imagen de ${product.title}`;
      img.classList.add("card-img-top");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = product.title;

      const description = document.createElement("p");
      description.textContent = product.description;
      description.classList.add("card-text");
      description.classList.add("description");

      const moreLink = document.createElement("a");
      moreLink.href = "#";
      moreLink.textContent = "Ver más +";
      moreLink.classList.add("more-link");
      

      const price = document.createElement("div");
      price.textContent = `${product.price} €`;
      price.classList.add("precio", "mb-2");

      const rating = document.createElement("div");
      rating.classList.add("rating", "mb-2");

      const ratingRate = document.createElement("span");
      ratingRate.textContent = `${product.rating.rate} `;
      ratingRate.classList.add("rate");

      const ratingStars = generateRatingStars(product.rating.rate);
      const ratingElement = document.createElement("div");
      ratingElement.classList.add("rating");
      ratingElement.appendChild(ratingStars);

      const ratingCount = document.createElement("span");
      ratingCount.textContent = `(${product.rating.count})`;
      ratingCount.classList.add("count");

      rating.appendChild(ratingRate);
      rating.appendChild(ratingElement);
      rating.appendChild(ratingCount);

      const buyButton = document.createElement("button");
      buyButton.textContent = "Comprar";
      buyButton.classList.add("btn", "btn-login", "btn-buy");
      
      buyButton.addEventListener("click", function () {
        const selectedSizeInput = cardBody.querySelector(
          'input[name="talla' + product.id + '"]:checked'
        );
        const selectedSize = selectedSizeInput
          ? selectedSizeInput.value
          : "Única"; // Si no hay ninguna talla indicará única

        cart.addProduct({
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          size: selectedSize,
          amount: 1,
        });
        console.log("Producto añadido al carrito", product.title, selectedSize);
        // llamada para actualizar el carrito
        
        cart.renderCart();
        
      });

      const favButton = document.createElement("button");
      favButton.classList.add("btn", "btn-outline-danger", "btn-fav");

      const favIcon = document.createElement("i");
      favIcon.classList.add("far", "fa-heart");

      productCard.appendChild(img);
      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(moreLink);
      cardBody.appendChild(price);
      // Añado las tallas si el producto tiene con la función addSizes
      addSizes(product, cardBody);
      cardBody.appendChild(rating);
      cardBody.appendChild(buyButton);

      favButton.appendChild(favIcon);
      cardBody.appendChild(favButton);

      productCard.appendChild(cardBody);

      productsContainer.appendChild(productCard);

      
      // Añado la clase loaded para que se visualice la animación de carga de los productos
      setTimeout(() => {
        productCard.classList.add("loaded");
      }, 100);
    });
    extendsDescription();
  }
}

/*
Esta función añade las tallas a los productos si tienen.
Recibe un producto y el cardBody del producto y añade las tallas al cardBody.
Diferencia cada producto por su id y añade un input radio y un label para cada talla.
*/
function addSizes(product, cardBody) {
  if (product.sizes) {
    const sizes = document.createElement("div");
    sizes.classList.add("tallas", "mb-2");

    const sizesTitle = document.createElement("h6");
    sizesTitle.textContent = "Tallas:";
    sizes.appendChild(sizesTitle);

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    btnGroup.setAttribute("role", "group");
    btnGroup.setAttribute("aria-label", "Basic radio toggle button group");

    product.sizes.forEach((size) => {
      const sizeInput = document.createElement("input");
      sizeInput.type = "radio";
      sizeInput.classList.add("btn-check");
      sizeInput.name = `talla${product.id}`;
      sizeInput.id = `talla${product.id}${size}`;
      sizeInput.value = size;

      const sizeLabel = document.createElement("label");
      sizeLabel.classList.add("btn", "btn-outline-secondary");
      sizeLabel.setAttribute("for", `talla${product.id}${size}`);
      sizeLabel.textContent = size;

      btnGroup.appendChild(sizeInput);
      btnGroup.appendChild(sizeLabel);
    });

    cardBody.appendChild(sizes);
    sizes.appendChild(btnGroup);
  }
}


/*
La función manejador del menú de categorías se encarga de
hacer un pushState al historial del navegador para que se actualice la URL
y se pueda navegar entre categorías.
Además, llama a la función loadProducts para cargar los productos de la categoría seleccionada.
*/
export function handleMenuLinks(event) {
  const category = event.target.dataset.category; 

  if (category) {
    window.history.pushState(
      { category: category },
      null,
      `products.html?category=${category}`
    );
    loadProducts(); 
  }
}


/*
Esta función es la encargada de añadir las clases necesarias para
que se muestren las estrellas de valoración de los productos.
Añade un elemento i con la clase fas para las estrellas llenas,
un elemento i con la clase fas y fa-star-half-alt para las estrellas medias
y un elemento i con la clase far para las estrellas vacías.
*/
function createStarElement(full, half) {
  const star = document.createElement("i");
  star.classList.add("fa-star");
  if (full) {
    star.classList.add("fas"); // Estrella llena
  } else if (half) {
    star.classList.add("fas", "fa-star-half-alt"); // Estrella media
  } else {
    star.classList.add("far"); // Estrella vacía
  }
  return star;
}

/*
Esta función complementa a la función createStarElement.
Recibe un número de valoración y genera un fragmento de documento con las estrellas correspondientes.
El cálculo por una cuestión estética se hace con un bucle for que va de 2 a 6. No del 1 al 5 como 
correspondería a la valoración de un producto.
    Esto recibe el parámetro rating encargado de la valoración del producto.
    Compara si i es menor o igual que la valoración redondeada hacia abajo.
    Si es así, añade una estrella llena. Si i es igual a la valoración redondeada
    hacia arriba y la valoración no es un número entero,
    añade una estrella media. Si no, añade una estrella vacía.
*/
function generateRatingStars(rating) {
  const stars = document.createDocumentFragment();
  for (let i = 2; i <= 6; i++) {
    if (i <= Math.floor(rating)) {
      stars.appendChild(createStarElement(true, false));
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.appendChild(createStarElement(false, true)); // Agrega una estrella media si es necesario
    } else {
      stars.appendChild(createStarElement(false, false));
    }
  }
  return stars;
}

/*
La función updatePaginationLinks se encarga de actualizar los enlaces de paginación.
Recibe el número de página actual, el número total de páginas y una función de callback.
Borra los enlaces de paginación en el html y los vuelve a crear con los parámetros indicados.
Además, añade un evento click a cada enlace para que al hacer click se llame a la función de callback.
Callback es la función encargada de cargar los productos de la página.
He añadido un máximo de 3 páginas a mostrar para que no se vean demasiados enlaces de paginación.
Esta función la he exportado para que pueda ser utilizada en el archivo showProductsIndex.js
con la finalidad que me muestre también paginado los productos filtrados por género.
*/
export function updatePaginationLinks(currentPage, totalPages, callback) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const maxPagesToShow = 3; // Máximo de páginas a mostrar
  let startPage = Math.max(currentPage - 1, 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  // Ajustar si estamos cerca del final
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  // Botón 'Anterior'
  createPaginationLink(currentPage - 1, "Anterior", callback, currentPage > 1);

  // Enlaces de página
  for (let i = startPage; i <= endPage; i++) {
    createPaginationLink(i, i.toString(), callback, true, currentPage === i);
  }

  // Botón 'Siguiente'
  createPaginationLink(
    currentPage + 1,
    "Siguiente",
    callback,
    currentPage < totalPages
  );
}

/*
Esta función es la encargada de crear los enlaces de paginación y mostrarlos en la página.
Recibe el número de página, el texto del enlace, una función de callback, un booleano que indica si está habilitado
y otro booleano que indica si está activo.
Crea un elemento li con la clase page-item y el enlace a con la clase page-link.
Añade un evento click al enlace para que al hacer click se llame a la función de callback.
La función de callback es la encargada de cargar los productos de la página.
Además, añade las clases disabled y active si el enlace no está habilitado o si está activo.
*/
function createPaginationLink(
  page,
  text,
  callback,
  isEnabled,
  isActive = false
) {
  const paginationContainer = document.querySelector(".pagination");
  const li = document.createElement("li");
  li.className = `page-item ${!isEnabled ? "disabled" : ""} ${isActive ? "active" : ""}`;

  const a = document.createElement("a");
  a.className = "page-link";
  a.textContent = text;
  a.href = "#";
  
  if (isEnabled) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      callback(page);
    });
  }
  li.appendChild(a);
  paginationContainer.appendChild(li);
}