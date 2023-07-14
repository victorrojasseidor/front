
const baseApiUrl ='https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/dev/General/?Accion=';


  const fetchNoTokenPost = async (endpoint, data) => {
    const url = `${baseApiUrl}${endpoint}`;

    console.log(url);
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
        headers: {
            "saplicacion": process.env.NEXT_PUBLIC_X_SAPLICACION,
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
            "Content-Type": "application/json",
          },  
    });
    
  };


  export {
    fetchNoTokenPost,
  
  };
  