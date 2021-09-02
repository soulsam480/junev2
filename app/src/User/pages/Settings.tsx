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
  username?: string;
}

const Settings: React.FC<Props> = () => {
  const user = useUserStore((state) => state.user);

  const inputFile = useRef<HTMLInputElement>(null);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: user.name,
    email: user.email,
    bio: user.bio,
    image: user.image,
    username: user.username,
  });

  const updateUserDetails = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="text-2xl">settings</div>
      <hr className="my-2 border-lime-400" />
      <form className="flex flex-col space-y-4" onSubmit={updateUserDetails}>
        <div className="flex flex-col items-center justify-center">
          <div className="py-2">
            <JAvatar src="https://cdn.quasar.dev/img/boy-avatar.png" size="150px" rounded />
          </div>

          <JButton
            icon="ion:camera-outline"
            onClick={() => {
              inputFile.current?.click();
            }}
            sm
            round
            size="20px"
          />
        </div>

        <input type="file" id="file" ref={inputFile} style={{ display: 'none' }} />

        <JInput
          label="name"
          id="name"
          value={userDetails.name}
          onInput={(name) => setUserDetails({ ...userDetails, name })}
          type="text"
        />

        <JInput
          label="username"
          id="username"
          value={userDetails.username}
          onInput={(username) => setUserDetails({ ...userDetails, username })}
          type="text"
        />

        {/* //TODO: will be a different component */}
        <JInput
          label="Email"
          id="email"
          value={userDetails.email}
          onInput={(email) => setUserDetails({ ...userDetails, email })}
          type="text"
        />

        <JInput
          label="bio"
          id="bio"
          value={userDetails.bio}
          onInput={(bio) => setUserDetails({ ...userDetails, bio })}
          is="textarea"
        />

        <div className="flex justify-end">
          <JButton type="submit">save</JButton>
        </div>
      </form>
    </div>
  );
};
export default Settings;
