// services/mailer.js
const nodemailer = require('nodemailer');

const dotenv = require ( "dotenv" );
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
            from: 'your-email@gmail.com',
            to: participants.join(', '),
            subject: 'Grille de Bingo Terminée',
            text: `Bonjour,

La grille de bingo a été terminée ! Félicitations à ${winnerName} pour avoir validé un Bingo !

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
