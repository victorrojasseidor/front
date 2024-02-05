import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import user1 from '../../../public/img/testimonials/user1.png'
import user2 from '../../../public/img/testimonials/user2.png'
import user3 from '../../../public/img/testimonials/user3.png'
import user4 from '../../../public/img/testimonials/user4.png'
import user5 from '../../../public/img/testimonials/user5.png'

const Home = () => {
// Testimonials data (testimonials.js)
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

  return (
    <div className='home'>
      {/* <header>
        <nav>
          <ul>
            <li>
              <Link href='/'>
                inciio
              </Link>
            </li>
            <li>
              <Link href='/'>
                acera
              </Link>
            </li>

          </ul>
        </nav>
      </header> */}

      <main>

        {/* <section className='home-cara'>
          section 1
        </section> */}

        <section className='home-client'>
          secci+on de clientes

          <div className='testimonials-container'>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className='testimonial'>
                <Image src={testimonial.image} alt={testimonial.name} width={100} height={100} />
                <h3>{testimonial.name}</h3>
                <p>{testimonial.position}</p>
                <p>{testimonial.testimony}</p>
              </div>
            ))}
          </div>

        </section>

        {/* <footer> footter </footer> */}

      </main>

    </div>

  )
}

export default Home
