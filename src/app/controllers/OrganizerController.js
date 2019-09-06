import { Op } from 'sequelize';
import Meetup from '../models/meetups';
import User from '../models/user';
import Files from '../models/files';

class OrganizerController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      order: ['date'],
      attributes: ['id', 'name', 'description', 'place', 'date'],
      date: {
        date: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: Files,
          attibutes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new OrganizerController();
