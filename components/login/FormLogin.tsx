import { Formik, Form, ErrorMessage } from "formik";
import { FC, useState } from "react";
import { EmailIcon, Eye, EyeSlash, LockClosed } from "../../icons";
import { InputField } from "../InputFieldIcons";
import { ButtonComponent } from "../ButtonComponent";
import { useToast } from "../../hooks/useToast";
import { useAuthentication } from "../../utils/Authentication";
import { AppContextProvider } from "../../context/AppContext";

type MyFormValues = {
  identifier: string;
  password: any;
  wrong: any;
};

const FormLogin: FC<any> = () => {
  const { stage, setStage } = AppContextProvider()
  const { signIn, resetPassword } = useAuthentication();
  const [passwordView, setPasswordView] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  //const { signIn } = useAuthentication();
  const toast = useToast()
  const initialValues: MyFormValues = {
    identifier: "",
    password: "",
    wrong: "",
  };

  const errorsCode: any = {
    "auth/wrong-password": "Correo o contraseña invalida",
    "auth/too-many-requests":
      "Demasiados intentos fallidos. Intenta de nuevo más tarde",
  };

  const handleSubmit = async (values: MyFormValues, actions: any) => {
    try {
      if (showResetPassword) {
        resetPassword(values, setShowResetPassword)
        return
      }
      signIn("credentials", values)

    } catch (error: any) {
      console.error(JSON.stringify(error));
      toast("error", JSON.stringify(errorsCode[error.code]))
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className=" text-gray-200 flex flex-col gap-2 py-3 w-full *md:w-3/4">
        <span className="w-full relative ">
          <InputField
            label={"Correo electronico"}
            name="identifier"
            // placeholder="ingrese correo electrónico"
            icon={<EmailIcon className="absolute w-4 h-4 inset-y-0 left-4 m-auto text-gray-500" />}
            type="email"
          />

        </span>

        {!showResetPassword
          ? <span className="w-full relative ">
            <InputField
              name="password"
              type={!passwordView ? "password" : "text"}
              autoComplete="off"
              icon={<LockClosed className="absolute w-4 h-4 inset-y-0 left-4 m-auto  text-gray-500" />}
              label={"Contraseña"}
            />
            <div onClick={() => { setPasswordView(!passwordView) }} className="absolute cursor-pointer inset-y-0 top-5 right-4 m-auto w-4 h-4 text-gray-500" >
              {!passwordView ? <Eye /> : <EyeSlash />}
            </div>
          </span>
          : <span className="text-gray-600 h-[58px]">
            Introduce tu email para resetear la contraseña.
          </span>}
        <span className="text-sm text-red">
          <ErrorMessage name="wrong" />
        </span>
        <div onClick={() => setShowResetPassword(!showResetPassword)} className="text-sm text-primary w-full text-left hover:font-semibold transition cursor-pointer">
          {!showResetPassword ? "Olvidé mi contraseña" : "Iniciar sesión"}
        </div>
        <ButtonComponent
          onClick={() => { }}
          type="submit"
          tabIndex={0}
        >
          {!showResetPassword ? "Iniciar sesión" : "Enviar"}
        </ButtonComponent>
      </Form>
    </Formik>
  );
};

export default FormLogin;
