import React from 'react'
import PropTypes from 'prop-types';

function getArray(start, end) {
    const returns = [];
    for(let i= start; i<= end;i++) {
        returns.push( i );
    }
    return returns;
}

const Pagination = (props) => {

    //console.log("props", props);
    const { itemCount, currentPage, onPageChange, itemCountPerPage, pageCountPerScreen } = props;

    

    const totalPages = Math.ceil( itemCount / itemCountPerPage );
    const startPage = Math.floor( (currentPage -1) / pageCountPerScreen ) * pageCountPerScreen + 1;
    const lastPage = Math.min( totalPages, startPage - 1 + pageCountPerScreen );
    const arrays = getArray(startPage, lastPage);

    if( totalPages <= 1) return null;


    const canShowPrevNavi = () => {
        // console.log("currentPage", currentPage, "pageCountPerScreen", pageCountPerScreen);
        return currentPage > pageCountPerScreen;
    }
    const handlePrevPage = () => {
        const nowScrren = Math.ceil( currentPage / pageCountPerScreen );
        const targetPage = (nowScrren - 1 ) * pageCountPerScreen ;
        onPageChange( targetPage);
    }
    const canshowNextNavi = () => {
        const nowScreen = Math.ceil ( currentPage / pageCountPerScreen );
        const lastScreen = Math.ceil ( totalPages / pageCountPerScreen );

        // console.log("currentPage", currentPage, "lastPage", lastPage, "nowScreen", nowScreen, "lastScreen", lastScreen);
        return nowScreen < lastScreen ;
    }
    const handleNextPage = () => {
        const nowScrren = Math.ceil( currentPage / pageCountPerScreen );
        const targetPage = nowScrren * pageCountPerScreen + 1 ;
        onPageChange( targetPage);
    }

    //console.log("startPage", startPage, "lastPage", lastPage, "totalPages", totalPages, "currentPage", currentPage);

    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    { canShowPrevNavi() && <li className="page-item"><button className="page-link" onClick={handlePrevPage}>Previous</button></li>}
                    {
                        arrays.map( item => (
                            <li key={item} className={item === currentPage ?  "page-item active": "page-item"} >
                                <button className="page-link" onClick={()=> onPageChange(item)}>{item}</button>
                            </li>
                        ))
                    }
                    { canshowNextNavi() && <li className="page-item"><button className="page-link" onClick={handleNextPage}>Next</button></li> }
                    
                </ul>
            </nav>
        </div>
    )
}

Pagination.defaultProps = {
    itemCountPerPage: 4,
    pageCountPerScreen: 5
}
Pagination.propTypes = {
    itemCount: PropTypes.number.isRequired, 
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    itemCountPerPage: PropTypes.number,
    pageCountPerScreen: PropTypes.number
}

export default Pagination
