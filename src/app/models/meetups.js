import Sequelize, { Model } from 'sequelize';
import { isBefore, parseISO } from 'date-fns';

class Meetups extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        place: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(parseISO(this.date), new Date());
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Files, { foreignKey: 'file_id' });
  }
}

export default Meetups;
