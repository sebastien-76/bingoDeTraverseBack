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

// Fonction générique pour envoyer un e-mail
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
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
  }
};

// Fonction spécifique pour notifier les participants
const notifyParticipants = async (winnerName, participants) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: participants.join(', '),
    subject: 'Grille de Bingo Terminée',
    text: `Bonjour,

Félicitations à ${winnerName} qui a validé sa grille de bingo !
À toi de faire mieux à la prochaine partie ! Sois plus rapide et plus efficace la prochaine fois...

Cordialement,
L'équipe du Bingo de Traverse`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mails envoyés avec succès');
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
  }
};

// Nouvelle fonction pour envoyer un e-mail de réinitialisation de mot de passe
const sendPasswordResetEmail = async (to, resetToken) => {
  const resetLink = `${process.env.RESET_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Réinitialisation de mot de passe',
    text: `Bonjour,

Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien suivant pour créer un nouveau mot de passe :
${resetLink}

Ce lien est valide pendant 1 heure.

Si vous n'avez pas demandé de réinitialisation de mot de passe, ignorez simplement cet e-mail.

Cordialement,
L'équipe du Bingo de Traverse`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de réinitialisation de mot de passe envoyé avec succès');
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation de mot de passe :", error);
  }
};

module.exports = {
  sendEmail,
  notifyParticipants,
  sendPasswordResetEmail
};
