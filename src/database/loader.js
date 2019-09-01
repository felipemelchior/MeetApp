import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Users from '../app/models/user';
import Files from '../app/models/files';
import Meetups from '../app/models/meetups';
import Subscribe from '../app/models/subscribe';

const models = [Users, Files, Meetups, Subscribe];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
