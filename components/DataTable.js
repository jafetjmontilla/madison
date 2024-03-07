
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext"
import { defaultVisibleColumns } from "../utils/schemas"
import { TextField } from "@mui/material";
import { useAllowed } from "../hooks/useAllowed"
import { fetchApi, queries } from "../utils/Fetching";

export const DataTable = ({ data }) => {
  const { setStage, itemSchema, variables, setData, barNav, setBarNav } = AppContextProvider()
  const [isAllowed] = useAllowed()
  const [searchText, setSearchText] = useState("")
  const refDataTable = useRef(null)
  const refDivTable = useRef(null)
  const [columns, setColumns] = useState([])

  const getMuiTheme = () => createTheme({
    components: {
      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: "40px" + '!important'
          }
        }
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontSize: "13px" + '!important',
            fontWeight: "bold" + '!important'
          }
        }
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            backgroundColor: "#00000"
          }
        }
      },
      MuiFormGroup: {
        styleOverrides: {
          root: {
            padding: "5px 16px 2px 16px",
            textTransform: "capitalize",
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
          },
          caption: {
            padding: "5px 0px 0px 10px",
            textTransform: "capitalize",
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: 12,
          }
        }
      }
    }
  })


  useEffect(() => {
    const except = [
      // los excluye
      ["/setup/component", "/setup/part"].includes(itemSchema?.slug) && "father",
      ["/setup/component", "/setup/part"].includes(itemSchema?.slug) && "tag",
      ["/setup/company", "/setup/part"].includes(itemSchema?.slug) && "father",
      //los incluye 
      !["/setup/component", "/setup/part"].includes(itemSchema?.slug) && "tipo",
      !["/setup/part"].includes(itemSchema?.slug) && "codigo"
    ]
    const visibleColumns = defaultVisibleColumns.filter(elem => !except.includes(elem))

    if (data?.results?.length > 0) {
      const columns = []
      for (const property in data?.results[0]) {
        const key = `${property}`
        const p = variables?.find(elem => elem.tag === key)
        let optionsColumns = {
          display: visibleColumns.includes(p?.tag),
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
                padding: "5px 16px 2px 16px",
                textTransform: "uppercase",
              },
            };
          },
          setCellHeaderProps: (value) => {
            return {
              style: {
                padding: "0px 16px 0px 16px",
                textTransform: "uppercase",
              },
            };
          },
        }
        if (p?.type == "arraystring") {

          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.map((elem, idx) => <li key={idx}>{elem}</li>)}</p>
            )
          }
          optionsColumns = { ...optionsColumns, customBodyRender }
        }
        if (p?.type == "object") {
          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.title}</p>
            )
          }
          optionsColumns = { ...optionsColumns, customBodyRender }
        }
        if (p?.type == "arrayobject") {
          const customBodyRender = (value) => {
            return (
              <p className="uppercase">{value?.length > 0 && value?.map((elem, idx) => <li key={idx}>{elem?.title ? elem?.title : ""}</li>)}</p>
            )
          }
          optionsColumns = { ...optionsColumns, customBodyRender }
        }
        columns.push({
          name: `${p?.tag}`,
          label: `${p?.title}`,
          options: optionsColumns
        },)
      }
      setColumns(columns)
    }
    setSearchText("")
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
    selectableRowsHideCheckboxes: true,
    //selectableRowsOnClick: false,
    selectToolbarPlacement: "replace",
    rowsPerPage: 100,
    rowsPerPageOptions: [25, 50, 100, 200],
    sort: true,
    sortOrder: {
      name: 'name',
      direction: 'asc'
    },
    searchAlwaysOpen: true,
    searchText: searchText,
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
    textLabels: {
      body: {
        noMatch: "No hay registros",
        toolTip: "Ordenar",
        // columnHeaderTooltip: column => `Sort for ${column.label}`
      },
      pagination: {
        next: "Siguiente página",
        previous: "Página anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Download CSV",
        print: "Imprimir",
        viewColumns: "Columnas",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Columnas visibles",
        titleAria: "Show/Hide Table Columns",
      },
      selectedRows: {
        text: "row(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    }
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

    <div ref={refDivTable} className={`overflow-x-hidden`} >
      {itemSchema?.getData &&
        <ThemeProvider theme={getMuiTheme()} >
          <MUIDataTable
            ref={refDataTable}
            // title={<span className={"uppercase font-bold text-gray-700"}>{`${itemSchema?.title}`}</span>}
            data={data?.results}
            columns={columns}
            options={options}
            className={"*h-[80%] overflow-auto"}
          />
        </ThemeProvider>
      }
    </div>
  );
};

