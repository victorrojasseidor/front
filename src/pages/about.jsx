import React, { useEffect, useState } from 'react';

function MyPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const { username, email, password } = event.target.elements;

    console.log(username.value, email.value, password.value );
  

    try {
      const response = await fetch(
        "https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/dev/General/?Accion=RegistrarUsuarioInit",
        {
          method: "POST",
          body: JSON.stringify({
            "oResults": {
              "sUserName": username.value,
              "sEmail":  email.value,
              "sPassword": password.value
            }
          }),
          headers: {
            "saplicacion": "BPAS",
            "x-api-key": "LkzMK8wEA38Qdzc22Y0nhaNMU0IYGokq66tOPqf9",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("res", response);

      if (response.ok) {
        const data = await response.json();
        setData(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error(error);
      setError('Error al realizar la solicitud');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Usuario" />
        <input type="email" name="email" placeholder="Correo electrónico" />
        <input type="password" name="password" placeholder="Contraseña" />
        {error && <p>{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default MyPage;
