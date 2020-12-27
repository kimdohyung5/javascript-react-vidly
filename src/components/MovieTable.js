import React from 'react'

import Table from './common/Table'
import Like from './common/Like'
import {Link} from 'react-router-dom'

import auth from '../services/authService'

const MovieTable = (props) => {

    const { pagedMovies, onLiked, onDelete, onSort, sortColumn } = props;
    const columns = [
        { path:'title', component: m => <Link to={`/movies/${m._id}`}>{m['title']}</Link>
        },
        { path:'genre.name', title: 'Genre'},
        { path:'numberInStock', title: 'Stock'},
        { path:'dailyRentalRate', title: 'Rate'},
        { key:'liked', component:m => <Like liked={m.liked} onClick={()=> onLiked(m)}/>}
        
    ]

    const deleteColumn = { key:'delete', component:m => <button className="btn btn-danger" onClick={()=> onDelete(m)}>삭제</button> };

    const user = auth.getCurrentUser();
    if( user && user.isAdmin  ) columns.push( deleteColumn );
    return (
        <Table columns={columns} data={pagedMovies} sortColumn={sortColumn} onSort={onSort} />
    )
}

export default MovieTable
