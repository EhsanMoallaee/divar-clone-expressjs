import AbstractRepository from '../../dataAccessLayer/abstract.repository.js';
import UserModel from './model/user.model.js';

class UserRepository extends AbstractRepository {
	constructor() {
		super(UserModel);
	}
}

export default new UserRepository();
