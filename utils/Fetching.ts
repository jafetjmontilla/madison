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
  auth: string
  authStatus: string
  fileUpload: string;
  getUploadFiles: string,
  createTasaBCV: String,
  getTasaBCV: String,
  deleteTasaBCV: String,
  getLog: string,
  getVariables: string,
  getProperties: string,
  getSections: string,
  getEquipments: string,
  getEquipmentsMasters: string,
  getReplacementsMasters: string,
  getUser: string
  createUsers: string,
  updateUser: string
  createVariables: string,
  getPermissions: string,
  createPermissions: string,
  updatePermissions: string,
  getGroups: string,
  createGroups: string
  updateGroups: string
  createProperties: string,
  updateProperties: string,
  createSections: string,
  createEquipments: string
  createEquipmentsMasters: string
  createReplacementsMasters: string
  updateVariable: string,
  getUserPermissions: string
  createElements: string
  getElements: string
  updateElements: string
  deleteElements: string
};

export const queries: queries = {
  auth: `mutation ($idToken : String){
    auth(idToken: $idToken){
      sessionCookie
    }
  }`,
  authStatus: `mutation ($sessionCookie : String){
        status(sessionCookie: $sessionCookie){
          customToken
        }
      }`,
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
        {sn_onu
        id_servicio
        estado
        estadoValir
        usuario
        smartOlt
        confirmation
        createdAt}
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
  getVariables: `query ( $args:inputVariable, $sort:sortCriteriaVariable, $skip:Int, $limit:Int )
  {
    getVariable(args:$args, sort:$sort, skip:$skip, limit:$limit ){
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
  getUserPermissions: `query ( $args:[String] )
  {
    getUserPermissions(args:$args ){
     group
     permissions
    }
  }`,
  getUser: `query ( $args:inputUser, $sort:sortCriteriaUser, $skip:Int, $limit:Int ) 
  {
    getUser(args:$args, sort:$sort, skip:$skip, limit:$limit){
      total
      results{
        _id
        uid
        name
        email
        position
        phone
        groups{
          _id
          tag
          title
          permissions{
            _id
            title
          }
        }
        status
        createdAt
        updatedAt
      }
    }
  }`,
  createUsers: `mutation ( $args:[inputUser] )
  {
    createUser(args:$args ){
     total
      results{
        _id
        uid
        name
        position
        email
        phone
        groups{
          _id
          tag
          title
        }
        createdAt
        updatedAt
      }
    }
  }`,
  updateUser: `mutation ( $args:inputUser )
  {
    updateUser( args:$args ){
      _id
      uid
      name
      position
      email
      phone
      groups{
        _id
        tag
        title
      }
      createdAt
      updatedAt
    }
  }`,
  createVariables: `mutation ( $args:[inputVariable] )
  {
    createVariable(args:$args ){
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
  getPermissions: `query ( $args:inputPermission, $sort:sortCriteriaPermission, $skip:Int, $limit:Int )
  {
    getPermission(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        title
        createdAt
        updatedAt
      }
    }
  }`,
  createPermissions: `mutation ( $args:[inputPermission] )
  {
    createPermission(args:$args ){
      total
      results{
        _id
        title
        createdAt
        updatedAt
      }
    }
  }`,
  updatePermissions: `mutation ( $args:inputPermission )
  {
    updatePermission(args:$args ){
      _id
      title
      createdAt
      updatedAt
    }
  }`,
  getGroups: `query ( $args:inputGroup, $sort:sortCriteriaGroup, $skip:Int, $limit:Int )
  {
    getGroup(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag
        title
        permissions{
          _id
          title
        }
        createdAt
        updatedAt
      }
    }
  }`,
  createGroups: `mutation ( $args:[inputGroup] )
  {
    createGroup(args:$args ){
      total
      results{
        _id
        tag
        title
        permissions{
          _id
          title
        }
        createdAt
        updatedAt
      }
    }
  }`,
  updateGroups: `mutation ( $args:inputGroup )
  {
    updateGroup(args:$args ){
      _id
      tag
      title
      permissions{
        _id
        title
      }
      createdAt
      updatedAt
    }
  }`,
  createProperties: `mutation ( $args:[inputProperty] )
  {
    createProperty(args:$args ){
      total
      results{
          _id
          execution
          medition
          coordination
          title
          description
          periodic
          unique{
            date
            time
          }
          executor
        }
      }
    }`,
  updateProperties: `mutation ( $args:inputProperty )
  {
    updateProperty(args:$args ){
        _id
        execution
        medition
        coordination
        title
        description
        periodic
        unique{
          date
          time
        }
        executor
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
  createEquipmentsMasters: `mutation ( $args:[inputEquipmentsMaster] )
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
  createReplacementsMasters: `mutation ( $args:[inputReplacementsMaster] )
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
  updateVariable: `mutation ( $args:inputVariable )
  {
    updateVariable( args:$args ){
      _id
      tag
      title
      createdAt
      updatedAt
    }
  }`,
  createElements: `mutation ( $args:[inputElement] )
  {
    createElement(args:$args ){
      total
      results{
        _id
        tag
        title
        father{
          _id
          tag
          title
          typeElement
        }
        createdAt
        updatedAt
      }
    }
  }`,
  getElements: `query ( $args:inputElement, $sort:sortCriteriaElement, $skip:Int, $limit:Int )
  {
    getElement(args:$args, sort:$sort, skip:$skip, limit:$limit ){
      total
      results{
        _id
        tag
        father{
          _id
          tag
          title
          typeElement
        }
        title
        properties{
          _id
          execution
          medition
          coordination
          title
          description
          periodic
          unique{
            date
            time
          }
          executor
        }
        createdAt
        updatedAt
      }
    }
  }`,
  updateElements: `mutation ( $args:inputElement )
  {
    updateElement( args:$args ){
      _id
      tag
      title
      father{
        _id
        tag
        title
        typeElement
      }
      createdAt
      updatedAt
    }
  }`,
  deleteElements: `mutation ( $args:inputElemnt )
  {
    updateElemnt( args:$args ){
      _id
      tag
      title
      permissions
      createdAt
      updatedAt
    }
  }`,
};

