const formatDate = (date) => {
  // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
  const fechaObjeto = new Date(date)

  // Obtener las partes de la fecha (mes, día y año)
  const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0') // +1 porque los meses comienzan en 0
  const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0')
  const año = fechaObjeto.getUTCFullYear()

  // Formatear la fecha en el formato deseado (DD/MM/YYYY)
  const fechaFormateada = `${dia}/${mes}/${año}`
  return fechaFormateada
}

export {
  formatDate

}
