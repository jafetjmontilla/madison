
import { useEffect, useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useMounted } from "../hooks/useMounted";


export const DataTable = () => {
  useMounted()
  const refDataTable = useRef(null)
  const refDivTable = useRef(null)

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell className="m-0 p-0 " align="center">
        //       Last Modified
        //       {/* <TableSortLabel onClick={handleToggleColumn}> Last Modified </TableSortLabel> */}
        //     </TableCell>
        //   );
        // },
        setCellProps: (value) => {
          return {
            style: {
              // borderRight: '2px solid blue',
              textDecoration: 'underline',
              fontSize: '12px',
              padding: "0px",
              //margin: "0px",
              //      height: "0px"
            },
          };
        },
        setCellHeaderProps: (value) => {
          return {
            className: "p-0 md:p-0",
            // style: {
            //   borderRight: '2px solid blue',
            //   textDecoration: 'underline',
            //   fontSize: '10px',
            //   padding: "0px",
            //   //margin: "0px",
            //   //      height: "0px"
            // },
          };
        }
      }
    },
    {
      name: "name1",
      label: "Name1",
      options: {
        filter: true,
        sort: true,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell className="m-0 p-0 " align="center">
        //       Last Modified
        //       {/* <TableSortLabel onClick={handleToggleColumn}> Last Modified </TableSortLabel> */}
        //     </TableCell>
        //   );
        // },
        setCellProps: (value) => {
          return {
            style: {
              // borderRight: '2px solid blue',
              textDecoration: 'underline',
              fontSize: '12px',
              padding: "0px",
              //margin: "0px",
              //      height: "0px"
            },
          };
        },
        setCellHeaderProps: (value) => {
          return {
            className: "p-0 md:p-0",
            // style: {
            //   borderRight: '2px solid blue',
            //   textDecoration: 'underline',
            //   fontSize: '10px',
            //   padding: "0px",
            //   //margin: "0px",
            //   //      height: "0px"
            // },
          };
        }
      }
    },
    {
      name: "name2",
      label: "Name2",
      options: {
        filter: true,
        sort: true,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell className="m-0 p-0 " align="center">
        //       Last Modified
        //       {/* <TableSortLabel onClick={handleToggleColumn}> Last Modified </TableSortLabel> */}
        //     </TableCell>
        //   );
        // },
        setCellProps: (value) => {
          return {
            style: {
              // borderRight: '2px solid blue',
              textDecoration: 'underline',
              fontSize: '12px',
              padding: "0px",
              //margin: "0px",
              //      height: "0px"
            },
          };
        },
        setCellHeaderProps: (value) => {
          return {
            className: "p-0 md:p-0",
            // style: {
            //   borderRight: '2px solid blue',
            //   textDecoration: 'underline',
            //   fontSize: '10px',
            //   padding: "0px",
            //   //margin: "0px",
            //   //      height: "0px"
            // },
          };
        }
      }
    },
    {
      name: "name3",
      label: "Name3",
      options: {
        filter: true,
        sort: true,
        // customHeadRender: (columnMeta, handleToggleColumn, sortOrder) => {
        //   return (
        //     <TableCell className="m-0 p-0 " align="center">
        //       Last Modified
        //       {/* <TableSortLabel onClick={handleToggleColumn}> Last Modified </TableSortLabel> */}
        //     </TableCell>
        //   );
        // },
        setCellProps: (value) => {
          return {
            style: {
              // borderRight: '2px solid blue',
              textDecoration: 'underline',
              fontSize: '12px',
              padding: "0px",
              //margin: "0px",
              //      height: "0px"
            },
          };
        },
        setCellHeaderProps: (value) => {
          return {
            className: "p-0 md:p-0",
            // style: {
            //   borderRight: '2px solid blue',
            //   textDecoration: 'underline',
            //   fontSize: '10px',
            //   padding: "0px",
            //   //margin: "0px",
            //   //      height: "0px"
            // },
          };
        }
      }
    },
  ];


  const data = [
    { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" },
    { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" }, { name: "Joe James", name1: "Joe James", name2: "Joe James", name3: "Joe James" },
  ];

  const options = {
    filter: false,
    filterType: 'checkbox',
    selectableRows: "single",
    selectableRowsHideCheckboxes: false,
    selectableRowsOnClick: true,
    selectToolbarPlacement: "replace",
    sort: true,
    sortOrder: {
      name: 'name',
      direction: 'asc'
    },
    responsive: "standard",
    //tableBodyHeight: "400px",
    //tableBodyMaxHeight: "400px",




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

  useEffect(() => {
    if (refDivTable) {
      console.log(555, refDivTable.current.clientHeight)
    }
    if (refDataTable) {
      console.log(556, refDataTable.current.getTableContentRef())
      console.log(557, refDataTable.current.getTableContentRef().clientHeight)
    }
  }, [])


  return (

    <div ref={refDivTable} className="">
      <MUIDataTable
        ref={refDataTable}
        title={"Employee List"}
        data={data}
        columns={columns}
        options={options}
        className={"*h-[80%] overflow-auto"}
      />
    </div>
  );
};

