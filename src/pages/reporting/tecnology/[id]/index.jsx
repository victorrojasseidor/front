import React, { useState, useEffect } from 'react';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import { useAuth } from '@/Context/DataContext';
import { useRouter } from 'next/router';
import Captcha from '../../reports/Captcha';

const Tecnology = () => {
  const { l } = useAuth();
  const t = l.Reporting;
  const router = useRouter();
  const { id } = router.query;

  const [tabData, setTabData] = useState(null);

  // Definir las pestañas y sus contenidos
  const tabs = [
    {
      idTab: 1,
      title: l.header['Captcha Solver'],
      path: '/reporting/tecnology/1',
      component: <Captcha />,
      type: l.header.Technology,
    },
  ];

  const handleTabClick = (index, data) => {
    router.push(data.path); // Usar la ruta de la pestaña en lugar del índice
  };

  useEffect(() => {
    const activeTabFromId = tabs.filter((tab) => tab.idTab == id);
    if (activeTabFromId.length > 0) {
      setTabData(activeTabFromId[0]);
    }
  }, [id, router]);

  return (
    <LayoutProducts menu="Reporting">
      <section className="layoutReporting">
        <div className="horizontalTabs">
          <div className="tab-header">
            {tabs.map((tab, index) => (
              <button key={index} className={tabData?.idTab === tab.idTab ? 'active' : ''} onClick={() => handleTabClick(index, tab)}>
                <h4>{tab.title}</h4>
              </button>
            ))}
          </div>
          <div className="tab-content">{tabData?.component}</div>
        </div>
      </section>
    </LayoutProducts>
  );
};

export default Tecnology;
