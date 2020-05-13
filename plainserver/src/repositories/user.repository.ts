import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations} from '../models';
import {UserDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.username,
  UserRelations
> {
  constructor(
    @inject('datasources.User') dataSource: UserDataSource,
  ) {
    super(User, dataSource);
  }
}
