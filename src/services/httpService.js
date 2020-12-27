import axios from 'axios'
import {toast} from 'react-toastify'

function setJWT( token ) {
    axios.defaults.headers.common['x-auth-token'] = token;
}

axios.defaults.baseURL=process.env.REACT_APP_API_URL


axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >=400 && error.response.status < 500;
    //console.log("error.response", error.response, "error.response.status", error.response.status, "expectedError", expectedError);
    if(!expectedError) {
        console.log("Logging the error", error);
        toast.error( "An expected error occurredxx" )
        //alert("An expected error occurred");
    }
    return Promise.reject(error);
})
const dummy = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJWT

}
export default dummy;