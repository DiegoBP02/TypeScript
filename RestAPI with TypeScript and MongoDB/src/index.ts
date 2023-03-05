import { connectToDatabase } from './databaseConnection';

import createServer from './utils/createServer';

const app = createServer();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Server is running on '${HOST}:${PORT}' ...`);
});
