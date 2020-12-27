
import http from './httpService'
//import config from '../config.json'
import jwtDecode from 'jwt-decode';


http.setJWT( getJWT() );

async function  login( user ) {
    const obj = {};
    obj.email = user.username;
    obj.password = user.password;
    
    const res = await http.post(  "/auth", obj );
    localStorage.setItem("token", res.data );
}
function loginWithJWT( response ) {
    localStorage.setItem('token', response.headers["x-auth-token"]);
}
function logout() {
    localStorage.removeItem("token");
}
function getCurrentUser() {
    try{
        const token = localStorage.getItem("token");
        const user = jwtDecode( token );
        return user;
      } catch(ex) {
        return null;
      }
}
function getJWT() {
    return localStorage.getItem("token");
}




const imsi = {
    login,
    loginWithJWT,
    logout,
    getCurrentUser,
    getJWT
}
export default imsi;
