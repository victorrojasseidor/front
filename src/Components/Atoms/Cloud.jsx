import React, { useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'

const Cloud = ({ imgButton, cloudText,onClick }) => {
  const [cloudVisible, setCloudVisible] = useState(false)

  const handleMouseEnter = () => {
    setCloudVisible(true)
  }

  const handleMouseLeave = () => {
    setCloudVisible(false)
  }

  const handleClick = () => {
    onClick()
  }


  return (
    <div className='cloudContainer'>

      <button
        className='btn_circle'
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ImageSvg name={imgButton} />

      </button>
      {cloudVisible && (
        <div className='cloud'>
          <p>{cloudText}</p>
        </div>
      )}
    </div>
  )
}

export default Cloud
