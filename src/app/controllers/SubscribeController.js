import * as Yup from 'yup';
import Subscribe from '../models/subscribe';
import Meetups from '../models/meetups';
import User from '../models/user';

class SubscribeController {
  async index(req, res) {
    const subscribed = await Subscribe.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: User,
        },
        {
          model: Meetups,
        },
      ],
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

    const meetupExists = await Meetups.findByPk(meetup_id);

    if (!meetupExists) {
      return res.status(400).json({ error: "Meetup does't exists" });
    }

    await Subscribe.create({ user_id: req.userId, meetup_id });

    return res.json();
  }
}

export default new SubscribeController();
