import React, { useState, useEffect } from 'react'
import Joi from 'joi-browser'
import {getGenres} from '../services/genreService'
import {getMovies, saveMovie} from '../services/movieService'

const MovieDetail = (props) => {

    const initialNewMovie = {_id: "", title: '', genreId:'', numberInStock: 0, dailyRentalRate: 0};
    const {match, history} = props;
    const convertOutToInside = ( fromOut ) => {
        //console.log("fromOut", fromOut);
        const toInside = {}
        toInside._id = fromOut._id;
        toInside.title = fromOut.title;
        toInside.genreId = fromOut.genre._id;
        toInside.numberInStock = fromOut.numberInStock;
        toInside.dailyRentalRate = fromOut.dailyRentalRate
        return toInside;
    }

    // eslint-disable-next-line
    useEffect( () => {
        async function getGenresService() {
            const innerGenres  = await getGenres();
            const data = [ {_id:"", name:"장르 값을 선택해 주세요"}, ...innerGenres.data ]
            setGenres(data)
        }
        getGenresService();


        async function getMoviesService() {
            const localMovies = await getMovies();
            const existsInMovies = localMovies.data.some( m => m._id === match.params.id);
            if( !( existsInMovies || match.params.id === "new" )) {
                history.push("/not-found");
                return;
            }

            
            if( match.params.id === "new") {
                setMovie( {...initialNewMovie } )
                return;
            }
            const findMovie = localMovies.data.find( m => m._id === match.params.id );
            setMovie( convertOutToInside( findMovie)  );
        }
        getMoviesService();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    



    const [movie, setMovie] = useState( initialNewMovie );
    const [errors, setErrors] = useState({});
    const [genres, setGenres] = useState([]);

    const joiSchema = { 
        title: Joi.string().required().min(5).error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "string.min":
                return { message: "제목은 5글자 이상입니다."};
                case "any.empty":
                return { message: "입력값이 비었습니다." };
                default:
                return { message: "default 입니다." };
            }
            }
            )
        }),
        genreId: Joi.string().required().error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "any.empty":
                return { message: "입력값이 비었습니다." };
                default:
                return { message: "default 입니다." };
            }
            }
            )
        }),
        numberInStock: Joi.number().required().min(1).max(10).error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "any.empty":
                return { message: "입력값이 비었습니다." };
                case "number.min":
                return { message: "1이상값을 넣으세요." };
                case "number.max":
                return { message: "10이하의 값을 넣으세요." };
                default:
                return { message: "1에서 10 사이의 값을 넣으세요." };
            }
            }
            )
        }),
        dailyRentalRate: Joi.number().required().min(1).max(10).error((errors) => {
            return errors.map(error => {
            switch (error.type) {
                case "any.empty":
                return { message: "입력값이 비었습니다." };
                case "number.min":
                return { message: "1이상값을 넣으세요." };
                case "number.max":
                return { message: "10이하의 값을 넣으세요." };
                default:
                return { message: "1에서 10 사이의 값을 넣으세요." };
            }
            }
            )
        })
    }

    const validate = () => {
        const schema = Joi.object().keys( 
            joiSchema
        );
        const obj = {...movie};
        delete obj._id;
        const result = schema.validate( obj , {abortEarly: false} );
        //console.log("result", result);

        if( !result.error ) return null;

        const returnErrors = {}
        for ( let item of result.error.details ) {
            returnErrors[item.path[0]] = item.message;
        }
        return returnErrors;

    }

    const validateProperty = (name, value) => {
        const localSchema = Joi.object( { [name] : joiSchema[name] } );
        const obj = { [name]: value }
        const result = localSchema.validate( obj );
        if( !result.error ) return null;
        return result.error.details[0].message;
    }


    const handleSubmit = e => {
        e.preventDefault();

        const rErrors = validate();
        setErrors( rErrors || {} )

        if( rErrors ) return ;
        
        async function callAsync() {
            await saveMovie( movie )
            history.push("/movies");
        }
        callAsync();
    
    }

    const handleChange = e => {
        const copied = {...movie}
        copied[e.target.name] = e.target.value;
        setMovie( copied )

        const errorMessage = validateProperty(e.target.name, e.target.value);
        if( errorMessage ) {
            const cError = {...errors};
            cError[e.target.name] = errorMessage;
            setErrors( cError );
        } else {
            const cError = {...errors};
            delete cError[e.target.name];
            setErrors( cError );
        }
    }


    return (
        <div>
            <h1>Movie Form</h1>
            <form onSubmit={handleSubmit}>
            <div className="form-control">
                <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={movie.title} onChange={handleChange} />
                    { errors.title && <div className="alert alert-danger">{errors.title}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="genreId">Genre</label>
                    <select className="form-control" id="genreId" name="genreId" value={movie.genreId} onChange={handleChange}>
                        {
                            genres.map( d => <option key={d._id} disabled={d._id === ""}  value={d._id}>{d.name}</option> )
                        }
                    </select>
                    { errors.genre && <div className="alert alert-danger">{errors.genre}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="numberInStock">NumberInStock</label>
                    <input type="text" className="form-control" id="numberInStock" name="numberInStock" value={movie.numberInStock} onChange={handleChange} />
                    { errors.numberInStock && <div className="alert alert-danger">{errors.numberInStock}</div>}
                </div>
                <div className="form-control">
                    <label htmlFor="dailyRentalRate">Rate</label>
                    <input type="text" className="form-control" id="dailyRentalRate" name="dailyRentalRate" value={movie.dailyRentalRate} onChange={handleChange} />
                    { errors.dailyRentalRate && <div className="alert alert-danger">{errors.dailyRentalRate}</div>}
                </div>
                <button className="btn btn-primary btn-block" 
                    disabled={validate()} >
                        제출</button>
            </form>
        </div>
    )
}

export default MovieDetail
