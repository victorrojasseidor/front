import React, { useState } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import LimitedParagraph from '@/helpers/limitParagraf'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import reportMovement from '../../../public/img/report-movement.png'
import reportBalance from '../../../public/img/report-balance.png'
import Image from 'next/image'
import LineChart from '@/Components/Grafics/BarChart'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

function index (props) {
  const { session, l } = useAuth()

  const t = l.Reporting

  return (
    <LayoutProducts menu='Reporting'>

      <NavigationPages title={t.Reporting}>

        <Link href='/product'>
          Home
        </Link>

      </NavigationPages>
      <section className='reporting'>
        <div className='reporting-box reporting_dashboard'>

          <div className='report-content'>

            <div className='report red'>

              <div className='report_icon  '>

                <ImageSvg name='ReportRevenue' />

              </div>

              <div className='report_data'>

                <article>
                  {t['Total revenue']}

                </article>
                <h2> $198k </h2>
                <p> <ImageSvg name='ArrowUp' /> <span> 37.8% </span>  {t['this month']}    </p>
              </div>

            </div>

            <div className='liner' />

            <div className='report green '>

              <div className='report_icon  '>

                <ImageSvg name='ReportRevenue' />

              </div>

              <div className='report_data'>

                <article>
                  {t['Total expenses']}

                </article>
                <h2> $2.4k </h2>
                <p> <ImageSvg name='ArrowUp' />   <span>  2%  </span>    {t['this month']} </p>
              </div>

            </div>
            <div className='liner' />

            <div className='report  blue'>

              <div className='report_icon  '>

                <ImageSvg name='ReportTotal' />

              </div>

              <div className='report_data'>

                <article>
                  {t.Result}

                </article>
                <h2> $89k</h2>
                <p> <ImageSvg name='ArrowUp' />  <span> 4%  </span>    {t.utility} </p>
              </div>

            </div>

          </div>

        </div>

        <div className='reporting_rates'>

          <div className='reporting_rates-exchange'>

            <LineChart />

          </div>

          <div className='reporting_rates-menu'>

            <h3>  {t.Reporting} </h3>

            <div className='menu-list'>

              <div className='box-option'>

                <div className='image'>

                  <Image src={reportBalance} width={500} alt='img-reporting' />

                </div>

                <div>
                  <h4> {t.Balance} </h4>

                  <Link href='/reporting/balance'>
                    {t['View reporting']}
                  </Link>

                </div>

              </div>

              <div className='box-option'>

                <div className='image'>

                  <Image src={reportMovement} width={500} alt='img-reporting' />

                </div>

                <div>
                  <h4> {t.Movement} </h4>

                  <Link href='/reporting/movement'>
                    {t['View reporting']}
                  </Link>

                </div>

              </div>

              {/* <div className='products_cards'>
                <ul className='reporting-list'>
                  <li className='card'>
                    <div className='card-title'>
                      <span>
                        <ImageSvg name='Dashboard' />
                      </span>
                      <Link href='/reporting/balance'>
                        <h4> {t['Balance report']} </h4>
                      </Link>
                    </div>
                    <div />
                    <div className='card-status description'>
                      <span>
                        {t['Made by Digital Employes:']}
                      </span>
                      <span className='maybe'>
                        <LimitedParagraph text={t['Download the daily bank statement']} limit={40} />
                      </span>

                    </div>

                    <div>

                      <Link href='/reporting/balance'>
                        <p> {t['View reporting']} </p>
                      </Link>

                    </div>
                  </li>

                  <li className='card card-reporting'>
                    <div className='card-title'>
                      <span>
                        <ImageSvg name='Dashboard' />
                      </span>
                      <Link href='/reporting/movement'>
                        <h4> {t['Movement report']} </h4>
                      </Link>
                    </div>
                    <div />
                    <div className='card-status description'>
                      <span>
                        {t['Made by Digital Employes:']}
                      </span>
                      <span className='maybe'>
                        <LimitedParagraph text={t['Download the daily bank statement']} limit={40} />
                      </span>

                    </div>

                    <div>
                      <Link href='/reporting/movement'>
                        <p> {t['View reporting']}</p>
                      </Link>

                    </div>
                  </li>

                </ul>

              </div> */}

            </div>

          </div>

        </div>

        <div className='sub-title'>
          <h5> {t['ARI Finance to']} {session?.jCompany.razon_social_company} </h5>
        </div>

      </section>

    </LayoutProducts>

  )
}

// index.propTypes = {

// }

export default index
