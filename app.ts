import express from 'express';
import connectDB from './database';
import authRoutes from './src/routes/auth.routes';
import questionRoutes from './src/routes/question.routes';
import notificationRoutes from './src/routes/notification.routes';
import subscriptionRoutes from './src/routes/subscription.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

