import { fetchConTokenPost } from "./fetch";

async function refresToken (token) {
    let bodyToken = {
      oResults: {
      
      }}

      try {
        const resp=  await fetchConTokenPost("dev/General/?Accion=RefreshToken", bodyToken, token);
          return resp;
          
      } catch (error) {
        console.error("Error:", error);
        throw new Error("Hubo un error en la operación asincrónica de refres token");
      }

      
   }


   export {
    refresToken
  
  };