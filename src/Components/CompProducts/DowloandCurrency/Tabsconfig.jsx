import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ImageSvg from '@/helpers/ImageSVG'
import FreeTrial from '@/Components/FreeTrial'

import { useAuth } from '@/Context/DataContext'

import Link from 'next/link'

export default function TabsConfig ({ id, iIdProdEnv, defaultTab, children, NameAcount }) {
  const [activeTab, setActiveTab] = useState(defaultTab || 0)
  const [completeEmails, setcompleteEmails] = useState(false)
  const [completeconfigBank, setCompleteconfigBank] = useState(true)
  const [completeShedule, setCompleteShedule] = useState(true)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  return (

    <div className='Tabsumenu'>
      <div className='Tabsumenu-header '>
        <button className={` ${activeTab === 0 ? 'activeST' : ''} ${completeEmails ? 'completeST' : ''}`} onClick={() => handleTabClick(0)}>
          <ImageSvg name='Check' />
          <h4> Status and emails </h4>

        </button>

        <button
          className={` ${activeTab === 1 ? 'activeST' : ''} ${completeconfigBank ? 'completeST' : ''}`} onClick={() => handleTabClick(1)}
        >
          <ImageSvg name='Check' />
          <h4>  Bank and Accounts  </h4>
        </button>

        <button className={` ${activeTab === 2 ? 'activeST' : ''} ${completeShedule ? 'completeST' : ''}`} onClick={() => handleTabClick(2)}>
          <ImageSvg name='Check' />
          <h4> Schedule and repository</h4>
        </button>

      </div>
      <div className='Tabsumenu-content'>
        {activeTab === 0 && (
          <div className='tabOne'>

            va el correo
          </div>
        )}
        {activeTab === 1 && (
          <div>
            configrution
          </div>
        )}
        {activeTab === 2 && (
          <div className='ApiConfiCurency'>
            <h3>schedule va </h3>
          </div>
        )}

      </div>
    </div>

  )
}
