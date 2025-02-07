import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import LayoutHome from '@/Components/LayoutHome';
import ImageSvg from '@/helpers/ImageSVG';
import Image from 'next/image';
import { useAuth } from '@/Context/DataContext';
import autor from '../../../../public/img/post/autor.webp';
import { useRouter } from 'next/router';
import { formatDate } from '@/helpers/report';
import Link from 'next/link';
import compartir from '../../../../public/img/post/compartir.jpg';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import qs from 'qs';


export default function Index() {
  const { l } = useAuth();
  const router = useRouter();
  const { id } = router.query; // Aquí obtienes el ID de la URL dinámica
  const t = l.home;
  const [copied, setCopied] = useState(false); // Estado para mostrar si el link fue copiado
  const [posts, getpost] = useState([]);
  const [cardInsights, setcardInsights] = useState(null);

 
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  async function getPostStrapi() {


    const query = qs.stringify(
      {
        fields: ['id', 'title' ],
        locale: 'es',
        sort: ['order:asc'],
        populate: {
          image: {
            fields: ['url'],
          },
        },
      },
      { encodeValuesOnly: true } // Opcional para codificar solo valores
    );

          // Hacemos la petición
  const res = await fetch(`${strapiURL}/api/posts?${query}`, {
    headers: {
      // Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`, // Si tienes token, descomenta esta línea
    },
  });
  

    const data = await res.json();

    if (!data || !data.data) {
      return {
        notFound: true, // Si no hay datos, mostramos una página 404
      };
    }

    const post = data.data;
    getpost(post);
  }

  async function getDataCardInsights() {

  
    const res = await fetch(`${strapiURL}/api/posts?locale=${router.locale === 'es' ? 'es' : 'en'}&filters[documentId]=${id}&populate=*`, {
      headers: {
        // Authorization: `Bearer  ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });

    const data = await res.json();
    if (!data || !data.data) {
      return {
        notFound: true, // Si no hay datos, mostramos una página 404
      };
    }

    const blog = data.data;
    setcardInsights(blog[0]);
  }

  useEffect(() => {
    getPostStrapi();
    getDataCardInsights();
  }, [id, router.locale]);

  const getShareLink = () => {
    const baseURL = window.location.origin;
    const postLink = `${baseURL}/insigth/${cardInsights?.id}`; // Ajusta la ruta según sea necesario

    const title = cardInsights ? cardInsights.title : 'Título por defecto';
    const summary = cardInsights ? cardInsights.description : 'Descripción por defecto';

    const linkedinShareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postLink)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent(strapiURL)}`;
    const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postLink)}&via=yourTwitterHandle`;

    return { linkedinShareURL, twitterShareURL };
  };

  useEffect(() => {
    if (cardInsights) {
      const { linkedinShareURL, twitterShareURL } = getShareLink();
    }
  }, [cardInsights]);

  const copyLinkToClipboard = () => {
    const currentUrl = window.location.href; // Obtiene la URL actual
    navigator.clipboard
      .writeText(currentUrl) // Copia la URL actual al portapapeles
      .then(() => {
        setCopied(true);
        // Restablecer el estado a false después de 5 segundos
        setTimeout(() => {
          setCopied(false);
        }, 5000);
      })
      .catch((err) => {
        console.error('Error al copiar el enlace: ', err);
      });
  };


  return (
    <LayoutHome>
      <Head>
        <title>{cardInsights?.title}</title>
        <meta content={cardInsights?.title} property="og:title" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={cardInsights?.description} />
        <meta name="description" content="publicación de ari" />
        <meta name="keywords" content={cardInsights?.keyboards} />
        <meta name="keywords" content="Ingenieria artifical, IA" />
        {/* Metadatos para Open Graph (LinkedIn, Facebook, etc.) */}
        <meta property="og:title" content={cardInsights?.title} />
        <meta property="og:description" content={cardInsights?.description} />
        {/* <meta property="og:image" content={cardInsights?.attributes.image.data.attributes.url} /> */}
        <meta property="og:image" name="image" content={`${window.location.origin}${compartir.src}`} />
        <meta property="og:url" content={`${window.location.origin}/insigth/${cardInsights?.id}`} /> {/* URL del post */}
        <meta property="og:type" content="article" />
        <meta content="ariapp.ai" property="og:site_name" />
        <meta content="website" property="og:type" />
        <meta content="1200" property="og:image:width" />
        <meta content="630" property="og:image:height" />
        {/* Metadatos para Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cardInsights?.title} />
        <meta name="twitter:description" content={cardInsights?.description} />
        <meta name="twitter:image" content={`${window.location.origin}${compartir.src}`} />
        <meta name="twitter:site" content="@seidor" />
        {/* URL canónica */}
        <link rel="canonical" href={`${window.location.origin}/insigth/${cardInsights?.id}`} />
      </Head>

      <section className="insigth">
        <section className="insigth-navigation">
          <Link href="/#insights"> Insights </Link>
          <ImageSvg name="Navigation" />
          <span className="title--post"> {cardInsights?.title} </span>
        </section>

        <section className="insigth-suggestions-posts">
          {cardInsights && Object.keys(cardInsights).length > 0 ? (
            <div className="insigth-post">
              <figure className="image--post">
                <Image src={cardInsights?.image.url} width={400} height={300} alt={cardInsights?.title} priority />

                <div className="box-title">
                  <span>{cardInsights?.type}</span>
                  <h1>{cardInsights?.title}</h1>
                  <p>{cardInsights && formatDate(cardInsights?.updatedAt)}</p>
                </div>
              </figure>

              
              {cardInsights?.content && <BlocksRenderer content={cardInsights?.content} />}

            </div>
          ) : (
            <p> {t['Waiting articles']}</p>
          )}

          <div className="insigth-suggestions">
            <div className="box-autor">
              {/* <Image src={cardInsights?.attributes?.imgAutor?.data ? cardInsights.attributes.imgAutor.data.attributes.url : autor} width={40} height={40} alt={cardInsights?.attributes?.autor} /> */}
              <Image src={autor} width={40} height={40} alt="AUTOR" />

              <div className="dates-autor">
                <p> {cardInsights?.autor || "Menagen Murriagui Hananel"}</p>
                <span>{cardInsights?.authorRole ||  "Innovativa Seidor CEO"}</span>
              </div>
            </div>

            <div className="box-shared">
              <h4>{t['Share with your community!']}</h4>

              <div className="share-buttons">
                <a href={getShareLink().linkedinShareURL} target="_blank" rel="noopener noreferrer">
                  <ImageSvg name="Linkedin" />
                </a>
                <a href={getShareLink().twitterShareURL} target="_blank" rel="noopener noreferrer">
                  <ImageSvg name="Twitter" />
                </a>
                <button onClick={copyLinkToClipboard}>{copied ? <ImageSvg name="Check" /> : <ImageSvg name="Copy" />}</button>
              </div>
            </div>

            <div className="box-list-post">
              <h3>{t['Other recommended articles']}</h3>

              <ul>
                {posts &&
                  posts?.map((post) => (
                    <li key={post.id} className={post.documentId == id ? 'active-post' : ''}>
                      <Link href={`/insigth/${post.documentId}`}>{post.title}</Link>
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
