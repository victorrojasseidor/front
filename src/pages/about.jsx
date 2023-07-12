import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  
  const handleSubmit = async (e) => {
    console.log("log ");
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const credentials = {
        sUserName: username,
        sEmail: email,
        sPassword: password,
      };


      
      console.log("Crednecia", credentials);

      // Realizar solicitud a la API de registro de usuarios
      const response = await fetch(
        "https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/dev/General/?Accion=RegistrarUsuarioInit",
        {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "saplicacion": "BPAS",
              "x-api-key": "LkzMK8wEA38Qdzc22Y0nhaNMU0IYGokq66tOPqf9",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Respuest",response);

      if (response.ok) {
        // Si la respuesta es exitosa, mostrar mensaje de éxito o redireccionar a otra página
        console.log("Inicio de sesión exitoso");
      } else {
        // Si la respuesta es un error, mostrar mensaje de error
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Usuario" />
        <input type="email" name="email" placeholder="Correo electrónico" />
        <input type="password" name="password" placeholder="Contraseña" />
        {error && <p>{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
