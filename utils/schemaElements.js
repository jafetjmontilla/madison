import * as Icons from "../icons";
import { BsShieldLockFill, BsIntersect } from 'react-icons/bs';
import { RiShieldUserLine } from 'react-icons/ri';
import { HiUserGroup, HiUserCircle } from 'react-icons/hi';
import { VscGroupByRefType } from 'react-icons/vsc';
import { AiFillSetting } from 'react-icons/ai';
import { GrCodeSandbox } from 'react-icons/gr';
import { FiLogOut } from 'react-icons/fi';
import { queries } from "./Fetching";
import { MdOutlineManageAccounts, MdOutlineCleaningServices } from 'react-icons/md';
import { PiPassword } from 'react-icons/pi';
import { FaTasks } from 'react-icons/fa';
import { TbChartInfographic, TbReportSearch } from 'react-icons/tb';
import { BiTask } from 'react-icons/bi';
import { LiaMedalSolid } from 'react-icons/lia';
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
    groups: ["admin"],
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
        required: true,
        size: 2
      },
      {
        Header: "id",
        accessor: "_id",
        type: "id",
      }
    ]
  }
})

