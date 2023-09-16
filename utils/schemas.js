import * as Icons from "../icons";
import { BsShieldLockFill, BsIntersect } from 'react-icons/bs';
import { RiShieldUserLine } from 'react-icons/ri';
import { HiUserGroup, HiUserCircle } from 'react-icons/hi';
import { VscGroupByRefType } from 'react-icons/vsc';
import { AiFillSetting } from 'react-icons/ai';
import { GrCodeSandbox } from 'react-icons/gr';
import { FiLogOut } from 'react-icons/fi';
import { queries } from "./Fetching";



export const defaultVisibleColumns = [
  "tag", "title", "cod", "tag_cod", "descripcion", "funcion", "name", "email", "phone", "roles", "permissions", "type", "groups", "phone"
]

export const BodyStaticAPP = [
  {
    icon: < Icons.IconHome className="w-8 h-8 text-gray-500" />,
    title: "inicio",
    groups: ["all"],
    slug: "/",
  },
  {
    icon: <BsIntersect className="w-8 h-8 text-gray-500" />,
    title: "secciones de la planta",
    groups: ["admin", "gerencia mantenimiento", "supervisor mantenimiento"],
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
    groups: ["admin", "gerencia mantenimiento", "supervisor mantenimiento", "gerencia servicios"],
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
    groups: ["admin", "gerencia mantenimiento", "supervisor mantenimiento"],
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
    groups: ["admin", "gerencia mantenimiento", "supervisor mantenimiento"],
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
  //   groups: ["admin"],
  // },
  {
    icon: <AiFillSetting className="w-8 h-8 text-gray-500" />,
    title: "configuración",
    groups: ["admin"],
    slug: "/setup",
    postition: "bottom",
    subMenu: [
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "secciones",
        groups: ["admin"],
        slug: "/setup/sections",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "equipos",
        groups: ["admin"],
        slug: "/setup/equipments",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "componentes",
        groups: ["admin"],
        slug: "/setup/components",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "partes",
        groups: ["admin"],
        slug: "/setup/parts",
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "propiedades",
        groups: ["admin"],
        slug: "/setup/properties",
        getData: queries.getProperties,
      },
      {
        icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
        title: "características",
        groups: ["admin"],
        slug: "/setup/characteristics",
      },
      {
        icon: <GrCodeSandbox className="w-6 h-8 text-gray-500" />,
        title: "variables",
        groups: ["admin"],
        slug: "/setup/variables",
        getData: queries.getVariables,
        createEntry: queries.createVariables,
        updateEntry: queries.updateVariable,
        schema: [
          {
            Header: "tag",
            accessor: "tag",
            type: "text",
            required: true,
            size: 3
          }, {
            Header: "nombre",
            accessor: "title",
            type: "text",
            required: true,
            size: 3
          }, {
            Header: "tipo",
            accessor: "type",
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
    ],

  },
  {
    icon: <BsShieldLockFill className="w-8 h-8 text-gray-500" />,
    title: "seguridad",
    groups: ["admin"],
    slug: "/security",
    postition: "bottom",
    subMenu: [
      {
        icon: <RiShieldUserLine className="w-8 h-8 text-gray-500" />,
        title: "usuarios",
        groups: ["admin"],
        slug: "/security/users",
        getData: queries.getUser,
        createEntry: queries.createUsers,
        updateEntry: queries.updateUser,
        schema: [
          {
            Header: "correo",
            accessor: "email",
            type: "text",
            required: true,
            readOnly: true,
            size: 2
          },
          {
            Header: "contraseña",
            accessor: "password",
            type: "text",
            required: true,
            size: 1
          },
          {
            Header: "nombre",
            accessor: "name",
            type: "text",
            required: true,
            size: 2
          }, {
            Header: "teléfono",
            accessor: "phone",
            type: "text",
            required: true,
            size: 2
          },
          {
            Header: "grupos de permisos",
            accessor: "groups",
            type: "checkbox",
            required: false,
            size: 3,
            getOptions: queries.getGroups,
          },
          {
            Header: "id",
            accessor: "_id",
            type: "id",
          }
        ]
      },
      {
        icon: <HiUserGroup className="w-8 h-8 text-gray-500" />,
        title: "grupos",
        groups: ["admin"],
        slug: "/security/group",
        getData: queries.getGroups,
        createEntry: queries.createGroups,
        updateEntry: queries.updateGroup,
        schema: [
          {
            Header: "tag",
            accessor: "tag",
            type: "text",
            required: true,
            size: 3
          },
          {
            Header: "nombre",
            accessor: "title",
            type: "text",
            required: true,
            size: 3
          },
          {
            Header: "permisos",
            accessor: "permissions",
            type: "checkbox",
            required: false,
            size: 3,
            getOptions: queries.getPermissions,
          },
          {
            Header: "id",
            accessor: "_id",
            type: "id",
          }
        ]
      },
      {
        icon: <VscGroupByRefType className="w-8 h-8 text-gray-500" />,
        title: "permisos",
        groups: ["admin"],
        slug: "/security/permission",
        getData: queries.getPermissions,
        createEntry: queries.createPermissions,
        schema: [
          {
            Header: "tag",
            accessor: "tag",
            type: "text",
            required: true,
            size: 3
          },
          {
            Header: "permiso",
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
    ],

  },
  {
    icon: <HiUserCircle className="w-8 h-8 text-gray-500" />,
    title: "{{user.displayName}}",
    groups: ["all"],
    slug: "/profile",
    postition: "bottom",
    subMenu: [
      {
        icon: <FiLogOut className="w-8 h-8 text-gray-500" />,
        title: "preferencias",
        groups: ["all"],
        slug: "/profile/perfil",
        // getData: queries.getUser,
        // createEntry: queries.createUsers,
        // updateEntry: queries.updateUser,
        schema: [
          {
            Header: "nombre",
            accessor: "name",
            type: "text",
            required: true,
            size: 2
          },
        ]
      },
      {
        icon: <FiLogOut className="w-8 h-8 text-gray-500" />,
        title: "cambiar contraseña",
        groups: ["all"],
        slug: "/profile/passwords",
        // getData: queries.getUser,
        // createEntry: queries.createUsers,
        // updateEntry: queries.updateUser,
        schema: [
          {
            Header: "nombre",
            accessor: "name",
            type: "text",
            required: true,
            size: 2
          },
        ]
      },
      {
        icon: <FiLogOut className="w-8 h-8 text-gray-500" />,
        title: "desconectar",
        groups: ["all"],
        logout: true,
        // slug: "/security/users",
        // getData: queries.getUser,
        // createEntry: queries.createUsers,
        // updateEntry: queries.updateUser,
        schema: [
          {
            Header: "nombre",
            accessor: "name",
            type: "text",
            required: true,
            size: 2
          },
        ]
      }
    ]
  }

]

