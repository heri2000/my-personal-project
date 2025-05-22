import 'dotenv/config';

export const valkeyConfig = {
  addresses: [
    {
      host: (process.env.VALKEY_HOST ? process.env.VALKEY_HOST : 'localhost'),
      port: (process.env.VALKEY_PORT ? Number.parseInt(process.env.VALKEY_PORT) : 6379),
    },
  ],
  clientName: "ht_demo",
};
