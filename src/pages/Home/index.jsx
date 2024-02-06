import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import user1 from '../../../public/img/testimonials/user1.png'
import user2 from '../../../public/img/testimonials/user2.png'
import user3 from '../../../public/img/testimonials/user3.png'
import user4 from '../../../public/img/testimonials/user4.png'
import user5 from '../../../public/img/testimonials/user5.png'
import Link from 'next/link'
import Lang from '@/Components/Atoms/Lang'
import logo from '../../../public/img/logoGift.gif'

const Home = () => {
  const [selectImage, setSelectImage] = useState(null)
  const [rotation, setRotation] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Ana Perez',
      position: 'CEO',
      testimony: 'Incredible service! I am very satisfied with the customer service and the quality of the products.',
      image: user1
    },
    {
      id: 2,
      name: 'Carlos Gomez',
      position: 'Senior Developer',
      testimony: 'Ari Seidor has exceeded my expectations. Their professional team truly knows how to provide effective solutions.',
      image: user2
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      position: 'Graphic Designer',
      testimony: 'I have tried several similar services, but Ari Seidor stands out for its innovation and efficiency.',
      image: user3
    },
    {
      id: 4,
      name: 'Juan Lopez',
      position: 'Data Analyst',
      testimony: 'Personalized attention and quick delivery make Ari Seidor the best option in the market.',
      image: user4
    },
    {
      id: 5,
      name: 'Laura Fernandez',
      position: 'Marketing Manager',
      testimony: 'My experience with Ari Seidor has been exceptional. I will definitely recommend their services to my friends.',
      image: user5
    }
  ]

  const changeImage = () => {
    const nextIndex = (selectImage ? selectImage.id : 0) % testimonials.length
    setSelectImage(testimonials[nextIndex])
    setRotation(rotation + (360 / testimonials.length))
  }

  useEffect(() => {
    const intervalId = setInterval(changeImage, 2000)

    return () => clearInterval(intervalId)
  }, [selectImage, rotation, testimonials])

  return (
    <div className='home'>

      <header>
        <nav>
          <ul>

            <div className='imgPerfil_logo'>

              <Image src={logo} width='100' alt='logo' priority />
            </div>
          </ul>

          <ul>
            <li>
              <Link href='/'>
                lOGIN
              </Link>
            </li>

            <div className='languajes-box'>

              <Lang />

            </div>

            <li className='btn_primary small'>
              <Link href='/'>
                SING IN
              </Link>
            </li>

          </ul>
        </nav>
      </header>

      <main className='container'>

        <section className='home-client '>
          <div className='subtitle'>
            <h1>  what our client think about us? </h1>

          </div>
          <div className='testimonials-container'>
            <div className='container-img' style={{ transform: `rotate(${rotation}deg)` }}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className='image-container'
                  style={{
                    transform: `rotate(${index * (360 / testimonials.length) + rotation}deg) translateX(150px) translateY(-50%)`,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'center center',
                    width: '100px',
                    height: '100px',
                    marginLeft: '-50px',
                    marginTop: '-50px',
                    transition: 'transform 1s ease'
                  }}
                >
                  <button onClick={() => setSelectImage(testimonial)}>
                    <Image
                      className={selectImage && selectImage.id === testimonial.id ? 'active' : ''}
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={100}
                      height={100}
                    />
                  </button>
                </div>
              ))}
            </div>

            {selectImage && (

              <div className='testimony'>

                <div className='testimony-img'>
                  <button>
                    <Image
                      className='active'
                      src={selectImage.image}
                      alt={selectImage.name}
                      width={100}
                      height={100}
                    />
                  </button>
                </div>
                <div className='testimony-message'>
                  <p>{selectImage.testimony}</p>
                  <h3>{selectImage.name}</h3>
                  <span>{selectImage.position}</span>
                </div>

              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
