/*
Esta función se encarga de verificar si el usuario está logueado.
Se obtiene el token y el username del localStorage.
Si el usuario está logueado, se devuelve true, si no, se devuelve false.
Se exporta para ser utilizada en el archivo templates.js para actualizar el navbar.
*/
export function checkUserLoggedIn() {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userToken = localStorage.getItem("userToken");
    const username = localStorage.getItem("username");

    if (userToken && username) {
        console.log(`Usuario ${username} está logueado`);
        return true;
    } else if (isAuthenticated === "true") {
        console.log(`Usuario ${username} está logueado`);
        return true;
    } else {
        return false;
    }
}

/*
Esta función se encarga de: guadar en el LocalStorage si el usuario está logueado.
Marca los indicadores isAuthenticated y username en true.
La función se llama cuando el usuario se loguea correctamente.
Se exporta para ser utilizada en el archivo login.js.
*/
export function setUserAuthenticated(username) {
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("username", username);
}


