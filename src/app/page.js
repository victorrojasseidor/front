"use client"

import { DataContextProvider } from "@/Context/DataContext";
import Register from "@/pages/register";
import "../../styles/styles.scss";

export default function Home() {

  return (
    <DataContextProvider>
    <main>
      <h1>
        pagina principal
      </h1>

      <div>
        <Register />
      </div>
    </main>
    </DataContextProvider>

  );
}
