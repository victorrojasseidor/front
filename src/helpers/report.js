import excel from 'exceljs';

const formatDate = (date) => {
  // Crear un objeto Date a partir de la fecha ISO y asegurarse de que esté en UTC
  const fechaObjeto = new Date(date);

  // Obtener las partes de la fecha (mes, día y año)
  const mes = (fechaObjeto.getUTCMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses comienzan en 0
  const dia = fechaObjeto.getUTCDate().toString().padStart(2, '0');
  const año = fechaObjeto.getUTCFullYear();

  // Formatear la fecha en el formato deseado (DD/MM/YYYY)
  const fechaFormateada = `${dia}/${mes}/${año}`;
  return fechaFormateada;
};

function exportToExcelFormat(data, fileName, headers, rowDatatrans) {
  if (data && data.length > 0) {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define las columnas del archivo Excel sin aplicar el estilo para el encabezado
    worksheet.columns = headers;

    // Define los estilos predeterminados para el encabezado
    const headerStyle = {
      font: { color: { argb: 'FFFFFF' }, bold: true },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4318FF' } },
    };

    // Define los estilos predeterminados para las celdas de datos
    const cellStyle = {
      font: { color: { argb: '000000' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'hair' },
        left: { style: 'hair' },
        bottom: { style: 'hair' },
        right: { style: 'hair' },
      },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FDFF' } },
    };

    // Aplica el estilo de encabezado solo a la primera fila (fila 1)
    worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    // Agrega los datos a las filas del archivo Excel con estilos de celda
    data.forEach((row) => {
      // Formatear la fila de datos según la función proporcionada
      const rowData = rowDatatrans(row);
      worksheet.addRow(rowData).eachCell((cell) => (cell.style = cellStyle)); // Aplica el estilo de datos
    });

    // Guarda el archivo Excel y lo descarga en el navegador
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error writing Excel file:', error);
      });
  }
}

const IconArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="9"
      viewBox="0 0 19 9"
      fill="none"
    >
      <path
        d="M9.49953 8.80062C8.79953 8.80062 8.09953 8.53063 7.56953 8.00063L1.04953 1.48062C0.759531 1.19062 0.759531 0.710625 1.04953 0.420625C1.33953 0.130625 1.81953 0.130625 2.10953 0.420625L8.62953 6.94062C9.10953 7.42062 9.88953 7.42062 10.3695 6.94062L16.8895 0.420625C17.1795 0.130625 17.6595 0.130625 17.9495 0.420625C18.2395 0.710625 18.2395 1.19062 17.9495 1.48062L11.4295 8.00063C10.8995 8.53063 10.1995 8.80062 9.49953 8.80062Z"
        fill="#7E92A2"
      />
    </svg>
  );
};

