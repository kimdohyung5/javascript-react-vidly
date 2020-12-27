
import http from './httpService'
//import config from '../config.json'

export function  getMovies() {
    return http.get( "/movies");
}
export function getMovie(id) {
    return http.get( "/movies/" + id);
}

export function saveMovie(movie) {
    if( !movie._id) {
        const obj = {...movie};
        delete obj._id;
        return http.post( "/movies" , obj);
    }
    const url = "/movies/" + movie._id;
    const obj = {...movie};
    delete obj._id;
    return http.put( url, obj );
}

export function deleteMovie(id) {
    return http.delete( "/movies/" + id);
}