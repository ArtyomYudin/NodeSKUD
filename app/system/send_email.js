const nodemailer = require('nodemailer');
const logger = require('../config/logger_config');

async function sendEmailNotification(msg) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'ingrid.center-inform.ru',
    port: 25,
    secure: false, // true for 465, false for other ports
  });

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"ИТО мониторинг" <it@center-inform.ru>', // sender address
<<<<<<< HEAD
      to: 'n.orlov@center-inform.ru', // list of receivers
      subject: 'Гостевой пропуск на авто', // Subject line
      text: `${msg}`, // plain text body
      html: `<b>${msg}</b>`, // html body
=======
      to: 'a.yudin@center-inform.ru, n.orlov@center-inform.ru', // list of receivers
      subject: `Гостевой пропуск на авто: ${msg}`, // Subject line
      text: `Выдано пропусков: ${msg}`, // plain text body
      html: `<b>Выдано пропусков: ${msg}</b>`, // html body
>>>>>>> f53035ce02d70dc703116e3b7798d008f98b48e8
    });

    logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = sendEmailNotification;
