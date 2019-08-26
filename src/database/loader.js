import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Users from '../app/models/user';
import Files from '../app/models/files';

const Models = [Users, Files];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    Models.map(model => model.init(this.connection));
  }
}

export default new Database();
