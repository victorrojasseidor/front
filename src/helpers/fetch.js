const baseApiUrl = 'https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/'

// cors
// const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const fetchNoTokenPost = async (endpoint, data) => {
  // const url = `${CORS_PROXY_URL}${baseApiUrl}${endpoint}`;
  const url = `${baseApiUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        saplicacion: process.env.NEXT_PUBLIC_X_SAPLICACION,
        'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
        'Content-Type': 'application/json'
        // configurations to proxy:
        // "origin": "https://bpass-ja335w0fd-ninoska2000.vercel.app", // Agrega el origin requerido
        // "x-requested-with": "XMLHttpRequest",
      }
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('error', error)
    throw error
  }
}

const fetchConTokenPost = async (endpoint, data, tok) => {
  const url = `${baseApiUrl}${endpoint}`
  console.log('token', `SSd=${tok}`)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        stoken: `SSd=${tok}`, // Include the token in the Authorization header
        saplicacion: process.env.NEXT_PUBLIC_X_SAPLICACION,
        'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
        'Content-Type': 'application/json'

      }
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()

    return responseData
  } catch (error) {
    console.error('error', error)
    throw error
  }
}

export {
  fetchNoTokenPost, fetchConTokenPost

}
