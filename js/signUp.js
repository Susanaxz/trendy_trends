// Función para manejar el evento de envío del formulario de registro de usuarios.

/*
Esta función maneja el evento de envío del formulario de registro.
Se encarga de obtener los valores de los campos del formulario y de verificar si el usuario ya está registrado.
Si el usuario ya está registrado, muestra un mensaje de error y redirige al usuario a la página de login.
Si el usuario no está registrado, lo agrega al localStorage y redirige al usuario a la página de login.

*/
export function handleSignUpFormSubmit(event) {
    event.preventDefault();
    const name = event.target["name"].value;
    const email = event.target["email"].value;
    const password = event.target["new-password"].value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserRegistered = users.find(user => user.email === email);

    if (isUserRegistered) {
        alert('El usuario ya existe, puedes loguearte con tu usuario y contraseña');
        window.location.href = 'login.html';
    } else {
        users.push({
            username: name,
            email: email,
            password: password
        });
        alert('Usuario creado con éxito');
        window.location.href = "login.html";
    }
    localStorage.setItem('users', JSON.stringify(users));
}
