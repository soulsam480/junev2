import React, { FormEvent, useRef, useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
// import JImage from 'src/Lib/JImage';
import JInput from 'src/Lib/JInput';
import { useUserStore } from 'src/User/store/useUserStore';

interface Props {}
interface UserDetails {
  name: string;
  email: string;
  bio?: string;
  image?: string;
  password: string;
}

const Settings: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);

  const inputFile = useRef<HTMLInputElement>(null);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: user.name,
    email: user.email,
    bio: user.bio,
    image: user.image,
    password: '',
  });

  const updateUserDetails = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <>
      <form className="flex flex-col space-y-8" onSubmit={updateUserDetails}>
        <span className="flex flex-col items-center justify-center ">
          <div className="py-2">
            <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="150px" rounded />
          </div>
          <JButton
            icon="ion:camera-outline"
            onClick={() => {
              inputFile.current?.click();
            }}
            sm
            flat
            round
            size="20px"
          />
          <input type="file" id="file" ref={inputFile} style={{ display: 'none' }} />
        </span>
        <span className="relative">
          <label htmlFor="name" className="absolute left-3 -top-1 px-1 text-xs">
            Name
          </label>
          <JInput
            id="name"
            value={userDetails.name}
            onInput={(name) => setUserDetails({ ...userDetails, name })}
            type="text"
            is="input"
          />
        </span>

        <span className="relative">
          <label htmlFor="email" className="absolute left-3 -top-1 px-1 text-xs">
            Email
          </label>
          <JInput
            id="email"
            value={userDetails.email}
            onInput={(email) => setUserDetails({ ...userDetails, email })}
            type="text"
            is="input"
          />
        </span>

        <span className="relative">
          <label htmlFor="bio" className="absolute left-3 -top-1 px-1 text-xs">
            Bio
          </label>
          <JInput
            id="bio"
            value={userDetails.bio}
            onInput={(bio) => setUserDetails({ ...userDetails, bio })}
            type="text"
            is="textarea"
          />
        </span>

        <span className="relative">
          <label htmlFor="password" className="absolute left-3 -top-1 px-1 text-xs">
            Password
          </label>
          <JInput
            id="password"
            value={userDetails.password}
            onInput={(password) => setUserDetails({ ...userDetails, password })}
            type="password"
            is="input"
          />
        </span>
        <div className="flex justify-end">
          <JButton type="submit">Update</JButton>
        </div>
      </form>
    </>
  );
};
export default Settings;
