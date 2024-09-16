// services/mailer.js
const nodemailer = require('nodemailer');

const dotenv = require("dotenv");
dotenv.config();

// Créer un transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

});

// Fonction pour envoyer un e-mail
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('E-mail envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
  }
};

// Fonction pour notifier les participants
const notifyParticipants = async (winnerName, participants) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: participants.join(', '),
      subject: 'Grille de Bingo Terminée',
      text: `Bonjour,

Félicitation à ${winnerName} qui a validé sa grille de bingo !
A toi de faire mieux à la prochaine partie !
Soit plus rapide et plus efficace la prochaine fois...

Cordialement,
L'équipe du Bingo de Traverse`,
    };

    await transporter.sendMail(mailOptions);
    console.log('E-mails envoyés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
  }
};

module.exports = {
  sendEmail,
  notifyParticipants
};
