import * as Icons from "../icons";
import { BsIntersect } from 'react-icons/bs';

import { queries } from "./Fetching";

import { ImOffice, ImInsertTemplate } from 'react-icons/im';

export const schemaCoordinations = [
  {
    title: "planta",
    cordinator: "coordinador de planta",
    supervitors: ["jefe de turno", "operador de planta"],
    workers: ["molinero", "desgerminador", "ayudante planta", "empaquetador", "ayudante general"]
  },
  {
    title: "siaho",
    cordinator: "coordinador de sihao",
    supervitors: ["coordinador de sihao"],
    workers: ["coordinador de sihao"]
  },
  {
    title: "mantenimiento",
    cordinator: "coordinador de mantenimiento",
    supervitors: ["supervisor de mantenimiento", "supervisor de servicios generales", "planificador"],
    workers: ["electromecánico", "calderista", "planificador", "obrero servicios generales"]
  },
  {
    title: "aseguramiento calidad",
    cordinator: "coordinador de aseguramiento calidad",
    supervitors: ["coordinador de aseguramiento calidad"],
    workers: ["analista de laboratorio", "fumigador"]
  },
  {
    title: "almacen",
    cordinator: "coordinador de sihao",
    supervitors: ["almacenista"],
    workers: ["montacarguista", "ayudante almacen"]
  },
  {
    title: "pcp",
    cordinator: "coordinador de pcp",
    supervitors: ["coordinador de pcp"],
    workers: ["oficial de pcp", "chofer"]
  },
  {
    title: "presupuesto y control",
    cordinator: "coordinador de presupuesto y control",
    supervitors: ["coordinador de presupuesto y control"],
    workers: ["coordinador de presupuesto y control"]
  },
  {
    title: "tesorería",
    cordinator: "coordinador de tesoreria",
    supervitors: ["coordinador de tesoreria"],
    workers: ["empleado contabilidad"]
  },
]
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

export const tagsGroups = schemaCoordinations.reduce((acc, item) => {
  acc.push(item?.cordinator, ...item?.supervitors, ...item?.workers)
  return acc
}, []).filter(onlyUnique).sort()


