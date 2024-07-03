import React, { useState } from 'react'
import YouTube from 'react-youtube'
import ImageSvg from '@/helpers/ImageSVG'

const DocDowland = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [mostrarMas, setMostrarMas] = useState(false)

  const handleToggleMostrar = () => {
    setMostrarMas(!mostrarMas)
  }

  // insertar video de youtube

  const videoId = 'ZysHojiy-V0' // Reemplaza VIDEO_ID con el ID del video de YouTube que deseas insertar

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  }

  const onReady = (event) => {
    // Acciones a realizar cuando el video está listo para reproducirse
  }

  const onEnd = (event) => {
    // Acciones a realizar cuando el video ha terminado de reproducirse
  }

  // activar tabs

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  return (
    <div className='verticalTabs '>


      <div className='tabContent '>
        {activeTab === 0 && (
          <div className='tabOne currency '>
            <div className='currency_features'>
              <div className='description docDowland'>
                <div>
                  <div className='videoPlayer'>
                    <div className='title'>
                      
                    <span>
                        Automatic download of bank statements </span>
                      
                    </div>
                    <YouTube videoId={videoId} opts={opts} onReady={onReady} onEnd={onEnd} />
                  </div>
                </div>
              </div>
              <div className='currency_benefits'>
                <h3> Benefits </h3>

                <div>
                  <ul>
                    <ImageSvg name='Benefit1' />

                    <h6> Performs the conversion to a single format  </h6>
                    <div className='befenitDes'> The robot enters your information from account statements and credentials to obtain the information and show you in the file of your choice
                    </div>

                  </ul>

                  {/* <ul>
                    <ImageSvg name='Benefit2' />
                    <h6> Achieve operational efficiency and save costs.</h6>
                    <p>
                      <li>Gain process agility and improve financial accuracy.</li>

                     <li>Savings due to reduced human intervention time, reprocessing costs and expensive technical infrastructure.</li>
                    </p>
                  </ul> */}
                  {/*
                  <ul>
                    <ImageSvg name='Benefit3' />
                    <h6>Have Greater Control and Visibility</h6>

                    <p>{mostrarMas ? <li>Have control, visibility and communication for the entry of the exchange rate in your ERP. The application will send you an email notifying the registration of the exchange rate in your ERP every day at the time you decide.</li> : <li>Have control, visibility and communication </li>}</p>
                    <button onClick={handleToggleMostrar}>{mostrarMas ? 'Ver menos' : 'Ver más'}</button>
                  </ul> */}

                  {/* <ul>
                    <ImageSvg name='Benefit4' />
                    <h6>Security and backup</h6>

                    <p>{mostrarMas
                      ? <li> Stable and scalable solution to any ERP or system that requires the registration of the exchange rate, it has contingency mechanisms and validations such as comparison of the exchange rate of the day with that of the previous day so that there is no considerable percentage deviation. <strong>  Online support.
                      </strong>
                      </li>
                      : <li>Stable and scalable solution to any ERP or system that requires </li>}
                    </p>
                    <button onClick={handleToggleMostrar}>{mostrarMas ? 'Ver menos' : 'Ver más'}</button>
                  </ul> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && <div> ---- </div>}

        {activeTab === 2 && (
          <div>
            {/* <h3>Notifications</h3>
            <p>Select how you want to be notified</p> */}
            -------------
          </div>
        )}
      </div>
      <div className='tabHeader'>
        <p> Contains: </p>
        <button className={activeTab === 0 ? 'activeVT complete' : ''} onClick={() => handleTabClick(0)}>
          <h4>Features</h4>
        </button>
        <button className={activeTab === 1 ? 'activeVT' : ''} onClick={() => handleTabClick(1)}>
          <h4> Scope</h4>
        </button>
        <button className={activeTab === 2 ? 'activeVT' : ''} onClick={() => handleTabClick(2)}>
          <h4> Warranty </h4>
        </button>
      </div>
    </div>
  )
}

export default DocDowland
