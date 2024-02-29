import {
  loadProductsFromAPI,
  loadProductsFromJson,
  renderProducts,
  updatePaginationLinks,
} from "./products.js";


/*
Inicialmente decidí la filtración de productos de la home en el archivo showProductsIndex.js,
En este archivo se encuentra la función filterProductsByGender que recibe un array de productos y un género.
Para que tuviera en cuenta las categorías de mujer y hombre cree un array que recopila las categorías de cada género
y con la función filter se filtran los productos según el género que se recibe como parámetro.
*/
function filterProductsByGender(products, gender) {
  const categoriesWomen = [
    "jewelery",
    "women-coats",
    "women-hoodies",
    "women-t-shirt",
    "blouses",
    "women-pants",
    "women's clothing",
  ];

  const categoriesMen = [
    "accessories",
    "coats",
    "men-t-shirt",
    "men-hoddies",
    "men-shirt",
    "pants",
    "men's clothing",
  ];

  return products.filter((product) => {
    return gender === "women" ? categoriesWomen.includes(product.category) : categoriesMen.includes(product.category);
  });
}
// utilizo el objeto window.location.pathname para saber si estoy en la página de productos
// y si es así, llamo a la función loadAndShowProducts
if (window.location.pathname.includes("products.html")) {
  loadAndShowProducts();
}


/*
Esta función es asíncrona para esperar a que se carguen los productos de la API y del archivo JSON.

Esta función recibe un parámetro que es el nº de página, si no se recibe ningún parámetro se asigna el valor 1.
Luego se obtiene el género de la url con el objeto URLSearchParams.
Se obtienen los productos de la API y del archivo JSON y se concatenan en un solo array.
Luego se filtran los productos según el género y se calcula el nº de páginas que se necesitarán,
para mostrar todos los productos.
Con la función renderProducts se muestran los productos que se deben mostrar en la página actual, 
pasando como parámetro el subconjunto de productos que se deben mostrar.
Con la función updatePaginationLinks se actualizan los links de la paginación. (importado de products.js)
UpdatePaginationLinks recibe como parámetro la página actual y el nº de páginas que se necesitarán,
se hace una llamada asíncrona a la función loadAndShowProducts con el nº de página que se ha seleccionado.
*/
export async function loadAndShowProducts(page = 1) {
  const urlParams = new URLSearchParams(window.location.search); // Busca los parámetros de la url
  const gender = urlParams.get("gender");
  const productsPerPage = 4;

  if (gender) {
    console.log(gender);
    const productsJson = await loadProductsFromJson();
    const productsApi = await loadProductsFromAPI();
    
    const allProducts = productsJson.concat(productsApi);

    const filteredProducts = filterProductsByGender(allProducts, gender);
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage); 
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex); // hace un subconjunto a mostrar

    renderProducts(productsToShow);
    updatePaginationLinks(page, totalPages, async (newPage) => {
      await loadAndShowProducts(newPage);
    });
  }
}
