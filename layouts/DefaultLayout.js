import { LoadingProvider } from "../context/LoadingContext";
import { AppProvider } from "../context/AppContext";
import dynamic from "next/dynamic";

const DynamicAuthProvider = dynamic(() =>
  import("../context/AuthContext").then((mod) => mod.AuthProvider)
);
const DynamicToastProvider = dynamic(() =>
  import("../context/ToastContext").then((mod) => mod.ToastProvider)
);

export const DefaultLayout = ({ children }) => {
  return (
    <>
      <DynamicAuthProvider>
        <AppProvider>
          <LoadingProvider >
            <DynamicToastProvider>
              {children}
            </DynamicToastProvider>
          </LoadingProvider>
        </AppProvider>
      </DynamicAuthProvider>
    </>
  );
};
