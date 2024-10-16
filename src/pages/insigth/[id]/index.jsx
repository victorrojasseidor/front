import React, { useState } from 'react';
import Head from 'next/head';
import LayoutHome from '@/Components/LayoutHome';
import ImageSvg from '@/helpers/ImageSVG';
import post1 from '../../../../public/img/post/post1.svg';
import Image from 'next/image';
import { useAuth } from '@/Context/DataContext';
import autor from '../../../../public/img/post/autor.jpg';

export default function Index() {
  const { l } = useAuth();
  const t = l.home;
  const [copied, setCopied] = useState(false); // Estado para mostrar si el link fue copiado

  const cardInsights = {
    title: t['Generative AI Strengthens Financial Back Office'],
    author: 'Menagen Murriagui Hananel',
    imageAutor: autor,
    date: t['June 28, 2018'],
    image: post1,
    type: t['Financial Services'],
    description: t['Our AI automates financial processes '],
    link: '/insights/post-generative-ai',
    posts: [
      {
        title: 'La Era de la Inteligencia',
        content: `
        En 2024, la inteligencia artificial (IA) ha dejado de ser solo una herramienta futurista 
        para convertirse en una pieza fundamental dentro de los procesos financieros y la gestión de facturas. 
        Empresas que han integrado IA en su back office financiero reportan una reducción del 70% en 
        los errores humanos y una aceleración del 50% en los tiempos de procesamiento. Además, la adopción 
        de tecnologías emergentes como la computación en la nube y el análisis de datos 
        está permitiendo a las empresas mejorar aún más su rendimiento. La IA también está facilitando la 
        personalización de servicios, permitiendo a las organizaciones ofrecer soluciones más 
        adecuadas a las necesidades específicas de sus clientes. Con la transformación digital en 
        marcha, el futuro del back office financiero parece más prometedor que nunca...
        `,
        keyboards: {
          color: 'eficiencia operativa velocidad errores humanos transformación digital',
          negrita: ['aceleración del 50%', 'back office', 'algoritmos avanzados', 'aprendizaje automático', 'conciliación bancaria'],
        },
      },
      {
        title: 'Como la Gota al Agua',
        content: `
        A medida que avanzamos hacia un futuro cada vez más digitalizado, la importancia de la inteligencia 
        artificial se hace evidente Desde la automatización de tareas rutinarias hasta la implementación de soluciones avanzadas 
        de análisis de datos, la IA está cambiando la forma en que se gestionan las finanzas. Las organizaciones 
        que se adaptan a esta nueva realidad están viendo resultados positivos en términos de reducción de costos 
        y mejora en la satisfacción del cliente...
        `,
        keyboards: {
          color: 'eficiencia operativa',
          negrita: ['inteligencia artificial', 'automatización de tareas', 'satisfacción del cliente'],
        },
      },
    ],
  };

  const posts = [
    { id: 1, title: 'Exploring Generative AI in Content Creation', link: '/posts/1' },
    { id: 2, title: 'Conceptos Avanzados en Next.js', link: '/posts/2' },
    { id: 3, title: 'Optimización con SEO en Next.js', link: '/posts/3' },
  ];

  const InsightsStyle = ({ content, keyboards }) => {
    const applyStylesToKeywords = (text, keywords, styleTag, styleAttr = '') => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        text = text.replace(regex, `<${styleTag} ${styleAttr}>$1</${styleTag}>`);
      });
      return text;
    };

    let formattedContent = content;

    formattedContent = applyStylesToKeywords(formattedContent, keyboards.negrita, 'strong');
    formattedContent = applyStylesToKeywords(formattedContent, keyboards.color.split(' '), 'span', 'style="color: #2b3674;"');

    return <p dangerouslySetInnerHTML={{ __html: formattedContent }}></p>;
  };

  // Función para copiar el link al portapapeles
  const copyLinkToClipboard = () => {
    const link = `${window.location.origin}${cardInsights.link}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset del estado después de 2 segundos
  };

  return (
    <LayoutHome>
      <Head>
        <title>{cardInsights.title}</title>
        <meta name="description" content="Automating financial processes with AI" />
        <meta name="keywords" content="AI, financial processes, automation, efficiency" />

        {/* Open Graph for LinkedIn and Facebook */}
        <meta property="og:title" content={cardInsights.title} />
        <meta property="og:description" content={cardInsights.description} />
        <meta property="og:image" content="/img/post/post1.svg" />
        <meta property="og:url" content={cardInsights.link} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cardInsights.title} />
        <meta name="twitter:description" content={cardInsights.description} />
        <meta name="twitter:image" content="/img/post/post1.svg" />
        <meta name="twitter:site" content="@yourTwitterHandle" />

        {/* Canonical URL */}
        <link rel="canonical" href={cardInsights.link} />
      </Head>

      <section className="insigths">
        <section className="insigths-navigation">
          <span> Home</span>
          <ImageSvg name="Navigation" />
          <span className="title--post"> {cardInsights.title} </span>
        </section>

        <section className="insigths-suggestions-posts">
          <div className="insigths-post">
            <figure className="image--post">
              <Image src={cardInsights.image} width={40} height={40} alt="insights" />
              <div className="box-title">
                <span>{cardInsights.type}</span>
                <h1>{cardInsights.title}</h1>
                <p>{cardInsights.date}</p>
              </div>
            </figure>

            {cardInsights.posts.map((post, index) => (
              <article key={index} className="paragraphs-post">
                <h2>{post.title}</h2>
                <InsightsStyle content={post.content} keyboards={post.keyboards} />
              </article>
            ))}
          </div>

          <div className="insigths-suggestions">
            <div className="box-autor">
              <Image src={cardInsights.imageAutor} width={40} height={40} alt="autor" />

              <div className="dates-autor">
                <p>Menagen Muriagui</p>
                <span>Ceo de Innovativa Seidor</span>
              </div>
            </div>

            <div className="box-shared">
              <h4>Share with your community!</h4>

              <div className="share-buttons">
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(cardInsights.link)}&title=${encodeURIComponent(cardInsights.title)}&summary=${encodeURIComponent(cardInsights.description)}&source=LinkedIn`} target="_blank" rel="noopener noreferrer">
                  <ImageSvg name="Linkedin" />
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(cardInsights.title)}&url=${encodeURIComponent(cardInsights.link)}&via=yourTwitterHandle`} target="_blank" rel="noopener noreferrer">
                  <ImageSvg name="Twitter" />
                </a>
                <button onClick={copyLinkToClipboard}>{copied ? <ImageSvg name="Copy" /> : 'Copy Link'}</button>
              </div>
            </div>

            <div className="box-list-post">
              <h3>Other recommended articles</h3>

              <ul>
                {posts.map((post) => (
                  <li key={post.id} className={post.id == 1 ? 'active-post' : ''}>
                    <a href={post.link}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </LayoutHome>
  );
}
