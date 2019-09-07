import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscribeMeetup {
  get key() {
    return 'SubscribeMeetup';
  }

  async handle({ data }) {
    const { meetupExists, user } = data;

    await Mail.sendMail({
      to: `${meetupExists.User.name} <${meetupExists.User.email}>`,
      subject: 'Nova inscrição no meetup',
      template: 'subscribed',
      context: {
        organizer: meetupExists.User.name,
        user: user.name,
        date: format(
          parseISO(meetupExists.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new SubscribeMeetup();
