import Link from "next/link";
import { DataContextProvider } from "@/Context/DataContext";
import LayoutLogin from "@/Components/LayoutLogin";
import "../../styles/styles.scss";


export default function Register() {
  return (
    <DataContextProvider>
      <LayoutLogin>
        <div>
          <h1> pagina de Register </h1>
        </div>
      </LayoutLogin>
    </DataContextProvider>
  );
}
