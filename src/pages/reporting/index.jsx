import React from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import LimitedParagraph from '@/helpers/limitParagraf'
import Link from 'next/link'

function index (props) {
  return (
    <LayoutProducts menu='Reporting'>
      <section className='reporting'>
        <div className='products_cards'>
<ul>
<li className='card configured'>
            <div>
              <span>
                <ImageSvg name='Dashboard' />
              </span>
              <Link href='/reporting/balance'>
                <h4> Balance report</h4>
              </Link>
            </div>
            <div />
            <div className='description'>
              <p >
                Made by Digital Employes:
              </p >
              <span className='maybe'>
                <LimitedParagraph text='Download the daily bank statement' limit={40} />
              </span>

            </div>

            <div>
              <Link href='/reporting/balance'>
                <p> View reporting</p>
              </Link>

            </div>
          </li>

          <li className='card configured'>
            <div>
              <span>
                <ImageSvg name='Dashboard' />
              </span>
              <Link href='/reporting/movement'>
                <h4> Movement report</h4>
              </Link>
            </div>
            <div />
            <div className='description'>
              <p >
                Made by Digital Employes:
              </p >
              <span className='maybe'>
                <LimitedParagraph text='Download the daily bank statement' limit={40} />
              </span>

            </div>

            <div>
              <Link href='/reporting/movement'>
                <p> View reporting</p>
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
