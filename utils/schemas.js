import * as Icons from "../icons";

export const BodyStaticAPP = [
  {
    icon: <Icons.IconSetions className="w-8 h-8 text-gray-500" />,
    title: "secciones de la planta",
    roles: ["all"],
    slug: "/plantSections",
    //getData: FetchGraphQL.business.getBusinessAll,
    //getByID: FetchGraphQL.business.getOneBusiness,
    //createEntry: FetchGraphQL.business.createBusiness,
    //updateEntry: FetchGraphQL.business.updateBusiness,
    //deleteEntry: FetchGraphQL.business.deleteBusiness,
    schema: [
      {
        Header: "ID",
        accessor: "_id",
      },
      {
        Header: "Nombre de empresa",
        accessor: "businessName",
        type: "textareaSizable",
        required: true,
      }
    ]
  },
  {
    icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
    title: "equipos de proceso",
    roles: ["all"],
    slug: "/processEquipment",
    //getData: FetchGraphQL.business.getBusinessAll,
    //getByID: FetchGraphQL.business.getOneBusiness,
    //createEntry: FetchGraphQL.business.createBusiness,
    //updateEntry: FetchGraphQL.business.updateBusiness,
    //deleteEntry: FetchGraphQL.business.deleteBusiness,
    schema: [
      {
        Header: "ID",
        accessor: "_id",
      },
      {
        Header: "Nombre de empresa",
        accessor: "businessName",
        type: "textareaSizable",
        required: true,
      }
    ]
  },
]