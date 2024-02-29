/*
Esta función se encarga de desloguear al usuario.
Elimina el token, el username y la bandera de autenticación del localStorage.
Redirige al usuario a la página de login
*/

export function logOut() {
  localStorage.removeItem("userToken");
  localStorage.removeItem("username");
  localStorage.removeItem("isAuthenticated"); // Elimina la bandera de autenticación
  console.log("Usuario deslogueado");
  window.location.href = "login.html";
}
