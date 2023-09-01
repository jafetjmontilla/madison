
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useMounted } from "../hooks/useMounted";
import { LoadingContextProvider } from "../context/LoadingContext";
import { AppContextProvider } from "../context/AppContext"
import { defaultVisibleColumns } from "../utils/schemas"


export const DataTable = ({ data, setData }) => {
  const { setLoading, } = LoadingContextProvider()
  const { setStage, itemSchema, properties } = AppContextProvider()

  // useMounted()

  const refDataTable = useRef(null)
  const refDivTable = useRef(null)
  const [columns, setColumns] = useState([])



  useEffect(() => {
    if (data?.results?.length > 0) {
      const c = []
      for (const property in data?.results[0]) {
        const k = `${property}`
        const p = properties?.filter(elem => elem.tag === k)[0]
        c.push({
          name: `${p?.tag}`,
          label: `${p?.title}`,
          options: {
            display: defaultVisibleColumns.includes(p?.tag),
            filter: true,
            sort: true,
            setCellProps: (value) => {
              return {
                style: {
                  fontSize: '12px',
                  padding: "0px",
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
        },)
      }
      setColumns(c)
      //setLoading(false)
    }
  }, [data])


  const handleonRowClick = (values, dataIndex) => {
    setStage({ action: "creaAndEdit", payload: values, dataIndex })
  }

  const options = {
    filter: false,
    filterType: 'checkbox',
    selectableRows: "single",
    selectableRowsHideCheckboxes: false,
    selectableRowsOnClick: false,
    selectToolbarPlacement: "replace",
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

