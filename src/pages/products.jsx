import "../../styles/styles.scss";
import LayoutProducts from "@/Components/LayoutProducts";
import ImageSvg from "@/helpers/ImageSVG";
import React, { useState, useEffect } from "react";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const products = [
    { id: 1, name: "Manzana", type: "Fruta" },
    { id: 2, name: "Banana", type: "Fruta" },
    { id: 3, name: "Naranja", type: "Fruta" },
    { id: 4, name: "Pera", type: "Fruta" },
    { id: 5, name: "Zanahoria", type: "Verdura" },
    { id: 6, name: "Tomate", type: "Verdura" },
    { id: 7, name: "Papa", type: "Verdura" },
    { id: 8, name: "Pollo", type: "Carne" },
    { id: 9, name: "Res", type: "Carne" },
    { id: 10, name: "Salmón", type: "Pescado" },
  ];
  

  const productsBank = [
    { id: 1, name: "rrency Exchange rates automation", type: "not hired", contry: "Perú", instances: 210, descripction: "Download the daily bank statement of any bank without token", status: " 5 set up 5 hours ago" },
    { id: 2, name: "Patters", type: "Fruta", type: "NOT HIRED", contry: "Perú", instances: 80, descripction: "Download the daily bank statement of any bank without token" },
    { id: 3, name: "Number Verification API", type: "Fruta" },
    { id: 4, name: "Downlaod automated Bank Statements", type: "Fruta" },
    { id: 5, name: "Exchange Rates Data API", type: "Verdura" },
    { id: 6, name: "Real-Time  Weather Data API", type: "Verdura" },
  ];

  useEffect(() => {
    const filterResults = () => {
      let results = products;

      if (selectedFilter) {
        results = results.filter((product) => product.type.toLowerCase().includes(selectedFilter.toLowerCase()));
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

  return (
    <LayoutProducts>
      <div className="products">
        <h2>Products</h2>
        <p>
          {" "}
          Welcome, <span> Innovativa S.A.C 👋 </span>{" "}
        </p>

        <div className="products_filterSearch">
          <div className="filterButtons">
            <button onClick={() => handleFilter(null)} className={selectedFilter === null ? "active" : ""}>
              All
            </button>
            <button onClick={() => handleFilter("Fruta")} className={selectedFilter === "Fruta" ? "active" : ""}>
              Hired
            </button>
            <button onClick={() => handleFilter("Verdura")} className={selectedFilter === "Verdura" ? "active" : ""}>
              No hired
            </button>
          </div>
          <div className="searchButton">
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={handleInputChange} />
            <button onClick={handleSearch}>
              <ImageSvg name="Search" />
            </button>
          </div>
        </div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => (
              <li key={product.id}>
                {product.name} - {product.type}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </LayoutProducts>
  );
}
