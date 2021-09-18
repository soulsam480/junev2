import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import { useAlert } from 'src/Lib/store/alerts';
import { useLoader } from 'src/Shared/store/loader';
import { UpdatePassword } from 'src/utils/types';
import { updateUserPassword } from '../services/users';
import { useUserStore } from '../store/useUserStore';

export interface IAppProps {}

export default function App(props: IAppProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((s) => s.setUser);
  const setAlert = useAlert((state) => state.setAlert);
  const setLoader = useLoader((s) => s.setLoader);
  const navigate = useNavigate();

  const [password, setPassword] = useState<UpdatePassword>({
    oldPassword: '',
    newPassword: '',
  });
  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.oldPassword || !password.newPassword) return;

    try {
      const {
        data: { data: userFromResponse },
      } = await updateUserPassword(user.id, password);
      console.log(userFromResponse)
      setUser({ ...userFromResponse });
      setAlert({ type: 'success', message: 'Updated successfully' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Unable to update password' });
    } finally {
      navigate('/');
      setLoader(false);
    }
  };
  return (
    <div>
      <form onSubmit={changePassword}>
        <JContainer className="flex flex-col space-y-5 py-5 rounded-lg">
          <JInput
            label="Old Password"
            id="oldPassword"
            value={password.oldPassword}
            type="password"
            onInput={(oldPassword) => setPassword({ ...password, oldPassword })}
          />
          <JInput
            label="New Password"
            id="newPassword"
            value={password.newPassword}
            type="password"
            onInput={(newPassword) => setPassword({ ...password, newPassword })}
          />
          <div className="flex justify-end">
            <JButton type="submit">Update</JButton>
          </div>
        </JContainer>
      </form>
    </div>
  );
}
