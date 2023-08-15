
import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { CreaAndEdit } from "../components/CreaAndEdit";
import { LoadingContextProvider } from "../context/LoadingContext"
import { BodyStaticAPP } from "../utils/schemas"
import { fetchApi, queries } from "../utils/Fetching"
import { AppContextProvider } from "../context/AppContext"


const Slug = ({ slug }) => {

  const { setLoading } = LoadingContextProvider()
  const { component, setComponent, } = AppContextProvider()

  const [stage, setStage] = useState("viewTable")
  const [data, setData] = useState()
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    console.log("cambio slug")
    if (isMounted) {
      setStage("viewTable")
      setComponent(BodyStaticAPP.filter(elem => elem.slug === `/${slug}`)[0]?.title)
      fetchApi({
        query: BodyStaticAPP.filter(elem => elem.slug === `/${slug}`)[0]?.getData,
        variables: {
          args: {},
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      }).then(result => setData(result))
    }
  }, [slug, isMounted]);

  return (
    <div className="bg-blue-200 w-full h-full flex items-center justify-center">
      <div className="flex flex-col relative h-[100%] w-[95%] overflow-auto">
        <div className="w-[100%] h-[8%] flex items-center justify-left">
          <div onClick={() => {
            // setLoading(true)
            setStage(stage == "viewTable" ? "creaAndEdit" : "viewTable")
          }} >
            <div className="bg-green-500 w-32 h-10 rounded-lg flex cursor-pointer hover:bg-green-600 border-1 text-white items-center justify-center capitalize">
              {stage == "viewTable" ? "crear registro" : "guardar registro"}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg w-[100%] h-[90%] overflow-auto">
          {stage == "creaAndEdit" && <CreaAndEdit />}
          <DataTable data={data} />
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
