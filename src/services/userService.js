

import http from './httpService'
//import config from '../config.json'


export function  register( user ) {
    const obj = {};
    obj.email = user.email;
    obj.password = user.password;
    obj.name = user.username;
    return http.post(  "/users", obj );
}


const imsi = {
    register
}
export default imsi;
