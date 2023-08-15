import Image from "next/image";
import { useMounted } from "../hooks/useMounted";

export default function Home() {
  useMounted()
  return (
    <>
      <div className="flex w-full h-[calc(100%-40px-40px)] md:w-[calc(100%-86px-43px)] md:h-[calc(100%-64px-64px)] z-[5] items-center justify-center absolute *translate-y-[-70px]">
        <Image width={400} height={400} className="w-60 h-60 2xl:w-80 2xl:h-80" alt="4net" src="http://96.126.110.203:5500/madison/logoMadison.png" />
      </div>
      <Image fill sizes="1500" style={{ objectFit: 'cover' }} className="md:full md:h-full" alt="4net" src="http://96.126.110.203:5500/madison/fondo.webp" />

    </>
  )
}
