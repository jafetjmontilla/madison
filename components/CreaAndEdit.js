
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useMounted } from "../hooks/useMounted";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext";
import { ButtonBasic } from "./ButtonBasic";
import { IconDelete, PlusIcon } from "../icons";
import { useToast } from '../hooks/useToast';
import { CSSTransition, TransitionGroup } from "react-transition-group";




export const CreaAndEdit = () => {
  const nodeRef = useRef(null);
  const { stage, setStage } = AppContextProvider()
  const toast = useToast()
  const [valir, setValir] = useState(false)

  const { setLoading } = LoadingContextProvider()
  const [isMounted, setIsMounted] = useState(false)
  useMounted()
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        setLoading(false)
      }
    }
  }, [isMounted])

  const handleOnClick = () => {
    setStage({ action: "viewTable" })
  }

  const transitionLeftOpen = {
    transition: `opacity 2s`,
    opacity: `50%`,
  }
  const transitionLeftClose = {
    transition: "opacity 2s",
    opacity: `-50%`,
  }




  return (
    <div className="bg-gray-200 bg-opacity-50 flex items-center justify-center w-[100%] h-[90%] absolute z-10">
      <div className="bg-white w-full h-[100%] md:w-3/5 md:h-5/6 rounded-lg shadow-lg truncate">
        <div className="bg-gray-300 flex w-[100%] h-20 ">
          <div className="w-[25%] h-[100%] flex justify-start items-center">
            <span className="ml-4 text-xl uppercase font-semibold text-gray-700 ">
              {stage.payload ? "editar registro" : "crear registro"}
            </span>
          </div>
          <div className="w-[50%] h-[100%] flex justify-center items-center">
            {/* center */}
          </div>
          <div className="w-[25%] h-[100%] flex justify-end">
            <span className="hidden md:flex mr-5 mt-3 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={handleOnClick}>X</span>
          </div>
        </div>
        <div className=" h-[calc(100%-160px)]">
          <div className="gap-4 grid grid-cols-3 p-4">
            <div className="flex flex-col col-span-1">
              <label>tag</label>
              <input type="text" className="rounded-md" />
            </div>
            <div className="flex flex-col col-span-1">
              <label>tag</label>
              <input type="text" className="rounded-md" />
            </div>
            <div className="flex flex-col col-span-1">
              <label>tag</label>
              <input type="text" className="rounded-md" />
            </div>
            <div className="flex flex-col col-span-1">
              <label>tag</label>
              <input type="text" className="rounded-md" />
            </div>
          </div>
        </div>
        <div className={`bg-gray-300 flex h-20 items-center ${stage.payload ? "justify-start" : "justify-end"}`}>

          <ButtonBasic
            className={`m-4 ${!stage.payload ? "bg-green-500 hover:bg-green-600 w-36" : "bg-red-500 hover:bg-red-700 w-48 h-6"}`}
            onClick={
              () => {
                // setLoading(true)
                setStage(stage.action == "viewTable" ? { action: "creaAndEdit" } : { action: "viewTable" })
                toast("success", "result")
              }
            }
            caption={
              stage.payload ?
                <div className="flex gap-2 text-sm"><IconDelete className="w-5 h-5" /> eliminar registro</div>
                : <div className="flex gap-2"><PlusIcon className="w-6 h-6" /> agregar otro</div>
            }
          />

        </div>
      </div>
    </div>
  );
};

