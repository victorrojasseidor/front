import "../../styles/styles.scss";
import LayoutProducts from "@/Components/LayoutProducts";
import ImageSvg from "@/helpers/ImageSVG";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import LimitedParagraph from "@/helpers/limitParagraf";


export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const products = [
    { id: 1, name: "Downlaod automated Bank Statements", status: "Configured", contry: "Perú", time:{update: " ", enabled: " ", expires: "4 days"}, description: "Download the daily bank statement of any bank without token" },
    { id: 2, name: "Currency Exchange rates automation", status: "Earring", contry: "Perú",time:{ update: " ", enabled: "3 months", expires: " "}, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate" },
    { id: 3, name: "Pattern", status: "Configured", contry: "Perú",time: { update: " ", enabled: " ", expires: "4 days"}, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate" },
    { id: 4, name: "Pattern IOP", status: "Not hired", contry: "Perú",time: {update: "3 months ", enabled: "", expires: " "}, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate" },
    { id: 5, name: "Exchange Rates Data API", status: "Not hired", contry: "Perú", time:{ update: "3 months ", enabled: "", expires: " "}, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate" },
    { id: 6, name: "Real-Time  Weather Data API", status: "Not hired", contry: "Perú", time: {update: "3 months ", enabled: "", expires: " "}, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus risus at tortor ullamcorper, nec consequat mauris gravida. Nunc at odio at velit convallis vulputate" },
  ];



  useEffect(() => {
    const filterResults = () => {
      let results = products;

      if (selectedFilter) {
        results = results.filter((product) => product.status.toLowerCase().includes(selectedFilter.toLowerCase()));
      }

      if (searchQuery) {
        results = results.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setSearchResults(results);
    };

    filterResults();
  }, [searchQuery, selectedFilter]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSearch = () => {
    setSearchQuery("");
    setSelectedFilter(null);
  };


  const renderSelectedFilter = (status, time) => {
     
    if (status === "Configured") {

      return <span>Expires in {time.expires} ago</span>;
    } else if (status === "Earring") {

      return <span>Enabled {time.enabled} ago</span>;
    } else if (status === "Not hired") {

      return <span>Updated {time.update} ago</span>;
    } else {
 
      return <span>---</span>;
    }
  
 
  };


  const renderButtons = (status) => {
     
    if (status === "Configured") {

      return <span> </span>;
    } else if (status === "Earring") {

      return <Link href="/dhdhhd">
      <button className='btn_primary'>Configurations</button>
    </Link>;
    } else if (status === "Not hired") {

      return <button className='btn_secundary'>Free trial</button>;
    } else {
 
      return <span> </span>;
    }
  
 
  };



  return (
    <LayoutProducts>
      <div className="products">
        <h2>Products</h2>
        <p>
          Welcome, <span> Innovativa S.A.C 👋 </span>{" "}
        </p>

        <div className="products_filterSearch">
          <div className="filterButtons">
            <button onClick={() => handleFilter(null)} className={selectedFilter === null ? "active" : ""}>
              All
            </button>
            <button onClick={() => handleFilter("Configured")} className={selectedFilter === "Configured" ? "active" : ""}>
              Configured
            </button>
            <button onClick={() => handleFilter("Earring")} className={selectedFilter === "Earring" ? "active" : ""}>
              Earring
            </button>
            <button onClick={() => handleFilter("Not hired")} className={selectedFilter === "Not hired" ? "active" : ""}>
              Not hired
            </button>
          </div>
          <div className="searchButton">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange} />
            <button onClick={handleSearch}>
              <ImageSvg name="Search" />
            </button>
          </div>
        </div>

        {searchResults.length > 0 ? (
          <div className="products_cards">
            <p> {selectedFilter}</p>
            <ul>
              {searchResults.map((product) => (
                <li key={product.id} className={ "card" + (product.status=="Configured" ? ' configured' : '') + (product.status=="Earring" ? ' earring' : '')} >
                  <div >
                    <span >
                      <ImageSvg name="Products" />
                    </span>
                    <Link href="/product">
                      <h4> {product.name}</h4>
                    </Link>
                  </div>
                  <div >
                    <p>{product.status}</p>
                    <span>
                      <ImageSvg name="Time" />
                      {renderSelectedFilter(product.status,product.time)}
                  
                    </span>
                  </div>

                  <div>
                    <LimitedParagraph text={product.description} limit={80} />
                  </div>

                  <div>
                    <Link href="/dhdhhd"> <p> View more
                      </p></Link>
                      {renderButtons(product.status)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </LayoutProducts>
  );
}
