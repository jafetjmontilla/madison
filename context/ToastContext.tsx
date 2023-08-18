import { createContext, FC, useContext, useReducer, Reducer } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

const types = {
  success: "",
  error: "",
  warning: "",
  update: ""
}

export type Toast = {
  id: number
  message: string,
  type: keyof typeof types
}


type Context = {
  toasts: Toast[]
  dispatch: any
}

const initialContext: Context = {
  toasts: [],
  dispatch: () => null,
}

const ToastContext = createContext<Context>(initialContext);

const toastReducer = (state: Toast[], action: any) => {
  switch (action.type) {
    case "ADD_TOAST": {
      return [...state, action.toast]
    }
    case "DELETE_TOAST": {
      const updateToast = state.filter(e => e.id !== action.id)
      return updateToast
    }
    default: {
      throw new Error('unhandled action type');
    }
  }
}

const ToastProvider: FC<any> = ({ children }): JSX.Element => {
  const [toasts, dispatch] = useReducer<Reducer<any, Toast[]>>(toastReducer, []);

  return (
    <ToastContext.Provider value={{ toasts, dispatch }}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

const ToastContextProvider = () => useContext(ToastContext)
export { ToastContextProvider, ToastProvider };