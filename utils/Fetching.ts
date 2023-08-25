import { api } from "../api";

const types = {
  json: "",
  formData: "",
};

interface fetchApiProps {
  query: string;
  variables: object;
  type: keyof typeof types;
}
export const fetchApi: CallableFunction = async ({
  query = ``,
  variables = {},
  type = "json",
}: fetchApiProps): Promise<any> => {
  try {
    if (type === "json") {
      const {
        data: { data },
      } = await api.graphql({ query, variables });
      return Object.values(data)[0];
    } else if (type === "formData") {
      const formData = new FormData();
      const values = Object?.entries(variables);

      // Generar el map del Form Data para las imagenes
      const map = values?.reduce((acc: any, item: any) => {
        if (item[1] instanceof File) {
          acc[item[0]] = [`variables.${item[0]}`];
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              acc[el[0]] = [`variables.${item[0]}.${el[0]}`];
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  acc[elemento[0]] = [
                    `variables.${item[0]}.${el[0]}.${elemento[0]}`,
                  ];
                }
              });
            }
          });
        }
        return acc;
      }, {});

      // Agregar filas al FORM DATA

      formData.append("operations", JSON.stringify({ query, variables }));
      formData.append("map", JSON.stringify(map));
      values.forEach((item) => {
        if (item[1] instanceof File) {
          formData.append(item[0], item[1]);
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              formData.append(el[0], el[1]);
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  formData.append(elemento[0], elemento[1]);
                }
              });
            }
          });
        }
      });

      const { data } = await api.graphql(formData);

      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }

      return Object.values(data.data)[0];
    }
  } catch (error) {
    console.log(error);
  }
};



type queries = {
  fileUpload: string;
  getUploadFiles: string,
  createTasaBCV: String,
  getTasaBCV: String,
  deleteTasaBCV: String,
  getLog: string,
  getProperties: string,
  getSections: string,
  getEquipments: string,
  getEquipmentsMasters: string,
  getReplacementsMasters: string,
  createSections: string,
  createEquipments: string
  createEquipmentsMasters: string
  createReplacementsMasters: string

};

export const queries: queries = {
  fileUpload: `mutation($file:Upload!)
  {
    fileUpload(file:$file){
      _id
      lote
      path
      createdAt
    }
  }`,
  getUploadFiles: `query ( $skip: Int, $limit: Int )
  {
    getUploadFiles(skip:$skip, limit:$limit, ){
      total
      results{
        _id
        lote
        path
        createdAt
      }
    }
  }`,
  createTasaBCV: `mutation($fecha:Date, $tasa:Float)
  {
    createTasaBCV(fecha:$fecha, tasa:$tasa){
      _id
      tasa
      fecha
      createdAt
    }
  }`,
  getTasaBCV: `query ($sort:sortCriteriaTasaBCV, $skip:Int, $limit:Int )
  {
    getTasaBCV(skip:$skip, limit:$limit, sort:$sort ){
      total
      results{
        _id
        tasa
        fecha
        createdAt
      }
    }
  }`,
  deleteTasaBCV: `mutation ($_id:ID )
  {
    deleteTasaBCV(_id:$_id)
  }`,
  getLog: `query ( $skip:Int, $limit:Int, $time:Date )
  {
    getLog( skip:$skip, limit:$limit, time:$time ){
      total
      results{
        sn_onu
        id_servicio
        estado
        estadoValir
        usuario
        smartOlt
        confirmation
        createdAt
      }
    }
  }`,
  getProperties: `query ( $args:inputProperty, $sort:sortCriteriaProperty, $skip:Int, $limit:Int )
  {
    getProperty(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag
        type
        title
        createdAt
        updatedAt
      }
    }
  }`,
  getSections: `query ( $args:inputSection, $sort:sortCriteriaSection, $skip:Int, $limit:Int )
  {
    getSection(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag
        title
        createdAt
        updatedAt
      }
    }
  }`,
  getEquipments: `query ( $args:inputEquipment, $sort:sortCriteriaEquipment, $skip:Int, $limit:Int )
  {
    getEquipment(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag
        title
        createdAt
        updatedAt
      }
    }
  }`,
  getEquipmentsMasters: `query ( $args:inputEquipmentsMaster, $sort:sortCriteriaEquipmentsMaster, $skip:Int, $limit:Int )
  {
    getEquipmentsMaster(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag_cod
        title
        funcion
        horas_servicio_teorico
        fecha_ult_mtto
        marca
        modelo
        ubicacion
        largo
        alto
        ancho
        potencia
        voltaje
        amperaje_a
        corriente
        rpm
        frecuencia
        rodamiento_1
        rodamiento_2
        estopera
        capacidad
        material
        espesor_lamina
        peso_kg
        tipo
        serial
        observaciones
        grasa_lubricante
        createdAt
        updatedAt
      }
    }
  }`,
  getReplacementsMasters: `query ( $args:inputReplacementsMaster, $sort:sortCriteriaReplacementsMaster, $skip:Int, $limit:Int )
  {
    getReplacementsMaster(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        cod
        title
        descripcion
        componente
        tag_cod
        cantidad
        createdAt
        updatedAt
      }
    }
  }`,
  createSections: `mutation ( $args:[inputSection] )
  {
    createSection(args:$args ){
      total
      results{
        _id
        tag
        title
        createdAt
        updatedAt
      }
    }
  }`,
  createEquipments: `mutation ( $args:[inputEquipment] )
  {
    createEquipment(args:$args ){
      total
      results{
        _id
        tag
        title
        createdAt
        updatedAt
      }
    }
  }`,
  createEquipmentsMasters: `query ( $args:[inputEquipmentsMaster] )
  {
    createEquipmentsMaster(args:$args ){
      total
      results{
        _id
        tag_cod
        title
        funcion
        horas_servicio_teorico
        fecha_ult_mtto
        marca
        modelo
        ubicacion
        largo
        alto
        ancho
        potencia
        voltaje
        amperaje_a
        corriente
        rpm
        frecuencia
        rodamiento_1
        rodamiento_2
        estopera
        capacidad
        material
        espesor_lamina
        peso_kg
        tipo
        serial
        observaciones
        grasa_lubricante
        createdAt
        updatedAt
      }
    }
  }`,
  createReplacementsMasters: `query ( $args:[inputReplacementsMaster] )
  {
    createReplacementsMaster(args:$args ){
      total
      results{
        _id
        cod
        title
        descripcion
        componente
        tag_cod
        cantidad
        createdAt
        updatedAt
      }
    }
  }`,
};

