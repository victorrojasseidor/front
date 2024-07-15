import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchConTokenPost } from '@/helpers/fetch';
import dayjs from 'dayjs';

import LoadingComponent from '../Atoms/LoadingComponent';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';
import { IconArrow } from '@/helpers/report';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart() {
  const { session, setModalToken, logout, l } = useAuth();

  const currentDay = new Date().getDate();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Suma 1 porque los meses en JavaScript van de 0 a 11

  const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dates, setDates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState(2);
  const [dataType, setDataType] = useState(null);
  const [requestError, setRequestError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = l.Reporting;

  const months = [
    t.January,
    t.February,
    t.March,
    t.April,
    t.May,
    t.June,
    t.July,
    t.August,
    t.September,
    t.October,
    t.November,
    t.December,
  ];

  useEffect(() => {
    const initialDates = getMonthDates(selectedYear, selectedMonth);
    setDates(initialDates);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (dates?.sFechaDesde && dates?.sFechaHasta && selectedCurrency) {
      GetTipoCambioRate(
        dates?.sFechaDesde,
        dates?.sFechaHasta,
        selectedCurrency
      );
    }
  }, [dates, selectedCurrency]);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const getMonthDates = (year, monthIndex) => {
    // Obtener el primer día del mes
    const startDate = dayjs(`${year}-${monthIndex + 1}-01`).format(
      'DD/MM/YYYY'
    );

    // Obtener el último día del mes
    const lastDay = dayjs(`${year}-${monthIndex + 1}`)
      .endOf('month')
      .format('DD');

    // Obtener la fecha final con el último día del mes
    const endDate = dayjs(`${year}-${monthIndex + 1}-${lastDay}`).format(
      'DD/MM/YYYY'
    );

    return { sFechaDesde: startDate, sFechaHasta: endDate };
  };

  // Función para manejar el cambio de mes
  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    const newDates = getMonthDates(selectedYear, newMonth);
    setSelectedMonth(newMonth);
    setDates(newDates);
  };

  // Función para manejar el cambio de año
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    const newDates = getMonthDates(newYear, selectedMonth);
    setSelectedYear(newYear);
    setDates(newDates);
  };

  async function GetTipoCambioRate(fechaDesde, fechaHasta, monedaDestino) {
    setIsLoading(true);

    const body = {
      oResults: {
        sFechaDesde: fechaDesde,
        sFechaHasta: fechaHasta,
        iMoneda: monedaDestino,
      },
    };

    const tok = session?.sToken;
    try {
      const responseData = await fetchConTokenPost(
        'BPasS/?Accion=GetTipoCambioRate',
        body,
        tok
      );
      if (responseData.oAuditResponse.iCode == 1) {
        setRequestError(null);

        setDataType(responseData.oResults);

        setModalToken(false);
      } else if (responseData.oAuditResponse?.iCode === 4) {
        await logout();
      } else if (responseData.oAuditResponse?.iCode === 27) {
        setModalToken(true);
      } else {
        const message = responseData?.oAuditResponse.sMessage;
        setRequestError(message);
        setModalToken(false);
        setTimeout(() => {
          setRequestError(null);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Hubo un error en la operación asincrónica.');
    } finally {
      setIsLoading(false);
    }
  }

  const dataOrderTODate = dataType?.sort((a, b) =>
    a.fecha_tipo_cambio.localeCompare(b.fecha_tipo_cambio)
  );

  const dataTypeTranform = dataOrderTODate?.map((entry, i, array) => {
    const dateType = new Date(entry.fecha_tipo_cambio).getUTCDate();

    const compratype = entry.tipo_cambio_compra;
    const ventaType = entry.tipo_cambio_venta;

    return { date: dateType, compra: compratype, venta: ventaType };
  });

  // trasnsformarDatos para la gráfica
  const dataCompra = dataTypeTranform?.map((entry) => entry.compra);
  const dataVenta = dataTypeTranform?.map((entry) => entry.venta);
  const dataFecha = dataTypeTranform?.map((entry) => entry.date);

  const currentYearMonths =
    Number(currentYear) == Number(selectedYear)
      ? months.slice(0, currentMonth)
      : months;

  const valorMinimoTipeCompra = dataCompra && Math.min(...dataCompra);
  const valorMaximoTipeCompra = dataCompra && Math?.max(...dataCompra);
  const valorMinimoTipeVenta = dataVenta && Math.min(...dataVenta);
  const valorMaximoTipeVenta = dataVenta && Math?.max(...dataVenta);
  const menorValor = Math.min(valorMinimoTipeCompra, valorMinimoTipeVenta);
  const mayorValor = Math.max(valorMaximoTipeCompra, valorMaximoTipeVenta);
  const valorMinimoFecha = dataFecha && Math.min(...dataFecha);
  const valorMaximoFecha = dataFecha && Math.max(...dataFecha);

  // Aplicar descuento del 0.1% al menor valor
  const rangos = mayorValor - menorValor;

  const minValueY = menorValor - menorValor * (rangos >= 2 ? 0.5 : 0.01);

  // Aplicar aumento del 0.1% al mayor valor
  const maxValueY = mayorValor + mayorValor * (rangos >= 2 ? 0.05 : 0.02);

  const minDateX = valorMinimoFecha - valorMinimoFecha * 0.001;
  const maxDateX = valorMaximoFecha + valorMaximoFecha * 0.005;

  const years = Array.from({ length: currentYear - 2022 }, (_, index) =>
    (2023 + index).toString()
  );

  // // Resaltar el día 10 con un color diferente
  const borderColorCompra = dataType?.map((day) =>
    day === currentDay ? '#5DB92C' : '#5DB92C'
  );

  const midata = {
    labels: dataFecha,

    datasets: [
      {
        label: t.Purchase,
        data: dataCompra,
        tension: 0.4,
        fill: 'start',
        borderColorCompra,
        borderColor: 'rgba(5, 205, 153, 0.50)',
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, 'rgba(5, 61, 153, 0.005)'); // Color inicial con opacidad
          gradient.addColorStop(0.1, 'rgba(5, 205, 153, 0.002)'); // Color final con opacidad
          return gradient;
        },
        pointBackgroundColor: '#05CD99',
        pointBorderColor: '#05CD99',
        pointRadius: 2,
        pointHoverRadius: 5,
      },
      {
        label: t.Selling,
        data: dataVenta,
        tension: 0.4,
        fill: 'start',
        borderColor: 'rgba(67, 24, 255, 0.60)',
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height
          );
          gradient.addColorStop(0, 'rgba(67, 24, 255, 0.0030)'); // Primer color inicial con opacidad
          gradient.addColorStop(0.1, 'rgba(67, 24, 255, 0.0010)'); // Segundo color con opacidad

          return gradient;
        },
        pointBackgroundColor: '#4318FF',
        pointBorderColor: '#4318FF',
        pointRadius: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const misoptions = {
    responsive: true,
    animations: {
      transitions: {
        show: {
          animations: {
            x: {
              from: 0,
            },
            y: {
              from: 0,
            },
          },
        },
        hide: {
          animations: {
            x: {
              to: 0,
            },
            y: {
              to: 0,
            },
          },
        },
      },
    },

    maintainAspectRatio: true,
    height: 400,
    plugins: {
      legend: {
        display: true,
      },
      filler: {
        propagate: true,
      },
    },
    scales: {
      y: {
        min: minValueY,
        max: maxValueY,
        stepSize: 1,
        width: 400,
        grid: {
          display: false,
        },
      },

      x: {
        min: minDateX,
        max: maxDateX,
        stepSize: 1,
        type: 'linear',
        position: 'bottom',
        ticks: {
          autoSkip: true,
          precision: 0,
          maxTicksLimit: 30,
          callback: function (value, index, values) {
            const Mont = months[selectedMonth];
            const currentMon = Mont?.slice(0, 3);
            // Verificar si la etiqueta actual es igual a la etiqueta anterior
            if (index > 0 && value === values[index - 1]) {
              return ''; // Devolver cadena vacía para evitar duplicados
            }

            return ` ${Math.round(value)} ${currentMon}`;
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div>
      <div className="rates-description">
        <div className="rates-title">
          <h3>{t['Exchange rate']}</h3>
          <p>{t['Result obtained according to the SBS']}</p>

          <p className="country-svg">
            <span>
              <ImageSvg name="IconTipo" />
              {t['Target currency']}: PEN (soles)
            </span>

            <span>
              <ImageSvg name="Report" />
              Perú
            </span>
          </p>
        </div>

        <div className="box-filter">
          <FormControl
            sx={{
              m: 1,
              minWidth: 100,
            }}
          >
            <InputLabel id="account-label">{t.Year}</InputLabel>
            <Select
              labelId="account-label"
              value={selectedYear}
              onChange={handleYearChange}
              IconComponent={IconArrow}
            >
              {/* <MenuItem value=''>
                <em>{t['All Accounts']}</em>
              </MenuItem> */}
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  <div> {year} </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="account-label">{t.Month}</InputLabel>
            <Select
              labelId="account-label"
              value={selectedMonth}
              onChange={handleMonthChange}
              IconComponent={IconArrow}
            >
              {currentYearMonths
                ?.filter((_, index) =>
                  selectedYear == 2023 ? index >= 10 : index >= 0
                ) // Mostrar solo noviembre y diciembre si el año es 2023
                .map((month, index) => (
                  <MenuItem
                    key={month}
                    value={index + (selectedYear === '2023' ? 10 : 0)}
                  >
                    {month}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 100 }}>
            <InputLabel id="currencySelect">{t.Currency}</InputLabel>
            <Select
              labelId="currencySelect"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              IconComponent={IconArrow}
            >
              {session?.oMoneda
                .filter((coin) => coin.id_moneda !== 1) // Excluir moneda con id=1 osea el sol
                .map((coin) => (
                  <MenuItem key={coin.id_moneda} value={coin.id_moneda}>
                    <div>{coin.codigo_moneda}</div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="grafics" style={{ minHeight: '300px' }}>
        {isLoading && <LoadingComponent />}
        <Line data={midata} options={misoptions} />
      </div>

      {requestError && <div className="errorMessage"> {requestError}</div>}
    </div>
  );
}
