import React from 'react'
import _ from 'lodash'

const TableBody = (props) => {

    const {data, columns} = props;
    const getRenderCell = (m, c) => {
        if( c.component ) {
            return c.component( m );
        }
        return _.get(m, c.path);
    }
    return (
        
        <tbody>
        {
            data.map( row => 
                <tr key={row._id}>
                    {
                        columns.map( c => <td key={row._id + ( c.path || c.key)}>{ getRenderCell( row, c) }</td> )
                    }
                </tr>
            )
        }
        </tbody>
       
    )
}

export default TableBody
