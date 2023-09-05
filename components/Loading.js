import React from "react";

export const Loading = () => {
  return (
    <div className="bg-white font-display fixed top-[132px] md:top-[156px] left-[10px] md:left-[99px] w-[calc(100%-20px)] md:w-[calc(100%-132px)] h-[calc(100%-160px)] md:h-[calc(100%-184px)] z-10 flex flex-col justify-center items-center flex-wrap rounded-lg">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <h2 className="text-center text-gray-300 text-xl font-semibold">
        Un momento, por favor
      </h2>
      {/* <p className="font-display text-center text-gray-500">
      Esto puede tardar unos segundos, no cierre esta página.
      </p> */}
      <style jsx>
        {`
          .loader {
            border-top-color: #6577c9;
            -webkit-animation: spinner 1.5s linear infinite;
            animation: spinner 1.5s linear infinite;
          }

          @-webkit-keyframes spinner {
            0% {
              -webkit-transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
            }
          }

          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

