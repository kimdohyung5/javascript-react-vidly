
import _ from 'lodash'

const Paginate = (items, pageNumber, itemCountPerPage) => {

    const startIndex = (pageNumber -1) * itemCountPerPage;
    return _(items).slice( startIndex).take(itemCountPerPage).value();
}
export default  Paginate;