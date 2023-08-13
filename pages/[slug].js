
import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { CreaAndEdit } from "../components/CreaAndEdit";
import { LoadingContextProvider } from "../context/LoadingContext"
import { useMounted } from "../hooks/useMounted";
import { BodyStaticAPP } from "../utils/schemas"


const Slug = ({ slug }) => {
  const { setLoading, setComponent, component } = LoadingContextProvider()
  const [stage, setStage] = useState("viewTable")
  //  useMounted()
  useEffect(() => {
    setStage("viewTable")
    setLoading(false)
    setComponent(BodyStaticAPP.filter(elem => elem.slug === `/${slug}`)[0]?.title)
    console.log(30012, slug, component)
  }, [slug]);


  const stages = {
    viewTable: <DataTable />,
    creaAndEdit: <CreaAndEdit />
  }

  return (
    <div className="bg-blue-200 w-full h-full flex items-center justify-center">
      <div className="flex flex-col relative h-[100%] w-[95%] overflow-auto">
        <div className="w-[100%] h-[8%] flex items-center justify-left">
          <div onClick={() => {
            setLoading(true)
            setStage(stage == "viewTable" ? "creaAndEdit" : "viewTable")
          }} >
            <div className="bg-green-500 w-32 h-10 rounded-lg flex cursor-pointer hover:bg-green-600 border-1 text-white items-center justify-center capitalize">
              {stage == "viewTable" ? "crear registro" : "guardar registro"}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg w-[100%] h-[90%] overflow-auto">

          {/* {stages[stage]} */}
          {stage == "creaAndEdit" && <CreaAndEdit />}
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default Slug;

export async function getServerSideProps({ params }) {
  return {
    props: params,
  };
}
