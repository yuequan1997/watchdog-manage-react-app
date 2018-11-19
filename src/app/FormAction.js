import * as FormActionTypes from './FormActionType';
export const open = () => {
    return {
        type: FormActionTypes.OPEN
    }
}

export const close = () => {
    return {
        type: FormActionTypes.CLOSE
    }
}