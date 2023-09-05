import { useRouter } from "next/router";
import { TableTag } from "../components/TableTag";
import { AppContextProvider } from "../context/AppContext";
import { useEffect } from "react";
import { BodyStaticAPP } from "../utils/schemas";
import { LoadingContextProvider } from "../context/LoadingContext";


const Slug = (params) => {

  const { setItemSchema } = AppContextProvider()
  const { setLoading } = LoadingContextProvider()
  const router = useRouter()

  useEffect(() => {
    if (router.query?.slug.length == 1) {
      const asd = BodyStaticAPP.find(elem => elem.slug == router.asPath)
      setItemSchema({ ...asd })
    }
    if (router.query?.slug.length == 2) {
      const a = BodyStaticAPP.find(elem => elem.slug == `/${router.query?.slug[0]}`)
      const asd = a?.subMenu?.find(elem => elem.slug == router.asPath)
      setItemSchema({ ...asd, father: a })
    }
    setTimeout(() => {
      setLoading(false)
    }, 250);
  }, [router.asPath])

  return (
    <TableTag />
  );
};

export default Slug;

export async function getServerSideProps({ params }) {
  console.log(params)
  return {
    props: params,
  };
}
