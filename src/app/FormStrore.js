import { createStore } from 'redux'
import formReducer from './FormReducer'

const store = createStore(formReducer)
export default store