import * as FormActionTypes from './FormActionType';
export default (options = {}, action) => {
    switch(action.type) {
        case FormActionTypes.CLOSE:
            return { visible: false }
        case FormActionTypes.OPEN:
            return { visible: true }
        default:
            return { visible: false }
    }
}