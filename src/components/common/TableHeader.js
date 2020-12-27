import React from 'react'

const TableHeader = ( props ) => {

    const {columns, sortColumn, onSort } = props;

    const raiseSort = path => {
        if(!path) return;
        if( sortColumn.path === path) {
            const order = sortColumn.order === "asc" ? "desc" : "asc"
            onSort( {path, order});
        } else {
            onSort( {path, order: "asc"})
        }
    }
    const renderIcon = column => {
        if( column.path !== sortColumn.path ) return;
        if( sortColumn.order === "asc") return <i className="fas fa-sort-up" ></i>
        return <i className="fas fa-sort-down" ></i>
    }

    return (
        <thead>
            <tr>
                {
                    columns.map( c => <th key={c.path || c.key} className="clickable" 
                        onClick={()=> raiseSort(c.path)}>{c.title} { renderIcon(c)}</th> )
                }
            </tr>
        </thead>
    )
}

export default TableHeader
