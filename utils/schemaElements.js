import * as Icons from "../icons";
import { BsIntersect } from 'react-icons/bs';
import { SiGooglesearchconsole } from "react-icons/si";
import { queries } from "./Fetching";
import { ImOffice, ImInsertTemplate } from 'react-icons/im';

export const optionsComponents = [
  { title: "motor" },
  { title: "sistema de transmisión" },
  { title: "estructura" },
  { title: "elementos de sujeción" },
  { title: "sensores" },
  { title: "controlador" },
  { title: "actuador" },
]

export const schemaElement = [
  {
    title: "empresa",
    typeElement: "company",
    children: ["section", "area", "equipment", "part"],
    icon: <ImOffice className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "secciones",
    typeElement: "section",
    father: ["company"],
    children: ["area", "equipment", "part"],
    icon: <ImInsertTemplate className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "areas",
    typeElement: "area",
    father: ["company", "section"],
    children: ["equipment", "part"],
    icon: <BsIntersect className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "equipos",
    typeElement: "equipment",
    father: ["section", "area", "equipment"],
    children: ["equipment", "component", "part"],
    icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "componentes",
    typeElement: "component",
    father: ["section", "area", "equipment", "component"],
    children: ["component", "part"],
    icon: <Icons.IconStateMachine className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "partes",
    typeElement: "part",
    father: ["equipment", "component"],
    icon: <Icons.IconScrewdriverWrench className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "consumibles",
    typeElement: "consumable",
    father: ["equipment"],
    icon: <SiGooglesearchconsole className="w-8 h-8 text-gray-500" />,
  },
]

export const elements = schemaElement.map(elem => {
  return {
    icon: elem.icon,
    title: elem.title,
    groups: ["admin", "development", "coordinador de mantenimiento", "supervisor de mantenimiento", "supervisor de servicios generales"],
    slug: `/setup/${elem.typeElement}`,
    dataVariables: { typeElement: elem.typeElement },
    sortData: { tag: 1 },
    getData: queries.getElements,
    createEntry: queries.createElements,
    updateEntry: queries.updateElements,
    deleteEntry: queries.deleteElements,
    schema: [
      ["company", "area", "section", "equipment"].includes(elem.typeElement) &&
      {
        Header: "tag",
        accessor: "tag",
        type: "text",
        required: true,
        size: 1
      },
      ["component"].includes(elem.typeElement) &&
      {
        Header: "tipo",
        accessor: "tipo",
        type: "select",
        options: [{}],//optionsComponents.map((elem) => { return { value: elem.title, label: elem.title } }),
        required: true,
        size: 1,
      },

      ["part", "consumable"].includes(elem.typeElement) &&
      {
        Header: "tipo",
        accessor: "tipo",
        type: "select",
        options: [{}],
        required: true,
        size: 1,
      },
      ["part", "consumable"].includes(elem.typeElement) &&
      {
        Header: "código",
        accessor: "codigo",
        type: "text",
        required: false,
        size: 1
      },
      {
        Header: "nombre",
        accessor: "title",
        type: "textarea",
        required: true,
        size: 3
      },
      ["company", "area", "section", "equipment"].includes(elem.typeElement) &&
      {
        Header: "parte de",
        accessor: "father",
        type: "dobleSelect",
        options: elem?.father?.map(elem => {
          return {
            value: elem,
            label: `${schemaElement.find(el => el.typeElement === elem)?.title
              }`
          }
        }),
        size: 3
      },
      ["company", "area", "section", "equipment"].includes(elem.typeElement) &&
      {
        Header: "propiedades",
        accessor: "properties",
        type: "properties",
        // options: elem?.father?.map(elem => {
        //   return {
        //     value: elem,
        //     label: `${schemaElement.find(el => el.typeElement === elem)?.title
        //       }`
        //   }
        // }),
        size: 3
      },
      {
        Header: "caracteristicas",
        accessor: "characteristics",
        type: "characteristics",
        // options: elem?.father?.map(elem => {
        //   return {
        //     value: elem,
        //     label: `${schemaElement.find(el => el.typeElement === elem)?.title
        //       }`
        //   }
        // }),
        size: 3
      },
      [].includes(elem.typeElement) && {
        Header: "componentes",
        accessor: "component",
        type: "componentsAndParts",
        size: 3,
        icon: <Icons.IconStateMachine className="w-5 h-5 text-gray-500" />,
      },
      [].includes(elem.typeElement) && {
        Header: "partes",
        accessor: "part",
        type: "componentsAndParts",
        size: 3,
        icon: <Icons.IconScrewdriverWrench className="w-5 h-5 text-gray-500" />,
      },
      ["equipment"].includes(elem.typeElement) && {
        Header: "componentes",
        accessor: "componentsMasters",
        type: "components",
        options: optionsComponents.map((elem) => { return { value: elem.title, label: elem.title } }),
        size: 3,
        icon: <Icons.IconStateMachine className="w-5 h-5 text-gray-500" />,
      },
      ["equipment", "component"].includes(elem.typeElement) && {
        Header: "partes",
        accessor: "partsMasters",
        type: "parts",
        //options: optionsComponents.map((elem) => { return { value: elem.title, label: elem.title } }),
        size: 3,
        icon: <Icons.IconScrewdriverWrench className="w-5 h-5 text-gray-500" />,
      },
      ["equipment"].includes(elem.typeElement) && {
        Header: "consumibles",
        accessor: "consumablesMasters",
        type: "consumables",
        //options: optionsComponents.map((elem) => { return { value: elem.title, label: elem.title } }),
        size: 3,
        icon: <Icons.IconScrewdriverWrench className="w-5 h-5 text-gray-500" />,
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ].filter(elem => elem !== false)
  }
})

