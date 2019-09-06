import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/meetups';
import Files from '../models/files';

class MeetupController {
  async index(req, res) {
    const { date, page } = req.query;
    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      attributes: ['id', 'name', 'description', 'place', 'date'],
      limit: 20,
      offset: 20 * (page - 1),
    });

    if (meetups === []) {
      return res.status(401).json({ error: 'No one meetup found' });
    }

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      place: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res.status(401).json({ error: 'Date must be future' });
    }

    const meetup = await Meetup.create({
      ...req.body,
      user_id: req.userId,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      place: Yup.string(),
      date: Yup.date(),
      file_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const meetup = await Meetup.findOne({ where: { id, user_id: req.userId } });

    if (!meetup) {
      return res.status(401).json({
        error: 'Meetup not found/Meetup does not belongs to this user',
      });
    }

    if (req.body.date) {
      if (isBefore(parseISO(req.body.date), new Date())) {
        return res.status(401).json({ error: 'New date must be in future' });
      }
    }

    if (meetup.past) {
      return res.status(401).json({ error: "Can't update past meetups" });
    }

    if (req.body.file_id) {
      const fileExists = await Files.findByPk(req.body.file_id);

      if (!fileExists) {
        return res.status(401).json({ error: 'File not found' });
      }
    }

    const newMeetup = await meetup.update(req.body);

    return res.json(newMeetup);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const meetup = await Meetup.findOne({ where: { id, user_id: req.userId } });

    if (!meetup) {
      return res.status(401).json({
        error: 'Meetup not found/Meetup does not belongs to this user',
      });
    }

    if (meetup.past) {
      return res.status(401).json({ error: "You can't delete past meetups" });
    }

    await meetup.destroy();

    return res.status(200).json();
  }
}

export default new MeetupController();
