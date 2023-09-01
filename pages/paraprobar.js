import { useRouter } from "next/router";
import { TableTag } from "../../components/TableTag";

const Slug = () => {
  const router = useRouter()
  console.log("segundo nivel")
  return (
    <TableTag />
  );
};

export default Slug;

