import React, { useState, useEffect } from 'react'
import LayoutProducts from '@/Components/LayoutProducts'
import ImageSvg from '@/helpers/ImageSVG'
import Link from 'next/link'
import NavigationPages from '@/Components/NavigationPages'
import { useAuth } from '@/Context/DataContext'
import { useRouter } from 'next/router'
import Balance from '../../reports/Balance'
import Movement from '../../reports/Movement'
import Padrones from '../../reports/Padrones'


const Finance = () => {
  const { l } = useAuth()
  const t = l.Reporting
  const router = useRouter()
  const { id } = router.query

  const [tabData, setTabData] = useState(null)

  // Definir las pestañas y sus contenidos
  const tabs = [
    { idTab: 1, title: t.Balance, path: '/reporting/finance/1', component: <Balance />, type: l.header['Finance and accounting'] },
    { idTab: 2, title: t.Movement, path: '/reporting/finance/2', component: <Movement />, type: l.header['Finance and accounting'] },
    { idTab: 3, title: l.Pattern.Pattern, path: '/reporting/finance/3', component: <Padrones />, type: l.header['Finance and accounting'] }
  ]

  const handleTabClick = (index, data) => {
    router.push(data.path) // Usar la ruta de la pestaña en lugar del índice
  }

  useEffect(() => {
    const activeTabFromId = tabs.filter((tab) => tab.idTab == id)
    if (activeTabFromId.length > 0) {
      setTabData(activeTabFromId[0])
    }
  }, [id,router])

  return (
    <LayoutProducts menu='Reporting'>
      <NavigationPages title={tabData?.type}>
        <Link href='/reporting'>
          <ImageSvg name='Dashboard' />
          <p>{t.Reporting}</p>
        </Link>
        <ImageSvg name='Navegación' />
        {tabData?.title}
      </NavigationPages>
      <section className='layoutReporting'>
        <div className='horizontalTabs'>
          <div className='tab-header'>
            {tabs.map((tab, index) => (
              <button key={index} className={tabData?.idTab === tab.idTab ? 'active' : ''} onClick={() => handleTabClick(index, tab)}>
                <h4>{tab.title}</h4>
              </button>
            ))}
          </div>
          <div className='tab-content'>
            {tabData?.component}
          </div>
        </div>
      </section>
    </LayoutProducts>
  )
}

export default Finance
