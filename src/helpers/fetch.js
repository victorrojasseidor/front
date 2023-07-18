
const baseApiUrl ='https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/dev/General/?Accion=';


const fetchNoTokenPost = async (endpoint, data) => {
  const url = `${baseApiUrl}${endpoint}`;

  console.log("🔥", data,process.env.NEXT_PUBLIC_X_SAPLICACION,process.env.NEXT_PUBLIC_X_API_KEY);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "saplicacion": process.env.NEXT_PUBLIC_X_SAPLICACION,
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const responseData = await response.json();
    console.log("resfecth", responseData);
  
    return responseData;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};



  export {
    fetchNoTokenPost,
  
  };
  