import * as React from 'react';
import { Link } from 'react-router-dom';


export default function App() {
  return (
    <div className="flex flex-col my-2">
      <h1 className="text-center text-4xl font-bold">Settings</h1>
      <div className="flex justify-evenly flex-wrap mt-20">
        <Link
          to="/settings/profile"
          className="flex items-center justify-center rounded-lg 
        bg-lime-300 hover:bg-lime-200 w-40 h-40 m-5"
        >
          <p>Edit Profile</p>
        </Link>
        <Link
          to="/settings/password"
          className="flex items-center justify-center rounded-lg bg-lime-300 
        hover:bg-lime-200 w-40 h-40 m-5"
        >
          <p>Change Password</p>
        </Link>
      </div>
    </div>
  );
}
