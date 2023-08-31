import React from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'

const Balance = () => {
  const today = new Date().toISOString().substr(0, 10) // Fecha de hoy en formato YYYY-MM-DD
  const defaultStartDate = '2023-01-01'

  return (
    <LayoutProducts menu='Reporting'>
      <div className='balance'>
        <div className='navegación'>
          <Link href='/reporting'>
            <ImageSvg name='Dashboard' />
            <p>
              Reporting
              {/* {empresa?.razon_social_empresa} */}
            </p>
          </Link>

          <ImageSvg name='Navegación' />

          <Link href='#'>
            <p> Balance Report </p>
          </Link>

        </div>

        {/* <p className='spanReporting'>Reporting</p> */}
        {/* <div className='box_title'>
          <div className='title'>
            <h3>Balance Report</h3>
          </div>
          <div>
            <button className='btn_black smallBack'>Export Report</button>
          </div>
        </div> */}

        <div className='box-filters'>

          <div className='date'>
            <label htmlFor='fecha-inicial'>Start date:</label>
            <input type='date' id='fecha-inicial' defaultValue={defaultStartDate} />
          </div>
          <div className='date'>
            <label htmlFor='fecha-final'>End date:</label>
            <input type='date' id='fecha-final' defaultValue={today} max={today} placeholder='hdhd' />

          </div>
          <div className='empresa'>
            <label htmlFor='empresa'>Company</label>
            <select id='empresa'>
              <option value='Empresa A'>Empresa A</option>
              <option value='Empresa B'>Empresa B</option>
              <option value='Empresa C'>Empresa C</option>
            </select>
          </div>

          <div className='empresa'>
            <label htmlFor='empresa'>Bank</label>
            <select id='empresa'>
              <option value='Empresa A'>All</option>
              <option value='Empresa B'>Bank 1</option>
              <option value='Empresa C'>Bank 2</option>
            </select>
          </div>

          <div className='empresa'>
            <label htmlFor='empresa'>Account</label>
            <select id='empresa'>
              <option value='Empresa A'>All</option>
              <option value='Empresa B'>Account 1</option>
              <option value='Empresa C'>Account 2</option>
            </select>
          </div>

          <div className='box-buttons'>
            <button className='btn_black smallBack'>Apply  </button>
            <button className='btn_black smallBack'>Clear </button>
          </div>

        </div>

        <div className='contaniner-tables'>
          <div className='box-search'>
            <h3>Balance Report </h3>
            <button className='btn_black smallBack'>Export Report</button>
          </div>
          <div className='boards'>
            <div className='tableContainer'>
              <table className='dataTable Account'>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Company</th>
                    <th>Bank</th>
                    <th>Account</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Date</th>

                  </tr>
                </thead>
                <tbody>
                  <tr key='jdjjd'>
                    <td>Seidor</td>
                    <td>Innovativa</td>
                    <td>Banco</td>
                    <td>194-23044-223</td>
                    <td>PEN</td>
                    <td>1000</td>
                    <td>1/08/2023</td>

                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </LayoutProducts>
  )
}

export default Balance
