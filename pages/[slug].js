
import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { CreaAndEdit } from "../components/CreaAndEdit";
import { LoadingContextProvider } from "../context/LoadingContext"
import { BodyStaticAPP } from "../utils/schemas"
import { fetchApi, queries } from "../utils/Fetching"
import { AppContextProvider } from "../context/AppContext"
import { ButtonBasic } from "../components/ButtonBasic"

const Slug = ({ slug }) => {

  const { setLoading } = LoadingContextProvider()
  const { component, setComponent, stage, setStage } = AppContextProvider()

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
      setStage({ action: "viewTable" })
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
    <div className="bg-blue-200 w-full h-full flex items-center justify-center relative">
      <div className="flex flex-col relative h-[100%] w-[95%] overflow-auto">
        <div className="w-[100%] h-[8%] flex items-center justify-left">
          <ButtonBasic
            className={`${stage.action == "viewTable" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-700"}`}
            onClick={
              () => {
                // setLoading(true)
                setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
              }
            }
            caption={stage.action == "viewTable" ? "crear registro" : "cancelar"}
          />
        </div>
        <div className="bg-gray-100 rounded-lg w-[100%] h-[90%] overflow-auto">
          {stage.action == "creaAndEdit" && <CreaAndEdit />}
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
