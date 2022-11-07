import axios from "axios"

export const api = axios.create({
 baseURL: process.env.ENDERECO_BASE_DA_API
});