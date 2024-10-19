import { Request, Response } from 'express';
import transporter from '../config/mailer';

// Send Email Notification
export const sendEmailNotification = async (req: Request, res: Response): Promise<void> => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error });
  }
};
