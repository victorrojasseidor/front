import { fetchConTokenPost } from './fetch'

async function refresToken (token) {
  const bodyToken = {
    oResults: {

    }
  }

  try {
    const resp = await fetchConTokenPost('dev/General/?Accion=RefreshToken', bodyToken, token)
    return resp
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Hubo un error en la operación asincrónica de refres token')
  }
}

async function getProducts (idEmpresa, token) {
  const body = {
    oResults: {
      iIdEmpresa: idEmpresa,
      iIdPais: 1
    }
  }

  console.log('body prod', body)

  try {
    const resp = await fetchConTokenPost('dev/BPasS/?Accion=ConsultaProductoEmpresa', body, token)
    return resp
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Hubo un error en la operación asincrónica de token')
  }
}

export {
  refresToken, getProducts

}
