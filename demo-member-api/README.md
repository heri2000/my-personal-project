# heri-tny Demo Backend

Run:
- `nvm install` (one time only)
- `nvm use`

### To install dependencies:

Run: `npm install`

### To run migration:

- Creating a migration file: `npm run migrate create <migration-name>`
- Migrate up: `npm run migrate up`
- Migrate down `npm run migrate down`
- Reset all migrations `npm run migrate reset`
- For more information on the commands, visit [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/)
- For more information on DB migration, visit [https://db-migrate.readthedocs.io/en/stable/](https://db-migrate.readthedocs.io/en/stable/)*.

### To initialize admin user:

`npm run start -- --init-user`

### To run the server app:

- In development mode: `DEBUG=heri-tny-demo-be-v1:* npm run dev`
- In production mode: `npm run start`

---

### Notes

**To generate a random string for secret key, run this code in the Node REPL:**

```
require('crypto').randomBytes(64).toString('hex');
.exit
```

**MySQL2 Documentation**

[https://sidorares.github.io/node-mysql2/docs/documentation](https://sidorares.github.io/node-mysql2/docs/documentation)
