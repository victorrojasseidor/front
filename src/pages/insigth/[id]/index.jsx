import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import LayoutHome from '@/Components/LayoutHome';
import ImageSvg from '@/helpers/ImageSVG';
import Image from 'next/image';
import { useAuth } from '@/Context/DataContext';
import autor from '../../../../public/img/post/autor.jpg';
import { useRouter } from 'next/router';
import { formatDate } from '@/helpers/report';
import Link from 'next/link';
import LoadingComponent from '@/Components/Atoms/LoadingComponent';
import { convertMarkdownToHTML } from '@/helpers/report';

export default function Index() {
  const { l } = useAuth();
  const router = useRouter();
  const { id } = router.query; // Aquí obtienes el ID de la URL dinámica
  const t = l.home;
  const [copied, setCopied] = useState(false); // Estado para mostrar si el link fue copiado
  const [posts, getpost] = useState([]);
  const [cardInsights, setcardInsights] = useState(null);

  const strapiURL = 'https://test-post-07ho.onrender.com';

  async function getPostStrapi() {
    const res = await fetch(`${strapiURL}/api/posts?locale=${router.locale === 'en' ? 'en' : 'es'}&populate=image`);
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
    const res = await fetch(`${strapiURL}/api/posts?filters[id]=${id}&populate=*&locale=${router.locale === 'en' ? 'en' : 'es'}`);
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

  const getShareLink = () => {
    const baseURL = window.location.origin;
    const postLink = `${baseURL}/insigth/${cardInsights?.id}`; // Ajusta la ruta según sea necesario

    const title = cardInsights ? cardInsights.attributes.title : 'Título por defecto';
    const summary = cardInsights ? cardInsights.attributes.description : 'Descripción por defecto';

    const linkedinShareURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postLink)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent(strapiURL)}`;
    const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(postLink)}&via=yourTwitterHandle`;

    console.log('URL de LinkedIn:', linkedinShareURL);
    console.log('URL de Twitter:', twitterShareURL);

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
        <title>{cardInsights?.attributes.title}</title>
        <meta name="description" content={cardInsights?.attributes.description} />
        <meta name="keywords" content={cardInsights?.attributes.keyboards} />
        {/* Metadatos para Open Graph (LinkedIn, Facebook, etc.) */}
        <meta property="og:title" content={cardInsights?.attributes.title} />
        <meta property="og:description" content={cardInsights?.attributes.description} />
        <meta property="og:image" content={cardInsights?.attributes.image.data.attributes.url} />
        <meta property="og:url" content={`${window.location.origin}/insigth/${cardInsights?.id}`} /> {/* URL del post */}
        <meta property="og:type" content="article" />
        {/* Metadatos para Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cardInsights?.attributes.title} />
        <meta name="twitter:description" content={cardInsights?.attributes.description} />
        <meta name="twitter:image" content={cardInsights?.attributes.image.data.attributes.url} />
        <meta name="twitter:site" content="@yourTwitterHandle" />
        {/* URL canónica */}
        <link rel="canonical" href={`${window.location.origin}/insigth/${cardInsights?.id}`} />
      </Head>
      {cardInsights && Object.keys(cardInsights).length > 0 ? (
        <section className="insigth">
          <section className="insigth-navigation">
            <span> Home</span>
            <ImageSvg name="Navigation" />
            <span className="title--post"> {cardInsights?.attributes.title} </span>
          </section>

          <section className="insigth-suggestions-posts">
            <div className="insigth-post">
              <figure className="image--post">
                <Image src={cardInsights?.attributes.image.data.attributes.url} width={400} height={300} alt={cardInsights?.attributes.title} />

                <div className="box-title">
                  <span>{cardInsights?.attributes.type}</span>
                  <h1>{cardInsights?.attributes.title}</h1>
                  <p>{cardInsights && formatDate(cardInsights?.attributes.updatedAt)}</p>
                </div>
              </figure>

              <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(cardInsights?.attributes.content) }} />
            </div>

            <div className="insigth-suggestions">
              <div className="box-autor">
                <Image src={cardInsights?.attributes?.imgAutor?.data ? cardInsights.attributes.imgAutor.data.attributes.url : autor} width={40} height={40} alt={cardInsights?.attributes?.autor} />

                <div className="dates-autor">
                  <p> {cardInsights?.attributes.autor}</p>
                  <span>{cardInsights?.attributes.authorRole}</span>
                </div>
              </div>

              <div className="box-shared">
                <h4>Share with your community!</h4>

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
                <h3>Other recommended articles</h3>

                <ul>
                  {posts &&
                    posts?.map((post) => (
                      <li key={post.id} className={post.id == id ? 'active-post' : ''}>
                        <Link href={`/insigth/${post.id}`}>{post.attributes.title}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <p>waiting</p>
      )}
    </LayoutHome>
  );
}
