import React from 'react'

const Like = (props) => {
    const {liked, onClick} = props;
    return (
        <div>
            <i style={{cursor:'pointer'}} className={ liked ? "fas fa-heart": "far fa-heart"}  onClick={onClick}></i>
        </div>
    )
}

export default Like
