import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'


type Fetching = {
    graphql: CallableFunction
}



const instance: AxiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })


export const api: Fetching = {
    graphql: async (data: object): Promise<AxiosResponse> => {
        const tokenFinal = Cookies.get("idToken")
        return await instance.post("/graphql", data, {
            headers: {
                Authorization: `Bearer ${tokenFinal}`,
                Development: "madison"
            }
        })

    },

}