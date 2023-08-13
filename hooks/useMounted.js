import { useEffect, useState } from "react"
import { LoadingContextProvider } from "../context/LoadingContext";

export const useMounted = () => {
  const { setLoading } = LoadingContextProvider()
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
    if (isMounted) {
      setTimeout(() => {
        setLoading()
      }, 50);
    }
  }, [isMounted])
}
