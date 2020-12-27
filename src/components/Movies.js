import React, { useState, useEffect } from 'react'

import _ from 'lodash'
import {getMovies, deleteMovie} from '../services/movieService'
import {getGenres} from '../services/genreService'
import Pagination from './common/Pagination'
import Paginate from '../utils/paginate'

import ListGroup from './common/ListGroup'
import MovieTable from './MovieTable'

const itemCountPerPage = 4;
const allGenre = {_id:'', name:'Select All'};

const Movies = ( props ) => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [genres, setGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState( null );
    const [sortColumn, setSortColumn] = useState({path:'title', order:'asc'});
    const [search, setSearch] = useState('');
    useEffect(()=> {
        async function innerCall() {
            const localMovies = await getMovies();
            setMovies( localMovies.data );
            const localGenres = await getGenres();
            setGenres( [ allGenre, ...localGenres.data] )
        }
        innerCall();
    }, [])

    const handleGenresChange = (genre) => {
        setCurrentGenre( genre);
        setCurrentPage( 1 );
        setSearch( "" );
    }
    const handleDelete = async (movie) => {
        try {
            await deleteMovie( movie._id );
            const afterDeleted = movies.filter( m => m._id !== movie._id);
            setMovies( afterDeleted );
        } catch( ex) {
            console.log("deleteMovie error", ex);
        }
    }
    const handlePageChange = (page) => {
        setCurrentPage( page );
        //console.log("handlePageChange page", page);
    }
    const handleLiked = (movie) => {
        const index = movies.indexOf( movie );
        const copiedMovies = [...movies];
        copiedMovies[index] = {...movie};
        copiedMovies[index].liked = !copiedMovies[index].liked;
        setMovies( copiedMovies );
    }
    const handleSort = (sColumn) => {
        setSortColumn ( sColumn );        
    }
    const handleAddMovie = e => {
        props.history.push("/movies/new");
    }
    const handleSearchChange = e => {
        setSearch( e.target.value );
        setCurrentPage( 1 );
        setCurrentGenre( null );

    }
    const totalMovieCount = movies.length;
    let filteredMovies = ( currentGenre && currentGenre._id )   ? movies.filter( m => m.genre._id === currentGenre._id ) : movies ;
    if( search.trim() !== "" ) {
        filteredMovies  = filteredMovies.filter( m => m.title.toLowerCase().includes( search.trim().toLowerCase() ));
        //console.log("aa", aa);
    }
    
    const sortedMovies = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const pagedMovies = Paginate( sortedMovies, currentPage, itemCountPerPage);

    //if ( totalMovieCount === 0) return <p> There is no movies in the database.</p> 
    return (
        <div className="row">
            <div className="col-3">
                <ListGroup items={genres} currentGenre={currentGenre} onClick={handleGenresChange}/>
            </div>
            <div className="col">
                {
                    props.user && <button className="btn btn-primary" onClick={handleAddMovie}>New Movies</button>
                }
                <input type="text" className="form-control my-3" value={search} onChange={handleSearchChange} placeholder="...search" />
                <h1>Showing Movies {filteredMovies.length} movies in the database. </h1>
                <MovieTable pagedMovies={pagedMovies} onLiked={handleLiked} onDelete={handleDelete} sortColumn={sortColumn} onSort={handleSort}/>           
                <Pagination itemCount={filteredMovies.length}  currentPage ={currentPage} itemCountPerPage={itemCountPerPage} onPageChange= {handlePageChange} />
            </div>
            
        </div>
    )
}

export default Movies
