import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

import Head from 'next/head';
import LayoutHome from '@/Components/LayoutHome';
import ImageSvg from '@/helpers/ImageSVG';
import post1 from '../../../../public/img/post/post1.svg';
import Image from 'next/image';
import { useAuth } from '@/Context/DataContext';
import autor from '../../../../public/img/post/autor.jpg';
import { useRouter } from 'next/router';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { formatDate } from '@/helpers/report';
import Link from 'next/link';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';

export default function Index() {
  const { l } = useAuth();
  const router = useRouter();
  const { id } = router.query; // Aquí obtienes el ID de la URL dinámica
  const t = l.home;
  const [copied, setCopied] = useState(false); // Estado para mostrar si el link fue copiado
  const [posts, getpost] = useState([]);
  const [cardInsights, setcardInsights] = useState(null);

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

  async function getPostStrapi() {
    // Hacemos la petición a la API de Strapi
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/posts?locale=${router.locale === 'en' ? 'en' : 'es'}&populate=image`);
    const data = await res.json();

    if (!data || !data.data) {
      return {
        notFound: true, // Si no hay datos, mostramos una página 404
      };
    }

    const post = data.data;
    console.log({ post });
    getpost(post);
  }

  async function getDataCardInsights() {
    // Hacemos la petición a la API de Strapi
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/posts?filters[documentId]=${id}&populate=image&locale=${router.locale === 'en' ? 'en' : 'es'}`);

    const data = await res.json();
    if (!data || !data.data) {
      return {
        notFound: true, // Si no hay datos, mostramos una página 404
      };
    }

    const blog = data.data;
    console.log({ blog });
    setcardInsights(blog[0]);
  }

  useEffect(() => {
    getPostStrapi();
    getDataCardInsights();
  }, [id, router.locale]);

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
        <title>{cardInsights?.title}</title>
        <meta name="description" content="Automating financial processes with AI" />
        <meta name="keywords" content="AI, financial processes, automation, efficiency" />

        {/* Open Graph for LinkedIn and Facebook */}
        <meta property="og:title" content={cardInsights?.title} />
        <meta property="og:description" content={cardInsights?.description} />
        <meta property="og:image" content="/img/post/post1.svg" />
        <meta property="og:url" content={cardInsights?.link} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cardInsights?.title} />
        <meta name="twitter:description" content={cardInsights?.description} />
        <meta name="twitter:image" content="/img/post/post1.svg" />
        <meta name="twitter:site" content="@yourTwitterHandle" />

        {/* Canonical URL */}
        <link rel="canonical" href={cardInsights?.link} />
      </Head>

      {cardInsights ? (
        <section className="insigth">
          <section className="insigth-navigation">
            <span> Home</span>
            <ImageSvg name="Navigation" />
            <span className="title--post"> {cardInsights?.title} </span>
          </section>

          <section className="insigth-suggestions-posts">
            <div className="insigth-post">
              <figure className="image--post">
                {/* {cardInsights?.image[0].url &&  <Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${cardInsights.image[0]?.url}`} width={40} height={40} alt="post" /> } */}
                <Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${cardInsights.image[0]?.url}`} width={40} height={40} alt="post" />

                <div className="box-title">
                  <span>{cardInsights?.type}</span>
                  <h1>{cardInsights?.title}</h1>
                  <p>{cardInsights && formatDate(cardInsights?.publishedAt)}</p>
                </div>
              </figure>

              {cardInsights?.content && <BlocksRenderer content={cardInsights?.content} />}

              {/* {cardInsights.content.map((post, index) => (
              <article key={index} className="paragraphs-post">
                <h2>{post.title}</h2>
                <InsightsStyle content={post.content} keyboards={post.keyboards} />
              </article>
            ))} */}
            </div>

            <div className="insigth-suggestions">
              <div className="box-autor">
                <Image src={autor} width={40} height={40} alt="autor" />

                {/* <Image src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${cardInsights?.image[0].url}`} width={40} height={40} alt="post" /> */}

                <div className="dates-autor">
                  <p> {cardInsights?.autor}</p>
                  <span>Ceo de Innovativa Seidor</span>
                </div>
              </div>

              <div className="box-shared">
                <h4>Share with your community!</h4>

                <div className="share-buttons">
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(cardInsights?.link)}&title=${encodeURIComponent(cardInsights?.title)}&summary=${encodeURIComponent(cardInsights?.description)}&source=LinkedIn`} target="_blank" rel="noopener noreferrer">
                    <ImageSvg name="Linkedin" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(cardInsights?.title)}&url=${encodeURIComponent(cardInsights?.link)}&via=yourTwitterHandle`} target="_blank" rel="noopener noreferrer">
                    <ImageSvg name="Twitter" />
                  </a>
                  <button onClick={copyLinkToClipboard}>{copied ? <ImageSvg name="Copy" /> : 'Copy Link'}</button>
                </div>
              </div>

              <div className="box-list-post">
                <h3>Other recommended articles</h3>

                <ul>
                  {posts &&
                    posts?.map((post) => (
                      <li key={post.documentId} className={post.documentId == id ? 'active-post' : ''}>
                        <Link href={`/insigth/${post.documentId}`}>{post.title}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <LoadingComponent />
      )}
    </LayoutHome>
  );
}
