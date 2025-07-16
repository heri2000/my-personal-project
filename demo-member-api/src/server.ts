import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

import { userRoute } from './routes/user';
import { memberRoute } from './routes/member';
import { dashboardRoute } from './routes/dashboard';
import { checkServerStatus, getCommandLineArgs } from './utils';

const app = express();
let PORT: Number = 3000;

const args = getCommandLineArgs();
for (let i=0; i<args.length; i++) {
  if (args[i] === '-p') {
    PORT = parseInt(args[i+1]);
  }
}

let accessControlAllowOrigin = process.env.NODE_ENV === 'development' ? '*' :
  process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
if (!accessControlAllowOrigin) {
  accessControlAllowOrigin = '*';
}

const corsOptions = {
  origin: accessControlAllowOrigin,
  methods: 'GET, POST, OPTIONS, HEAD, PUT, PATCH, DELETE',
  allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  credentials: true,
  optionsSuccessStatus: 200  // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.disable('x-powered-by');
app.use(helmet());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('API');
});

app.get('/status', async (req, res) => {
  const status = await checkServerStatus();
  res.json({ ...status });
});

app.use('/v1/user', userRoute);
app.use('/v1/member', memberRoute);
app.use('/v1/dashboard', dashboardRoute);

export function startServer() {
  const server =app.listen(PORT, () => {
    console.log('The application is listening '
      + 'on port http://localhost:' + PORT);
  });
};