const IconDate = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
    >
      <path
        d="M5.16667 3.79102C4.825 3.79102 4.54167 3.50768 4.54167 3.16602V0.666016C4.54167 0.324349 4.825 0.0410156 5.16667 0.0410156C5.50833 0.0410156 5.79167 0.324349 5.79167 0.666016V3.16602C5.79167 3.50768 5.50833 3.79102 5.16667 3.79102Z"
        fill="#7E92A2"
      />
      <path
        d="M11.8333 3.79102C11.4917 3.79102 11.2083 3.50768 11.2083 3.16602V0.666016C11.2083 0.324349 11.4917 0.0410156 11.8333 0.0410156C12.175 0.0410156 12.4583 0.324349 12.4583 0.666016V3.16602C12.4583 3.50768 12.175 3.79102 11.8333 3.79102Z"
        fill="#7E92A2"
      />
      <path
        d="M5.58333 11.0827C5.475 11.0827 5.36667 11.0577 5.26667 11.016C5.15833 10.9744 5.075 10.916 4.99167 10.841C4.84167 10.6827 4.75 10.4744 4.75 10.2494C4.75 10.141 4.775 10.0327 4.81667 9.93268C4.85833 9.83268 4.91667 9.74103 4.99167 9.6577C5.075 9.5827 5.15833 9.52434 5.26667 9.48268C5.56667 9.35768 5.94167 9.42436 6.175 9.6577C6.325 9.81603 6.41667 10.0327 6.41667 10.2494C6.41667 10.2994 6.40833 10.3577 6.4 10.416C6.39167 10.466 6.375 10.516 6.35 10.566C6.33333 10.616 6.30833 10.666 6.275 10.716C6.25 10.7577 6.20833 10.7993 6.175 10.841C6.01667 10.991 5.8 11.0827 5.58333 11.0827Z"
        fill="#7E92A2"
      />
      <path
        d="M8.5 11.0827C8.39167 11.0827 8.28333 11.0577 8.18333 11.016C8.075 10.9744 7.99167 10.916 7.90833 10.841C7.75833 10.6827 7.66667 10.4743 7.66667 10.2493C7.66667 10.141 7.69167 10.0327 7.73333 9.93267C7.775 9.83267 7.83333 9.74102 7.90833 9.65769C7.99167 9.58269 8.075 9.52433 8.18333 9.48267C8.48333 9.34933 8.85833 9.42435 9.09167 9.65769C9.24167 9.81602 9.33333 10.0327 9.33333 10.2493C9.33333 10.2993 9.325 10.3577 9.31667 10.416C9.30833 10.466 9.29166 10.516 9.26666 10.566C9.25 10.616 9.225 10.666 9.19167 10.716C9.16667 10.7577 9.125 10.7993 9.09167 10.841C8.93333 10.991 8.71667 11.0827 8.5 11.0827Z"
        fill="#7E92A2"
      />
      <path
        d="M11.4167 11.0827C11.3083 11.0827 11.2 11.0577 11.1 11.016C10.9917 10.9744 10.9083 10.916 10.825 10.841C10.7917 10.7993 10.7583 10.7577 10.725 10.716C10.6917 10.666 10.6667 10.616 10.65 10.566C10.625 10.516 10.6083 10.466 10.6 10.416C10.5917 10.3577 10.5833 10.2993 10.5833 10.2493C10.5833 10.0327 10.675 9.81602 10.825 9.65769C10.9083 9.58269 10.9917 9.52433 11.1 9.48267C11.4083 9.34933 11.775 9.42435 12.0083 9.65769C12.1583 9.81602 12.25 10.0327 12.25 10.2493C12.25 10.2993 12.2417 10.3577 12.2333 10.416C12.225 10.466 12.2083 10.516 12.1833 10.566C12.1667 10.616 12.1417 10.666 12.1083 10.716C12.0833 10.7577 12.0417 10.7993 12.0083 10.841C11.85 10.991 11.6333 11.0827 11.4167 11.0827Z"
        fill="#7E92A2"
      />
      <path
        d="M5.58333 13.9994C5.475 13.9994 5.36667 13.9744 5.26667 13.9327C5.16667 13.891 5.075 13.8327 4.99167 13.7577C4.84167 13.5993 4.75 13.3827 4.75 13.166C4.75 13.0577 4.775 12.9493 4.81667 12.8493C4.85833 12.741 4.91667 12.6494 4.99167 12.5744C5.3 12.266 5.86667 12.266 6.175 12.5744C6.325 12.7327 6.41667 12.9494 6.41667 13.166C6.41667 13.3827 6.325 13.5993 6.175 13.7577C6.01667 13.9077 5.8 13.9994 5.58333 13.9994Z"
        fill="#7E92A2"
      />
      <path
        d="M8.5 13.9994C8.28333 13.9994 8.06667 13.9077 7.90833 13.7577C7.75833 13.5993 7.66667 13.3827 7.66667 13.166C7.66667 13.0577 7.69167 12.9493 7.73333 12.8493C7.775 12.741 7.83333 12.6494 7.90833 12.5744C8.21667 12.266 8.78333 12.266 9.09167 12.5744C9.16667 12.6494 9.225 12.741 9.26666 12.8493C9.30833 12.9493 9.33333 13.0577 9.33333 13.166C9.33333 13.3827 9.24167 13.5993 9.09167 13.7577C8.93333 13.9077 8.71667 13.9994 8.5 13.9994Z"
        fill="#7E92A2"
      />
      <path
        d="M11.4167 13.9994C11.2 13.9994 10.9833 13.9077 10.825 13.7577C10.75 13.6827 10.6917 13.591 10.65 13.4827C10.6083 13.3827 10.5833 13.2744 10.5833 13.166C10.5833 13.0577 10.6083 12.9494 10.65 12.8494C10.6917 12.741 10.75 12.6494 10.825 12.5744C11.0167 12.3827 11.3083 12.291 11.575 12.3494C11.6333 12.3577 11.6833 12.3744 11.7333 12.3994C11.7833 12.416 11.8333 12.4411 11.8833 12.4744C11.925 12.4994 11.9667 12.5411 12.0083 12.5744C12.1583 12.7327 12.25 12.9494 12.25 13.166C12.25 13.3827 12.1583 13.5994 12.0083 13.7577C11.85 13.9077 11.6333 13.9994 11.4167 13.9994Z"
        fill="#7E92A2"
      />
      <path
        d="M15.5833 7.19932H1.41667C1.075 7.19932 0.791667 6.91599 0.791667 6.57432C0.791667 6.23265 1.075 5.94932 1.41667 5.94932H15.5833C15.925 5.94932 16.2083 6.23265 16.2083 6.57432C16.2083 6.91599 15.925 7.19932 15.5833 7.19932Z"
        fill="#7E92A2"
      />
      <path
        d="M11.8333 17.9577H5.16667C2.125 17.9577 0.375 16.2077 0.375 13.166V6.08268C0.375 3.04102 2.125 1.29102 5.16667 1.29102H11.8333C14.875 1.29102 16.625 3.04102 16.625 6.08268V13.166C16.625 16.2077 14.875 17.9577 11.8333 17.9577ZM5.16667 2.54102C2.78333 2.54102 1.625 3.69935 1.625 6.08268V13.166C1.625 15.5494 2.78333 16.7077 5.16667 16.7077H11.8333C14.2167 16.7077 15.375 15.5494 15.375 13.166V6.08268C15.375 3.69935 14.2167 2.54102 11.8333 2.54102H5.16667Z"
        fill="#7E92A2"
      />
    </svg>
  );
};

export { formatDate, IconArrow, IconDate, exportToExcelFormat };
