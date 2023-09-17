import React from 'react'
import { AppProps } from 'next/app'
import { DefaultLayout } from "../layouts/DefaultLayout";
import ClickAwayListener from "react-click-away-listener";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconMenu } from "../icons";
import { Menu } from "../components/Menu";
import '../styles/index.css'
import { Login } from '../components/Login';
import fondo from "../public/login_background_dark.svg"
import { CSSTransition } from "react-transition-group";
import { AuthContextProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [innerHeight, setInnerHeight] = useState(0)
  const [innerWidth, setInnerWidth] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [valirVerificationDone, setValirVerificationDone] = useState(false)

  useEffect(() => {
    setInnerHeight(window.innerHeight)
    setInnerWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (!showLogin)
      console.log("showLogin", showLogin)
  }, [showLogin])

  useEffect(() => {
    if (valirVerificationDone)
      console.log("valirVerificacionDone", valirVerificationDone)
  }, [valirVerificationDone])

  useEffect((): any => {
    const handleResize = e => {
      setInnerHeight(window.innerHeight)
      setInnerWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return _ => window.removeEventListener('resize', handleResize)
  });

  const transitionLeftOpen = {
    transition: `left 0.4s`,
    left: `0%`,
    height: `${innerHeight}px`
  }
  const transitionLeftClose = {
    transition: "left 0.3s",
    left: `-100%`,
    height: `${innerHeight}px`
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <DefaultLayout>
        <Valir setShowLogin={setShowLogin} setValirVerificationDone={setValirVerificationDone} />
        <CSSTransition in={valirVerificationDone} classNames="fade" unmountOnExit timeout={300} >
          {showLogin ?
            <div className='bg-[#0E356B] flex w-[100vw] h-[100vh]'>
              <CSSTransition in={showLogin} classNames="alert" unmountOnExit timeout={300} >
                <>
                  <Image style={{ objectFit: 'cover' }} height={innerHeight} width={innerWidth} alt="madison" src={fondo} />
                  <Login setShowLogin={setShowLogin} />
                </>
              </CSSTransition>
            </div>
            : <div className="flex">
              <ClickAwayListener onClickAway={() => { setShowMenu(false) }}>
                <div className="flex flex-col w-[80%] absolute z-[15] md:relative md:w-[66px]">
                  <div className="*bg-white absolute md:hidden w-[14%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                    <IconMenu className="w-6 h-6" onClick={() => { setShowMenu(true) }} />
                  </div>
                  <div style={innerWidth < 768 ? showMenu ? transitionLeftOpen : transitionLeftClose : { height: `${innerHeight}px` }} className="bg-gray-200 flex flex-col w-[100%] absolute md:relative  shadow-md">
                    <div className="bg-red-100 h-28 md:h-0 ">
                      <IconArrowLeft className="md:hidden w-6 h-6 mt-2 ml-4" onClick={() => { setShowMenu(false) }} />
                    </div>
                    <Menu setShowMenu={setShowMenu} showMenu={showMenu} />
                  </div>
                </div>
              </ClickAwayListener>
              <div style={{ height: `${innerHeight}px` }} className="flex flex-col w-[100%] md:w-[96%]">
                <div className="bg-gray-50 w-full h-[40px] md:h-[64px] flex">
                  <div className="ml-14 w-[64%] md:w-[88%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                    <Title />
                  </div>
                  <div className="w-[14%] h-10 md:h-16 mx-2 md:mx-6 flex items-center justify-center">
                    <Image width={"400"} height={"400"} className="w-16 h-8 md:w-18 md:h-14" alt="4net" src="http://96.126.110.203:5500/madison/logoMadison.png" />
                  </div>
                </div >
                <div className="w-full h-[calc(100%-40px)] md:h-[calc(100%-64px)]">
                  <Component {...pageProps} />
                </div>
              </div >
            </div >}
        </CSSTransition>
      </DefaultLayout >
      <style jsx global>
        {`
        body {
          overscroll-behavior: contain;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: #a99cbc;
          border-radius: 6px;
          height: 30%;
        }
      `}
      </style>
    </>
  )
}
export default MyApp




import { AppContextProvider } from "../context/AppContext"
import { cloneElement } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';



const Title = () => {
  const { itemSchema, setItemSchema } = AppContextProvider()
  const { user } = AuthContextProvider()

  return (
    <div className=" flex w-full h-full text-gray-600 px-4 items-center md:items-center">
      <div className="w-9 h-9  md:w-12 md:h-12">
        {itemSchema?.icon && cloneElement(itemSchema?.father ? itemSchema?.father?.icon : itemSchema?.icon, { className: "w-full h-full" })}
      </div>
      <div className="flex ml-2 flex-col">
        <span className="uppercase font-bold text-xs md:text-lg mb-[-4px] md:mb-[-8px]">
          {itemSchema?.father
            ? itemSchema?.father?.title?.slice(0, 2) === "{{" ? user?.name : `${itemSchema?.father?.title}`
            : itemSchema?.title?.slice(0, 2) === "{{" ? user?.name : itemSchema?.title}
        </span>
        <span className="text-xs md:text-sm">   Breve descripción</span>
      </div>
    </div>
  )
}

const Valir = ({ setShowLogin, setValirVerificationDone }) => {
  const router = useRouter()
  const { user } = AuthContextProvider()
  const { setItemSchema } = AppContextProvider()
  const { verificationDone } = AuthContextProvider()
  useEffect(() => {
    if (!user?.uid) {
      router.push(`${"/"}`)
      setShowLogin(true)
      setItemSchema({ slug: "/" })
    } else {
      setShowLogin(false)
    }
  }, [user?.uid, verificationDone])

  useEffect(() => {
    setTimeout(() => {
      setValirVerificationDone(true)
    }, 1000);
  }, [verificationDone])


  return (
    <></>
  )
}