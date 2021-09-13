import React, { FormEvent, useRef, useState } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
// import JImage from 'src/Lib/JImage';
import JInput from 'src/Lib/JInput';
import { useUserStore } from 'src/User/store/useUserStore';
import { useAlert } from 'src/Lib/store/alerts';
import { updateUserById } from '../services/users';
import { UpdateUserData } from 'src/utils/types';
import { useNavigate } from 'react-router-dom';

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
  const setAlert = useAlert((state) => state.setAlert);
  const navigate = useNavigate();
  console.log(user);
  const inputFile = useRef<HTMLInputElement>(null);

  const [userDetails, setUserDetails] = useState<UpdateUserData>({
    name: user.name,
    email: user.email,
    bio: user.bio,
    image: user.image,
    username: user.username,
  });

  function diffMatcher<T extends Record<string, any>>(
    newData: { [x in keyof T]: T[x] },
    toMatch: T,
  ): Partial<T> {
    return Object.entries(newData).reduce<Partial<T>>((acc, [key, value]) => {
      acc = { ...acc, [key]: value !== toMatch[key] && value.length > 0 && value };
      return acc;
    }, {});
    // let diffedData: Partial<T> = {};
    // Object.keys(newData).forEach((key) => {
    //   newData[key] !== toMatch[key] && newData[key].length > 0 && (diffedData[key] = newData[key]);
    // });
    // return Object.entries(diffedData).length > 0 ? diffedData : null;
  }

  const updateUserDetails = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = diffMatcher(userDetails, user);
      await updateUserById(user.id, data);
      setAlert({ type: 'success', message: 'Updated successfully' });
      navigate('/');
    } catch (error) {
      setAlert({ type: 'danger', message: 'Unable to update user' });
    }
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
        <JContainer className="flex flex-col space-y-4 rounded-lg py-5">
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
        </JContainer>
      </form>
    </div>
  );
};
export default Settings;
