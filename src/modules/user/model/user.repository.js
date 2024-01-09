import AbstractRepository from '../../../dataAccessLayer/abstract.repository.js';
import UserModel from './user.model.js';

class UserRepository extends AbstractRepository {
	constructor() {
		super(UserModel);
	}
}

export default new UserRepository();
