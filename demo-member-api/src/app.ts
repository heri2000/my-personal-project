import { getCommandLineArgs } from './utils';
import { initUser } from './initUser';
import { startServer } from './server';

const args = getCommandLineArgs();

if (args.includes('--init-user')) {
  initUser();
} else {
  startServer();
}
