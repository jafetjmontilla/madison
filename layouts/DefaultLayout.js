import { LoadingProvider } from "../context/LoadingContext";
import { AppProvider } from "../context/AppContext";
import dynamic from "next/dynamic";
import { AuthProvider } from "../context/AuthContext";

const DynamicToastProvider = dynamic(() =>
  import("../context/ToastContext").then((mod) => mod.ToastProvider)
);

export const DefaultLayout = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <AppProvider>
          <LoadingProvider >
            <DynamicToastProvider>
              {children}
            </DynamicToastProvider>
          </LoadingProvider>
        </AppProvider>
      </AuthProvider>
    </>
  );
};
