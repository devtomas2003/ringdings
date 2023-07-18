import axios from "axios";
import { BACKEND_PATH } from "./paths";

export default axios.create({
    baseURL: BACKEND_PATH + '/v1',
    timeout: 5000
});