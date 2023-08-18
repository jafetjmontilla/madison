import { Toast as toastType } from "../../context/ToastContext";
import { FC, useRef, useState } from "react";
import { ToastContextProvider } from "../../context/ToastContext";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const ToastContainer = ({ toasts }: { toasts: toastType[] }) => {
  const nodeRef = useRef(null);
  return (
    <div className="fixed bottom-0 w-full z-[1000]">
      <TransitionGroup
        component="div"
        className={"max-w-xl transition"}
      >
        {toasts.map((toast, idx) => (
          <CSSTransition
            key={idx}
            timeout={1000}
            classNames={"fade"}>
            <div ref={nodeRef}>
              <Toast id={idx} type={toast.type} message={toast.message} />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default ToastContainer;

const Toast: FC<toastType> = ({ message, type, id }) => {
  const { dispatch } = ToastContextProvider();
  const [isVisible, setVisible] = useState(false);
  const types = {
    success: { icon: <IconError />, color: "bg-green-500" },
    error: { icon: <IconError />, color: "bg-red-500" },
    warning: { icon: <IconError />, color: "bg-yellow-500" },
    update: { icon: <IconError />, color: "bg-blue-500" },
  };
  return (
    <div className={`rounded-full ${types[type].color} text-white p-4 m-3 z-50`}>
      <div className="flex">
        <div className="flex-shrink-0">{types[type].icon}</div>
        <div className="ml-3">
          <p className={`text-sm font-medium capitalize`}>
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => {
                dispatch({ type: "DELETE_TOAST", id: id });
              }}
              className={`inline-flex rounded-md p-1.5`}
            >
              <span className="sr-only">Dismiss</span>

              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const IconError = () => {
  return (
    <svg
      className="h-5 w-5 "
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
};
