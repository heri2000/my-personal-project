import express from 'express';
import 'dotenv/config';

import { userRoute } from './routes/user';
import { memberRoute } from './routes/member';
import { dashboardRoute } from './routes/dashboard';
import { getCommandLineArgs } from './utils';

const app = express();
let PORT: Number = 3000;

const args = getCommandLineArgs();
for (let i=0; i<args.length; i++) {
  if (args[i] === '-p') {
    PORT = parseInt(args[i+1]);
  }
}
app.use(express.json());
app.disable('x-powered-by');

let accessControlAllowOrigin = process.env.DEV === '1' ? '*' : process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
if (!accessControlAllowOrigin) {
  accessControlAllowOrigin = '*';
}

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', accessControlAllowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('API');
});

app.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/v1/user', userRoute);
app.use('/v1/member', memberRoute);
app.use('/v1/dashboard', dashboardRoute);

// function shutDown(server: any) {
//   server.close(() => {
//     console.log('HTTP server closed');
//   })
// }

export function startServer() {
  const server =app.listen(PORT, () => {
    console.log('The application is listening '
      + 'on port http://localhost:' + PORT);
  });

  // process.on('SIGTERM', () => {
  //   console.log('\nSIGTERM signal received');
  //   shutDown(server);
  // });

  // process.on('SIGINT', () => {
  //   console.log('\nSIGINT signal received')
  //   shutDown(server);
  // });
};
