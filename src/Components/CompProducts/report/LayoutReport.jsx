import React, { useState } from 'react';
import LayoutProducts from '@/Components/LayoutProducts';
import ImageSvg from '@/helpers/ImageSVG';
import Link from 'next/link';
import { useAuth } from '@/Context/DataContext';
import { useRouter } from 'next/navigation'; // Cambiado desde 'next/navigation'

const LayouReport = ({ defaultTab, children }) => {
  const { l } = useAuth();
  const t = l.Reporting;
  const [activeTab, setActiveTab] = useState(defaultTab || 0);
  const router = useRouter();

  // Definir las pestañas y sus contenidos
  const tabs = [
    { title: t.Balance, path: '/reporting/balance' },
    { title: t.Movement, path: '/reporting/movement' },
    { title: l.Pattern.Pattern, path: '/reporting/Padrones' },
  ];

  const handleTabClick = (index, path) => {
    setActiveTab(index);
    router.push(path);
  };

  return (
    <LayoutProducts menu="Reporting">
     
      <section className="layoutReporting">
        <div className="horizontalTabs">
          <div className="tab-header">
            {tabs.map((tab, index) => (
              <button key={index} className={activeTab === index ? 'active' : ''} onClick={() => handleTabClick(index, tab.path)}>
                <h4>{tab.title}</h4>
              </button>
            ))}
          </div>
          <div className="tab-content">
            {tabs.map((tab, index) => (
              <div className="tabOne" key={index}>
                {defaultTab === index && children}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayoutProducts>
  );
};

export default LayouReport;
