import { useRouter } from "next/router";
import { TableTag } from "../components/TableTag";

const Slug = (params) => {

  return (
    // <div className="flex flex-col gap-4">
    //   <p>{params?.slug?.toString()}</p>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1/2/3/4/5/6") }} >/listing/1/2/3/4/5/6</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1/2/3/4/5") }} >/listing/1/2/3/4/5</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1/2/3/4") }} >/listing/1/2/3/4</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1/2/3") }} >/listing/1/2/3</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1/2") }} >/listing/1/2</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing/1") }} >/listing/1</button>
    //   <button className="bg-blue-100" onClick={() => { router.push("/listing") }} >/listing</button>


    // </div>
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