
import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useMounted } from "../hooks/useMounted";
import { LoadingContextProvider } from "../context/LoadingContext";


export const CreaAndEdit = () => {
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



  return (
    <div className="bg-green-100 flex w-[100%] h-[100%]">
      Sección en contrucción!!
    </div>
  );
};

