import React from 'react';
import LayoutHome from '@/Components/LayoutHome';
import ImageSvg from '@/helpers/ImageSVG';

export default function index() {
  return (
    <LayoutHome>
      <section className="insigths">
        <section className="insigths-navigation">
          <span> Home</span>
          <ImageSvg name="Navigation" />
          <span> titulos del post </span>
        </section>

        <section className="insigths-container-posts">
          <div className="insigths-post">inisgths</div>

          <div className="insigths-sugestions">sugestiones</div>
        </section>
      </section>
    </LayoutHome>
  );
}
