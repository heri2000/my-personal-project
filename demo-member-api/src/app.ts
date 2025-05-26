import { getCommandLineArgs } from './utils';
import { initUser } from './commands/initUser';
import { startServer } from './server';
import { clearUnusedMembers } from './commands/clearUnusedMembers';
import { checkSessions } from './commands/checkSessions';

const args = getCommandLineArgs();

if (args.includes('--init-user')) {
  initUser();
} else if (args.includes('--clear-unused-members')) {
  clearUnusedMembers();
} else if (args.includes('--check-sessions')) {
  checkSessions();
} else {
  startServer();
}
