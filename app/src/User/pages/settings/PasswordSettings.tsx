import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import { useAlert } from 'src/Lib/store/alerts';
import { useLoader } from 'src/Shared/store/loader';
import { UpdatePassword } from 'src/utils/types';
import { updateUserPassword } from 'src/User/services/users';
import { useUserStore } from 'src/User/store/useUserStore';

interface Props {}

const PasswordSettings: React.FC<Props> = () => {
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

    if (password.newPassword === password.oldPassword)
      return setAlert({ type: 'danger', message: "New password can't be same as old passwrd" });

    setLoader(true);
    try {
      const {
        data: { data: userFromResponse },
      } = await updateUserPassword(user.id, password);

      setUser({ ...userFromResponse });

      setAlert({ type: 'success', message: 'Updated successfully' });
      navigate('/');
    } catch (error) {
      setAlert({ type: 'danger', message: 'Unable to update password' });
    } finally {
      setLoader(false);
    }
  };
  return (
    <div>
      <div className="text-2xl">password settings</div>
      <hr className="my-2 border-lime-400" />

      <form onSubmit={changePassword}>
        <JContainer className="flex flex-col space-y-5 py-5 rounded-lg mt-3">
          <JInput
            label="old Password"
            id="oldPassword"
            value={password.oldPassword}
            type="password"
            onInput={(oldPassword) => setPassword({ ...password, oldPassword })}
          />

          <JInput
            label="new Password"
            id="newPassword"
            value={password.newPassword}
            type="password"
            onInput={(newPassword) => setPassword({ ...password, newPassword })}
          />

          <div className="flex justify-end">
            <JButton
              type="submit"
              disabled={!password.oldPassword || !password.newPassword}
              label="Update"
            />
          </div>
        </JContainer>
      </form>
    </div>
  );
};

export default PasswordSettings;
