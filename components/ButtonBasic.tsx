import { FC, HTMLAttributes } from "react"
import { Bars3 } from "../icons"
import { ContainerIcon } from "./ContainerIcon"

interface Props extends HTMLAttributes<HTMLDivElement> {
  caption: string
}

export const ButtonBasic: FC<Props> = (props) => {
  return (
    <>
      <div {...props} className={`w-32 h-10 rounded-lg flex cursor-pointer  border-1 text-white items-center justify-center capitalize ${props.className}`} >
        {props?.caption}
      </div>
    </>
  )
}
