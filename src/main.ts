import app from './app';
import { dotenvConfig } from '@config/dotenv';
// import { connectDB } from '@config/database';
// import { seedDatabase } from '@config/seed';

const PORT = Number(process.env.PORT ?? 3000);

(async () => {
  await dotenvConfig();
  // await connectDB();
  // await seedDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`Mode: ${process.env.NODE_ENV}`)
    console.log(`Base URL: ${process.env.BASE_URL}`)
  });
})();