import { getCommandLineArgs } from './utils';
import { initUser } from './commands/initUser';
import { startServer } from './server';
import { clearUnusedMembers } from './commands/clearUnusedMembers';

const args = getCommandLineArgs();

if (args.includes('--init-user')) {
  initUser();
} else if (args.includes('--clear-unused-members')) {
  clearUnusedMembers();
} else {
  startServer();
}
