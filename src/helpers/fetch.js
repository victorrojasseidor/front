const baseApiUrl = 'https://ewtf9yqpwc.execute-api.us-east-2.amazonaws.com/'

const fetchNoTokenPost = async (endpoint, data) => {
  // const url = `${CORS_PROXY_URL}${baseApiUrl}${endpoint}`;
  const url = `${baseApiUrl}${endpoint}`
  const localeSpanish = window.location.href
  const localeES = localeSpanish.includes('/es/')
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        saplicacion: process.env.NEXT_PUBLIC_X_SAPLICACION,
        slanguage: localeES ? 'es' : 'en',
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

const fetchConTokenPost = async (endpoint, data, tok) => {
  const url = `${baseApiUrl}${endpoint}`
  const localeSpanish = window.location.href
  const localeES = localeSpanish.includes('/es/')

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        stoken: `SSd=${tok}`, // Include the token in the Authorization header
        slanguage: localeES ? 'es' : 'en',
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

const decodeText = async (valor) => {
  // Token y clave secreta
  const token = 'a2VzdGVmby9IS2xvbG9wYW4xODA3OTck'
  const secretKey = 'LkzMK8wEA38Qdzc22Y0nhaNMU0IYGokq66tOPqf9'

  // Crear el objeto settings para la solicitud fetch
  const settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      saplicacion: 'BPAS',
      stoken: token,
      'x-api-key': secretKey
    },
    body: JSON.stringify({
      sText: valor
    })
  }

  try {
    const response = await fetch('https://3r6vgy8p58.execute-api.us-east-2.amazonaws.com/dev/General/?Accion=DecodificarTexto', settings)

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
  fetchNoTokenPost, fetchConTokenPost, decodeText

}
