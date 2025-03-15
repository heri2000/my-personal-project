'use client';

import { useState } from 'react';

const defaultState = {
  username1: 'tbone',
  email1: 'test@email.',
  disabled: false,
  message: '',
};

const UserEmailForm = () => {
  const [state, setState] = useState(defaultState);

  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleClick1 = () => {
    setState({ ...state, message: JSON.stringify(state), disabled: true });
    setTimeout(() => {
      setState({ ...state, message: '', disabled: false });
    }, 3000);
  };

  return (
    <div className="flex flex-col w-6/12 mx-auto rounded-xl outline outline-black/5 dark:outline-white/10 p-4">
      <div>
        Username
      </div>
      <div>
        <input
          type="text"
          value={state.username1}
          disabled={state.disabled}
          name="username1"
          onChange={handleChange1}
          className="w-full p-1 rounded border border-gray-500 bg-gray-800/20 text-black dark:text-white disabled:text-gray-500"
        />
      </div>
      <div>
        Email
      </div>
      <div>
        <input
          type="email"
          value={state.email1}
          disabled={state.disabled}
          required
          aria-invalid
          name="email1"
          onChange={handleChange1}
          className="w-full p-1 rounded border border-gray-500 bg-gray-800/20 text-black dark:text-white disabled:text-gray-500 invalid:border-red-500 invalid:text-red-500"
        />
      </div>
      <div className="mt-4">
        <button className="btn-primary" onClick={handleClick1}>
          Save
        </button>
      </div>
      {state.message ? <p>{state.message}</p> : null}
    </div>
  );
};

export default UserEmailForm;
