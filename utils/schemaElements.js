import * as Icons from "../icons";
import { BsIntersect } from 'react-icons/bs';

import { queries } from "./Fetching";

import { ImOffice, ImInsertTemplate } from 'react-icons/im';

const schemaElement = [
  {
    title: "empresa",
    typeElement: "company",
    children: ["section", "area", "part"],
    icon: <ImOffice className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "secciones",
    typeElement: "section",
    father: ["company"],
    children: ["area", "section", "equipment", "part"],
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
    children: ["equipmen", "component", "part"],
    icon: <Icons.IconEquipment className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "componentes",
    typeElement: "component",
    father: ["equipment", "component"],
    children: ["component", "part"],
    icon: <Icons.IconStateMachine className="w-8 h-8 text-gray-500" />,
  },
  {
    title: "partes",
    typeElement: "part",
    father: ["company", "section", "area", "equipment", "component"],
    icon: <Icons.IconScrewdriverWrench className="w-8 h-8 text-gray-500" />,
  },
]

export const elements = schemaElement.map(elem => {
  return {
    icon: elem.icon,
    title: elem.title,
    groups: ["admin", "coordinador de mantenimiento", "supervisor de mantenimiento", "supervisor de limpieza"],
    slug: `/setup/${elem.typeElement}`,
    dataVariables: { typeElement: elem.typeElement },
    getData: queries.getElements,
    createEntry: queries.createElements,
    updateEntry: queries.updateElements,
    deleteEntry: queries.deleteElements,
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
      {
        Header: "propiedades",
        accessor: "properties",
        type: "properties",
        options: elem?.father?.map(elem => {
          return {
            value: elem,
            label: `${schemaElement.find(el => el.typeElement === elem)?.title
              }`
          }
        }),
        size: 3
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  }
})

