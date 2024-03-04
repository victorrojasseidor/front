// components/LineCaptcha.jsx
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import LoadingComponent from '../Atoms/LoadingComponent'
import { useAuth } from '@/Context/DataContext'
import ImageSvg from '@/helpers/ImageSVG';


const LineCaptcha = ({captchaData , exportToExcel }) => {
  const chartRef = useRef();
  const [isLoading, setIsLoading] = useState(false)
  const [dataGrafics, setDataGrafic]=useState(null)
  const { session, setModalToken, logout, l } = useAuth()

  const t = l.Captcha

  const dataOrderTODate = captchaData?.sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  )




  const datatrans = dataOrderTODate.reduce((acc, entry) => {
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
  
  const data = Object.values(datatrans).map((entry, i, array) => {
    return { x: entry.fecha, y: entry.captcha_resolved_sum };
  });


  // Obtener la fecha mínima de tus datos
const minDate = Math.min(...dataOrderTODate.map(entry => new Date(entry.fecha).getTime()));

// Restar unas horas a la fecha mínima
const adjustedMinDate = new Date(minDate);
adjustedMinDate.setHours(adjustedMinDate.getHours() - 1);


  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: "tipos",
            data: data,
            tension: 0.4,
            fill: 'start',
            // borderColorCompra,
            borderColor: 'rgba(5, 205, 153, 0.50)',
            backgroundColor: (context) => {
              const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height)
              gradient.addColorStop(0, 'rgba(5, 61, 153, 0.005)') // Color inicial con opacidad
              gradient.addColorStop(0.1, 'rgba(5, 205, 153, 0.002)') // Color final con opacidad
              return gradient
            },
            pointBackgroundColor: '#05CD99',
            pointBorderColor: '#05CD99',
            pointRadius: 2,
            pointHoverRadius: 5
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day', // Cambiado a 'day' para escala de tiempo en días
              },
              min: adjustedMinDate.toISOString(), // Ajusta la fecha mínima según tus necesidades
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return (
    <div>
         <div className='rates-title'>
          <h3>{t['Captcha History']}</h3>
          <p>{t['Results obtained by']}</p>

          <p className='country-svg'>
            <span>
              <ImageSvg name='Reporting' />
              x time
            </span>

          </p>

          <div className='box-filter'>
          <button className='btn_black ' onClick={() => exportToExcel()}>
            <ImageSvg name='Download' /> {t.Export}
          </button>
          </div>

        </div>

        {isLoading && <LoadingComponent />}
      
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineCaptcha;
