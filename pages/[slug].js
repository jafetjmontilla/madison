
import { useEffect, useState } from "react";
import { DataTable } from "../components/DataTable";
import { CreaAndEdit } from "../components/CreaAndEdit";
import { LoadingContextProvider } from "../context/LoadingContext"
import { BodyStaticAPP } from "../utils/schemas"
import { fetchApi, queries } from "../utils/Fetching"
import { AppContextProvider } from "../context/AppContext"
import { ButtonBasic } from "../components/ButtonBasic"
import { CSSTransition } from "react-transition-group";

const Slug = ({ slug }) => {
  const { setLoading } = LoadingContextProvider()
  const { component, setComponent, stage, setStage, data, setData } = AppContextProvider()

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




  //   <div className="w-40 h-10 bg-red-500"></div>
  // </CSSTransition>



  return (
    <div className="bg-blue-200 w-full h-full flex items-center justify-center relative">
      <div className="flex flex-col relative h-[100%] w-[95%] overflow-auto">
        <div className="w-[100%] h-[8%] flex items-center justify-left">
          <ButtonBasic
            className={`${stage.action == "viewTable" ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 hover:bg-gray-500"}`}
            onClick={
              () => {
                // setLoading(true)
                setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
              }
            }
            caption={stage.action == "viewTable" ? "crear registro" : "volver"}
          />
        </div>
        <div className="bg-gray-100 rounded-lg w-[100%] h-[90%] overflow-auto">
          <CSSTransition
            in={stage.action == "creaAndEdit"}
            //nodeRef={nodeRef}
            classNames="alert"
            unmountOnExit
            onEnter={() => { }} //al comienzo de la transición
            timeout={300} //tiempo para demontar el componente
            onExited={() => { }} //al desmontar el componente
          >
            <CreaAndEdit />
          </CSSTransition>
          <DataTable data={data} setData={setData} />
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
