const host = (process.env.NODE_ENV === 'production' ? 'https://api.heri-tny.my.id' : 'http://localhost:3000');

export const config = {
  api: {
    user: `${host}/v1/user`,
    member: `${host}/v1/member`,
    dashboard: `${host}/v1/dashboard`,
  }
};
