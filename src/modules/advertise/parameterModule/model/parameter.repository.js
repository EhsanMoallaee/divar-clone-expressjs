import AbstractRepository from '../../../../dataAccessLayer/abstract.repository.js';
import ParameterModel from './parameter.model.js';

class ParameterRepository extends AbstractRepository {
	constructor() {
		super(ParameterModel);
	}
}

export default new ParameterRepository();
