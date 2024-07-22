import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useAuth } from '@/Context/DataContext';
import ImageSvg from '@/helpers/ImageSVG';

const LineCaptcha = ({ captchaData, exportToExcel, startDate, endDate }) => {
  const chartRef = useRef();
  const { l } = useAuth();
  const t = l.Captcha;

  // Obtener la fecha mínima de tus datos
  const minDate = captchaData && Math.min(...captchaData.map((entry) => new Date(entry.fecha).getTime()));

  // Restar unas horas a la fecha mínima
  const adjustedMinDate = new Date(minDate);
  adjustedMinDate.setHours(adjustedMinDate.getHours() - 1);

  useEffect(() => {
    if (chartRef.current && captchaData) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              min: adjustedMinDate.toISOString(),
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });

      // Agrupar los datos por fecha y tipo de captcha
      const groupedData = captchaData.reduce((acc, entry) => {
        const key = `${entry.fecha}_${entry.captcha_type}`;

        if (!acc[key]) {
          acc[key] = {
            fecha: entry.fecha,
            captcha_type: entry.captcha_type,
            captcha_resolved_sum: entry.captcha_resolved,
          };
        } else {
          acc[key].captcha_resolved_sum += entry.captcha_resolved;
        }

        return acc;
      }, {});

      // Obtener un conjunto único de tipos de captcha
      const uniqueCaptchaTypes = Array.from(new Set(captchaData.map((entry) => entry.captcha_type)));

      // Agregar datasets al gráfico
      uniqueCaptchaTypes.forEach((captchaType, index) => {
        const matchingData = Object.values(groupedData).filter((entry) => entry.captcha_type === captchaType);
        const borderColor = getRandomColor(index);
        const backgroundColor = getRandomColor(index, 0.03);

        chart.data.datasets.push({
          label: captchaType, // Nombre del tipo de captcha
          data: matchingData.map((entry) => ({
            x: new Date(entry.fecha),
            y: entry.captcha_resolved_sum,
          })),
          fill: 'start',
          tension: 0.4,
          borderColor,
          backgroundColor,
          pointBackgroundColor: borderColor,
          pointBorderColor: borderColor,
          pointRadius: 3,
          pointHoverRadius: 5,
        });
      });

      chart.update(); // Actualizar el gráfico después de agregar datasets

      return () => {
        chart.destroy();
      };
    }
  }, [captchaData]);

  // Función para obtener un color aleatorio en formato rgba
  const getRandomColor = (index, transparent = false) => {
    const colors = ['#4318FF', '#05CD99', '#007AFF', '#E31A1A', '#9a90ff', '#2B3674', '#FFCE20'];
    const colorIndex = index % colors.length;
    const color = colors[colorIndex];

    if (transparent) {
      return `${color}05`;
    }

    return color;
  };

  return (
    <div>
      <div className="rates-description">
        <div>
          <h3>{t['Captcha History']}</h3>

          <p className="dates">
            <ImageSvg name="Reporting" />
            {t['Results obtained by']} {startDate} {t.To} {endDate}
          </p>
        </div>

        <div>
          <button className="btn_black " onClick={() => exportToExcel()}>
            <ImageSvg name="Download" /> {t.Export}
          </button>
        </div>
      </div>

      {captchaData.length > 0 && <canvas ref={chartRef} />}
    </div>
  );
};

export default LineCaptcha;
