import * as Yup from 'yup';
import { Op } from 'sequelize';
import Subscribe from '../models/subscribe';
import Meetups from '../models/meetups';
import User from '../models/user';
import Queue from '../../lib/Queue';
import SubscribeMeetup from '../jobs/SubscribeMeetup';

class SubscribeController {
  async index(req, res) {
    const subscribed = await Subscribe.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Meetups,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          attributes: ['id', 'name', 'description', 'place', 'date'],
        },
      ],
      attributes: ['id'],
      order: [[Meetups, 'date']],
    });

    return res.json(subscribed);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const subscribeExists = await Subscribe.findOne({
      where: { user_id: req.userId, meetup_id },
    });

    if (subscribeExists) {
      return res
        .status(401)
        .json({ error: 'You already subscribed in this meetup' });
    }

    const meetupExists = await Meetups.findByPk(meetup_id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!meetupExists) {
      return res.status(400).json({ error: "Meetup does't exists" });
    }

    if (meetupExists.user_id === req.userId) {
      return res.status(401).json({ error: "You can't subscribe own meetups" });
    }

    const user = await User.findByPk(req.userId);
    console.log(user.name);

    await Subscribe.create({ user_id: req.userId, meetup_id });

    await Queue.add(SubscribeMeetup.key, {
      meetupExists,
      user,
    });

    return res.json();
  }
}

export default new SubscribeController();
