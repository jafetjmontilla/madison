import * as Icons from "../icons";
import { queries } from "./Fetching";


export const defaultVisibleColumns = [
  "tag", "title", "cod", "tag_cod", "descripcion", "funcion"
]

export const BodyStaticAPP = [
  {
    icon: < Icons.IconHome className="w-8 h-8 text-gray-500" />,
    title: "inicio",
    roles: ["all"],
    slug: "/",
  },
  {
    icon: <Icons.IconSetions className="w-8 h-8 text-gray-500" />,
    title: "secciones de la planta",
    roles: ["all"],
    slug: "/plantSections",
    getData: queries.getSections,
    //getByID: FetchGraphQL.business.getOneBusiness,
    createEntry: queries.createSections,
    //updateEntry: FetchGraphQL.business.updateBusiness,
    //deleteEntry: FetchGraphQL.business.deleteBusiness,
    schema: [
      {
        Header: "tag",
        accessor: "tag",
        type: "text",
        required: true,
        size: 1
      },
      {
        Header: "nombre",
        accessor: "title",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  },
  {
    icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
    title: "equipos de proceso",
    roles: ["all"],
    slug: "/processEquipment",
    getData: queries.getEquipments,
    createEntry: queries.createEquipments,
    schema: [
      {
        Header: "tag",
        accessor: "tag",
        type: "text",
        required: true,
        size: 1
      },
      {
        Header: "nombre",
        accessor: "title",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  },
  {
    icon: <Icons.IconScrewdriverWrench className="w-8 h-8 text-gray-500" />,
    title: "maestro de repuestos",
    roles: ["all"],
    slug: "/replacementsMasters",
    getData: queries.getReplacementsMasters,
    createEntry: queries.createReplacementsMasters,
    schema: [
      {
        Header: "código",
        accessor: "cod",
        type: "text",
        required: true,
        size: 1
      },
      {
        Header: "nombre",
        accessor: "title",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "descripcion",
        accessor: "descripcion",
        type: "text",
        required: false,
        size: 3
      },
      {
        Header: "componente",
        accessor: "componente",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "tag_cod",
        accessor: "tag_cod",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "cantidad",
        accessor: "cantidad",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  },
  {
    icon: <Icons.IconStateMachine className="w-8 h-8 text-gray-500" />,
    title: "maestro de equipos",
    roles: ["all"],
    slug: "/equipmentsMasters",
    getData: queries.getEquipmentsMasters,
    createEntry: queries.createEquipmentsMasters,
    schema: [
      {
        Header: "tag_cod",
        accessor: "tag_cod",
        type: "text",
        required: true,
        size: 1
      },
      {
        Header: "title",
        accessor: "title",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "funcion",
        accessor: "funcion",
        type: "text",
        required: false,
        size: 3
      },
      {
        Header: "ubicacion",
        accessor: "ubicacion",
        type: "select",
        ref: {
          table: "plantSections",
          accesor: "title"
        },
        required: false,
        size: 2
      },
      {
        Header: "horas_servicio_teorico",
        accessor: "horas_servicio_teorico",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "fecha_ult_mtto",
        accessor: "fecha_ult_mtto",
        type: "datetime-local",
        required: false,
        size: 1
      },
      {
        Header: "marca",
        accessor: "marca",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "modelo",
        accessor: "modelo",
        type: "text",
        required: false,
        size: 1
      },

      {
        Header: "tipo",
        accessor: "tipo",
        type: "select",
        ref: {
          table: "processEquipment",
          accessor: "title"
        },
        required: false,
        size: 1
      },
      {
        Header: "largo",
        accessor: "largo",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "alto",
        accessor: "alto",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "ancho",
        accessor: "ancho",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "potencia",
        accessor: "potencia",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "voltaje",
        accessor: "voltaje",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "amperaje (a)",
        accessor: "amperaje_a",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "corriente",
        accessor: "corriente",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "rpm",
        accessor: "rpm",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "frecuencia",
        accessor: "frecuencia",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "rodamiento 1",
        accessor: "rodamiento_1",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "rodamiento 2",
        accessor: "rodamiento_2",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "estopera",
        accessor: "estopera",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "capacidad",
        accessor: "capacidad",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "material",
        accessor: "material",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "espesor lamina",
        accessor: "espesor_lamina",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "peso (kg)",
        accessor: "peso_kg",
        type: "number",
        required: false,
        size: 1
      },
      {
        Header: "serial",
        accessor: "serial",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "grasa o lubricante",
        accessor: "grasa_lubricante",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "observaciones",
        accessor: "observaciones",
        type: "text",
        required: false,
        size: 3
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  },
  // {
  //   icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
  //   title: "configuración",
  //   roles: ["all"],
  // },
  {
    icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
    title: "configuración",
    roles: ["all"],
    slug: "/setup",
    postition: "bottom",
    subMenu: [
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "usuarios",
        roles: ["all"],
        slug: "/setup/users",
        getData: queries.getUser,
        createEntry: queries.createUsers,
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "secciones",
        roles: ["all"],
        slug: "/setup/sections",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "equipos",
        roles: ["all"],
        slug: "/setup/equipments",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "componentes",
        roles: ["all"],
        slug: "/setup/components",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "partes",
        roles: ["all"],
        slug: "/setup/parts",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "propiedades",
        roles: ["all"],
        slug: "/setup/properties",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "caracteristicas",
        roles: ["all"],
        slug: "/setup/characteristics",
      },
    ],
    schema: [
      {
        Header: "nombre",
        accessor: "name",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "Correo",
        accessor: "email",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "Permisos",
        accessor: "roles",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "teléfono",
        accessor: "phone",
        type: "text",
        required: true,
        size: 3
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  },


]

