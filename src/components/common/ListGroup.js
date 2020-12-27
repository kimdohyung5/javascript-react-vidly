import React from 'react'

const ListGroup = (props) => {

    const {items, currentGenre, onClick, propertyName, propertyValue} = props;
    const getClasses = (item) => {
        if( currentGenre === item)
            return "list-group-item active" 
        return "list-group-item"
    }
    return (
        <div>
            <ul className="list-group">
                {
                    items.map(item=> (<li key={item[propertyName]} className={getClasses(item)} onClick={()=> onClick(item)}>{item[propertyValue]}</li>))
                }
            </ul>
        </div>
    )
}
ListGroup.defaultProps = {
    propertyName:"_id",
    propertyValue:"name"
}

export default ListGroup
