// import "../../../styles/styles.scss";
import LayoutProducts from "@/Components/LayoutProducts";
import ImageSvg from "@/helpers/ImageSVG";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import LimitedParagraph from "@/helpers/limitParagraf";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Context/DataContext";
import { fetchConTokenPost } from "@/helpers/fetch";
import Loading from "@/Components/Atoms/Loading";
import RefreshToken from "@/Components/RefresToken";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [product, setProduct] = useState({});
  const [modalToken, SetModalToken] = useState(false);

  const { session, setSession, empresa } = useAuth();

  // console.log("😍data",products );
  // console.log("😍producti",product );

  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }

    // getProducts();

    if (!product) {
      return <Loading />;
    }
  }, [session, product]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    let body = {
      oResults: {
        iIdEmpresa: empresa.id_empresa,
        iIdPais: 1,
      },
    };

    console.log("bodyconsultarproducto", body);

    try {
      let token = session.sToken;

      let responseData = await fetchConTokenPost("dev/BPasS/?Accion=ConsultaProductoEmpresa", body, token);

      if (responseData.oAuditResponse?.iCode === 1) {
        const data = responseData.oResults;
        setProduct(data);
        SetModalToken(false);
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : "Error in sending the form";
        console.log("errok, ", errorMessage);
        SetModalToken(true);
        // setStatus(errorMessage);
      }
    } catch (error) {
      console.error("error", error);
      SetModalToken(true);
      // setStatus("Service error");
    }
  }

  useEffect(() => {
    if (product) {
      const filterResults = () => {
        let results = product;
        console.log("res", results);

        if (selectedFilter) {
          results = results.filter((product) => product.sDescStatus.toLowerCase().includes(selectedFilter.toLowerCase()));
        }

        if (searchQuery) {
          results = results.filter((product) => product.sName.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setSearchResults(results);
      };

      filterResults();
    }
  }, [searchQuery, selectedFilter, product]);

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
      return <span>Expires in {time.SExpires} ago</span>;
    } else if (status === "Pendiente") {
      return <span>{time.sEnabled}</span>;
    } else if (status === "Not hired") {
      return <span>Updated {time.sUpdate} ago</span>;
    } else {
      return <span>---</span>;
    }
  };

  const renderButtons = (data) => {
    let status = data.sDescStatus;
    if (status === "Configured") {
      return <span> </span>;
    } else if (status === "Earring") {
      return (
        <Link href={`/product/${data.iId}`}>
          <button className="btn_primary">Configurations</button>
        </Link>
      );
    } else if (status === "Not hired") {
      return <button className="btn_secundary">Free trial</button>;
    } else {
      return <span> </span>;
    }
  };

  console.log("mol", modalToken);

  return (
    <LayoutProducts>
      <div className="products">
        <div className="products_filterSearch">
          <div className="filterButtons">
            <button onClick={() => handleFilter(null)} className={selectedFilter === null ? "active" : ""}>
              All
            </button>
            <button onClick={() => handleFilter("Configured")} className={selectedFilter === "Configured" ? "active" : ""}>
              Configured
            </button>
            <button onClick={() => handleFilter("Pendiente")} className={selectedFilter === "Pendiente" ? "active" : ""}>
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
                <li key={product.iId} className={"card" + (product.sDescStatus == "Configured" ? " configured" : "") + (product.sDescStatus == "Pendiente" ? " earring" : "")}>
                  <div>
                    <span>
                      <ImageSvg name="Products" />
                    </span>

                    <Link href={`/product/${product.iId}`}>
                      <h5> {product.sName}</h5>
                    </Link>
                  </div>
                  <div>
                    <p>{product.sDescStatus}</p>
                    <span>
                      <ImageSvg name="Time" />
                      {renderSelectedFilter(product.sDescStatus, product.jTime)}
                    </span>
                  </div>

                  <div>
                    <LimitedParagraph text={product.sDescription} limit={40} />
                  </div>

                  <div>
                    <Link href={`/product/${product.iId}`}>
                      {" "}
                      <p> View more</p>
                    </Link>
                    {renderButtons(product)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>

      <div>{modalToken && session && <RefreshToken tok={session?.sToken} />}</div>
    </LayoutProducts>
  );
}
