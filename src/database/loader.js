import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Users from '../app/models/user';

const Models = [Users];

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
