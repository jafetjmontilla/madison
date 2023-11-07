import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { LoadingContextProvider } from "../context/LoadingContext"
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { schemaElement } from "../utils/schemaElements.js"
import { fetchApi, queries } from "../utils/Fetching";
import { Button } from "@mui/material";
import { BsCheck2Circle } from "react-icons/bs"
import { GiBookPile, GiBackwardTime } from "react-icons/gi"




let i = 0
const chil = (schemaElement, elem, cont) => {
  i++
  return schemaElement.find(el => el.typeElement === elem)?.children?.map(elem => {
    const asd = ["equipment", "component"]
    asd.includes(elem) && cont++
    return {
      id: `${i}${cont}${elem}`,
      name: elem,
      children: cont < (elem === "equipment" ? 2 : 4) && chil(schemaElement, elem, cont)
    }
  })
}

const items = Object.values(schemaElement)
const data = {
  id: items[0].title,
  name: items[0].title,
  children: items[0].children.map(elem => {
    return {
      id: `${items[0].title}${elem}`,
      name: elem,
      children: chil(schemaElement, elem, 0)
    }
  })
}




const Structure = () => {
  const { loading, setLoading } = LoadingContextProvider()
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState({ index: [], data: { id: "", name: "" } })
  const [expanded, setExpanded] = useState([]);
  const [showView, setShowView] = useState({ state: false, payload: {} })
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      if (isMounted) {
        //setLoading(false)
      }
    }
  }, [isMounted])

  useEffect(() => {
    if (isMounted) {
      fetchApi({
        query: queries.getElements,
        variables: {
          args: {
            typeElement: ["company", "section"]
          },
        },
        type: "json"
      }).then(result => {
        const company = result.results.find(elem => elem.typeElement === "company")
        const sections = result.results.filter(elem => elem.typeElement === "section")
        const data = {
          id: company._id,
          name: `${company.title}`,
          tag: company.tag,
          typeElement: company.typeElement,
          element: company,
          children: sections?.map((elem, idx) => {
            return {
              id: elem._id,
              name: ` ${elem.title}`,
              tag: elem.tag,
              typeElement: elem.typeElement,
              element: elem,
              children: [
                { id: `${idx}`, name: "...cargando" }
              ],
              ancestry: [company._id, elem._id,]
            }
          })
        }
        setData({ index: [data?.id], data })
      })
    }
  }, [isMounted])


  const router = useRouter()
  useEffect(() => {
    setLoading(false)
  }, [router.asPath])

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ['1', '5', '6', '7'] : ['6518fb34f9d047a36e8586c1'],
    );
  };

  const handleClickView = (e, node) => {
    e.stopPropagation();
    setShowView({ state: true, payload: node })
  }

  const handleExpanded = ({ id, ancestry }) => {
    if (!data.index.includes(id)) {
      fetchApi({
        query: queries.getElements,
        variables: {
          args: {
            father: id
          },
        },
        type: "json"
      }).then(result => {
        const f1 = data.data.children.findIndex(elem => elem.id === ancestry[1])
        const children = result.results.map((elem, idx) => {
          return {
            id: elem._id,
            name: ` ${elem.title}`,
            tag: elem.tag,
            typeElement: elem.typeElement,
            element: elem,
            children: [
              { id: `${idx}`, name: "...cargando" }
            ],
            ancestry: [...ancestry, elem._id]
          }
        })
        if (ancestry.length == 2) {
          data.data.children[f1].children = children
        }
        if (ancestry.length == 3) {
          const f2 = data.data.children[f1].children.findIndex(elem => elem.id === ancestry[2])
          data.data.children[f1].children[f2].children = children
        }
        if (ancestry.length == 4) {
          const f2 = data.data.children[f1].children.findIndex(elem => elem.id === ancestry[2])
          const f3 = data.data.children[f1].children[f2].children.findIndex(elem => elem.id === ancestry[3])
          data.data.children[f1].children[f2].children[f3].children = children
        }
        if (ancestry.length == 5) {
          const f2 = data.data.children[f1].children.findIndex(elem => elem.id === ancestry[2])
          const f3 = data.data.children[f1].children[f2].children.findIndex(elem => elem.id === ancestry[3])
          const f4 = data.data.children[f1].children[f2].children[f3].children.findIndex(elem => elem.id === ancestry[4])
          data.data.children[f1].children[f2].children[f3].children[f4].children = children
        }
        data.index.push(id)
        setData({ ...data })
      })
    }
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      onClick={() => handleExpanded(nodes)}
      label={
        <div className="flex items-center gap-2 text-sm">
          <BsCheck2Circle onClick={(e) => handleClickView(e, nodes)} className="w-4 h-4 text-gray-800 hover:scale-125" />
          <span className="uppercase font-semibold text-gray-800">{nodes.tag}</span>
          <span className="capitalize font-normal">{nodes.name}</span>
        </div>
      }>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <>
      {
        showView.state &&
        <div className="bg-gray-800 bg-opacity-50 flex items-center justify-center w-full md:w-[calc(100%-64px)] h-[calc(100%-40px)] md:h-[calc(100%-64px)] absolute z-10 bottom-0 right-0">
          <div className="bg-white w-full h-[100%] md:w-[800px] md:h-[90%] rounded-lg shadow-lg truncate text-sm">
            <div className="bg-gray-300 flex w-[100%] h-20 relative">
              <div className="w-[85%] h-[100%] flex justify-start items-center">
                <span className="ml-4 text-xl uppercase font-semibold text-gray-700 ">
                  {showView?.payload?.tag}
                </span>
                <span className="ml-4 text-xl uppercase text-gray-700 truncate ">
                  {showView?.payload?.name}
                </span>
              </div>
              <div className="w-[15%] h-[100%] flex justify-end">
                <span className="hidden md:flex mr-5 mt-3 text-2xl text-gray-500 cursor-pointer hover:scale-110" onClick={() => setShowView({ state: false })}>X</span>
              </div>
              <span className="bg-gray-100 rounded-md border-2 w-[190px] absolute top-[74px] right-0 scale-[65%] md:scale-75 translate-x-6 text-gray-500 py-[7px] pr-3" >{showView?.payload?.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 pt-4">
              <div className="flex flex-col col-span-3">
                <label className="uppercase text-xs pt-[6px] pb-[2px]">parte de</label>
                <span className="w-full border-[1px] border-gray-300 rounded-md py-2 px-3 uppercase">{`${showView?.payload?.element?.father?.tag} ${showView?.payload?.element?.father?.title}`}</span>
              </div>
              <div className="flex flex-col col-span-3 pb-2">
                <label className="uppercase text-xs pt-[6px] pb-[2px]">propiedades</label>
                <div className="w-full">
                  <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 py-1">
                    <span className="col-span-4">Nombre</span>
                    <span className="col-span-2">ejecución</span>
                    <span className="col-span-2">intérvalo</span>
                    <span className="col-span-2">medición</span>
                    <span className="col-span-2">coordinación</span>
                  </div>
                  {showView?.payload?.element?.properties?.map((elem, idx) => {
                    return (
                      <div key={idx} className="w-full">
                        < div className={`w-full  text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
                          <div className="col-span-4 gap-2 flex items-center">
                            <GiBackwardTime className="w-5 h-5" />
                            <span className="truncate">{elem?.title}</span>
                          </div>
                          <span className="col-span-2 truncate">{elem?.execution}</span>
                          <span className="col-span-2 truncate">{elem?.periodic}</span>
                          <span className="col-span-2 truncate">{elem?.medition}</span>
                          <span className="col-span-2 truncate">{elem?.coordination}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col col-span-3 pb-2">
                <label className="uppercase text-xs pt-[6px] pb-[2px]">características</label>
                <div className="w-full">
                  <div className="w-full text-gray-700 capitalize grid grid-cols-12 items-center text-left font-semibold border-b-2 py-1">
                    <span className="col-span-2">Nombre</span>
                    <span className="col-span-7">Descripción</span>
                    <span className="col-span-3">coordinación</span>
                  </div>
                  {showView?.payload?.element?.characteristics?.map((elem, idx) => {
                    return (
                      <div key={idx} className="w-full">
                        < div className={`w-full  text-gray-700 uppercase grid grid-cols-12 gap-4 items-center py-1`}>
                          <div className="col-span-2 gap-2 flex items-center">
                            <GiBookPile className="w-5 h-5" />
                            <span className="truncate">{elem?.title}</span>
                          </div>
                          <span className="col-span-7 truncate">{elem?.description}</span>
                          <span className="col-span-3 truncate">{elem?.coordination}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="bg-[#0E356B] stick flex w-full h-full items-center justify-center">
        <div className="bg-[#0E356B] w-full h-full flex items-center justify-center relative">
          <div className="flex flex-col relative h-[100%] w-[95%]">
            <div className="bg-gray-100 rounded-lg w-[100%] h-[calc(100%-120px)] overflow-auto mt-[92px] flex flex-col">
              <Box sx={{ mt: 2, mb: 1, ml: 3 }}>
                <Button onClick={handleExpandClick}>
                  {'Contraer'}
                </Button>

              </Box>
              <div className="border-[1px] border-gray-300 rounded-xl w-[95%] h-[90%] overflow-auto mx-auto py-2">
                <TreeView
                  aria-label="rich object"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={['root']}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  onNodeToggle={handleToggle}
                >
                  {renderTree(data.data)}
                </TreeView>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default Structure
