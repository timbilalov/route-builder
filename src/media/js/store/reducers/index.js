import { combineReducers } from 'redux';
import stages from './stages';
import city from './city';

const reducers = combineReducers({
	stages,
	city,
});

export default reducers;
