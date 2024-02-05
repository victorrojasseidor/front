import { fetchConTokenPost } from './fetch'

async function refresToken (token) {
  const bodyToken = {
    oResults: {

    }
  }

  try {
    const resp = await fetchConTokenPost('General/?Accion=RefreshToken', bodyToken, token)
    return resp
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Hubo un error en la operación asincrónica de refres token')
  }
}

async function getProducts (idEmpresa, token, idCountry) {
  const body = {
    oResults: {
      iIdEmpresa: idEmpresa,
      iIdPais: idCountry
    }
  }

  try {
    const resp = await fetchConTokenPost('BPasS/?Accion=ConsultaProductoEmpresa', body, token)
    return resp
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Hubo un error en la operación asincrónica de token')
  }
}

export {
  refresToken, getProducts

}
