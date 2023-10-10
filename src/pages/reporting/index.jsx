import React from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import LimitedParagraph from '@/helpers/limitParagraf'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'

function index (props) {
  const { session, l } = useAuth()

  const t = l.Reporting

  return (
    <LayoutProducts menu='Reporting'>

      <NavigationPages title={t.Reporting}>

        {}

      </NavigationPages>
      <section className='reporting'>
        <div className='sub-title'>
          <h5> {t['ARI Finance to']} {session?.jCompany.razon_social_company} </h5>
        </div>

        <div className='products_cards'>
          <ul className='reporting-list'>
            <li className='card card-reporting'>
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

        </div>
      </section>
    </LayoutProducts>

  )
}

// index.propTypes = {

// }

export default index
