import { getCommandLineArgs } from './utils';
import { initUser } from './commands/initUser';
import { startServer } from './server';
import { cleanUnusedMembers } from './commands/cleanUnusedMembers';

const args = getCommandLineArgs();

if (args.includes('--init-user')) {
  initUser();
} else if (args.includes('--clear-unused-members')) {
  cleanUnusedMembers();
} else {
  startServer();
}
