
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext"
import { defaultVisibleColumns } from "../utils/schemas"
import { TextField } from "@mui/material";
import { useAllowed } from "../hooks/useAllowed"
import { fetchApi, queries } from "../utils/Fetching";

export const DataTable = ({ data }) => {
  const { setStage, itemSchema, variables, setData, barNav, setBarNav } = AppContextProvider()
  const [isAllowed] = useAllowed()

  const refDataTable = useRef(null)
  const refDivTable = useRef(null)
  const [columns, setColumns] = useState([])
  useEffect(() => {
    if (data?.results?.length > 0) {
      const colummnas = []
      for (const property in data?.results[0]) {
        const key = `${property}`
        const p = variables?.find(elem => elem.tag === key)
        let options = {
          display: defaultVisibleColumns.includes(p?.tag),
          filter: true,
          sort: true,
          customToolbarSelect: selectedRows => (
            <div
              selectedRows={selectedRows}
              onRowsDelete={this.deleteUsers}
            />
          ),
          setCellProps: (value) => {
            return {
              style: {
                fontSize: '12px',
                padding: "0px",
                textTransform: "uppercase",
              },
            };
          },
          setCellHeaderProps: (value) => {
            return {
              style: {
                padding: "0px",
                textTransform: "uppercase",
              },
            };
          }
        }
        if (p?.type == "arraystring") {

          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.map((elem, idx) => <li key={idx}>{elem}</li>)}</p>
            )
          }
          options = { ...options, customBodyRender }
        }
        if (p?.type == "object") {
          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.title}</p>
            )
          }
          options = { ...options, customBodyRender }
        }
        if (p?.type == "arrayobject") {
          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.length > 0 && value?.map((elem, idx) => <li key={idx}>{elem?.title ? elem?.title : ""}</li>)}</p>
            )
          }
          options = { ...options, customBodyRender }
        }
        colummnas.push({
          name: `${p?.tag}`,
          label: `${p?.title}`,
          options
        },)
      }
      setColumns(colummnas)
    }
  }, [data])


  const handleonRowClick = async (values, dataIndex) => {
    if (values?.typeElement) {
      const result = await fetchApi({
        query: queries.getElements,
        variables: {
          args: {
            _id: values?._id
          },
          sort: {},
          limit: 0,
          skip: 0,
        },
        type: "json"
      })
      console.log(100025, result)
      setData(old => {
        const f1 = old.results.findIndex(elem => elem._id === values?._id)
        old.results.splice(f1, 1, result?.results[0])
        return { ...old }
      })
      if (isAllowed("actualizar")) {
        setStage({ action: "creaAndEdit", payload: result?.results[0], dataIndex })
        barNav.push(`${result.results[0]?.title}`)
        setBarNav([...barNav])
      }
      return
    }
    isAllowed("actualizar") && setStage({ action: "creaAndEdit", payload: values, dataIndex })
  }

  const options = {
    filter: false,
    filterType: 'checkbox',
    selectableRows: "single",
    selectableRowsHideCheckboxes: false,
    selectableRowsOnClick: false,
    selectToolbarPlacement: "replace",
    rowsPerPage: 100,
    rowsPerPageOptions: [25, 50, 100, 200],
    sort: true,
    sortOrder: {
      name: 'name',
      direction: 'asc'
    },

    responsive: "standard",
    //tableBodyHeight: "400px",
    //tableBodyMaxHeight: "400px",
    onRowClick: (_, rowMeta) => {
      handleonRowClick(data.results[rowMeta.dataIndex], rowMeta.dataIndex)
    },
    // customRowRender: (data, dataIndex, rowIndex) => {
    //   console.log(data)
    //   return <>algo</>

    // },
    // onRowSelectionChange: (array, asd, dr) => {

    //   handleonRowSelectionChange(data.results[array[0].index])
    // },

    //onCellClick: (colData, cellMeta) => { console.log(20003, colData, cellMeta) },

    //isRowSelectable: (dataIndex, selectedRows, data) => { console.log("algo") }

    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        //padding: "0px 16px",
        height: "0px",
      };
    },
    setTableProps: () => {
      return {
        className: "border-t-2 ",
        // style: {
        //   border: '3px solid blue',
        // },
        //        padding: this.state.denseTable ? 'none' : 'default',

        // material ui v4 only
        //      size: this.state.denseTable ? 'small' : 'medium',
      };
    },
  };

  // useEffect(() => {
  //   if (refDivTable) {
  //     console.log(555, refDivTable.current.clientHeight)
  //   }
  //   if (refDataTable) {
  //     console.log(556, refDataTable.current.getTableContentRef())
  //     console.log(557, refDataTable.current.getTableContentRef().clientHeight)
  //   }
  // }, [])
  return (

    <div ref={refDivTable} className={``} >
      {itemSchema?.getData &&
        <MUIDataTable
          ref={refDataTable}
          // title={<span className={"uppercase font-bold text-gray-700"}>{`${itemSchema?.title}`}</span>}
          data={data?.results}
          columns={columns}
          options={options}
          className={"*h-[80%] overflow-auto"}
        />}
    </div>
  );
};

