import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import { useAlert } from 'src/Lib/store/alerts';
import { JunePaths } from 'src/Shared/router';
import { googleLogin, login, LoginUserDto, register } from 'src/User/services/auth';
import { useUserStore } from 'src/User/store/useUserStore';
import { tokenWatcher } from 'src/utils/auth';
import { setApiToken } from 'src/utils/helpers';

interface Props {}

const Login: React.FC<Props> = () => {
  const { setUser, setLogin } = useUserStore();
  const naviagte = useNavigate();
  const { setAlert } = useAlert();

  const [user, setUSerDto] = useState<LoginUserDto>({
    email: '',
    name: '',
    password: '',
    username: '',
  });
  const [isLogin, setLoginType] = useState(true);

  const [isLoginLoading, setLoginLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (!user.email || !user.password) return;

    try {
      setLoginLoading(true);
      const { data } = await login(user);

      localStorage.setItem('__auth', data.refresh);
      setApiToken(data.token as string);
      delete (data as any).refresh;
      delete (data as any).token;

      setUser({ ...data });
      setLogin(true);

      tokenWatcher();
      setAlert({ type: 'success', message: 'Logged in' });

      naviagte(`/${JunePaths.User}`);
    } catch (error) {
      console.log(error);
      setLoginLoading(false);
      //@ts-ignore
      setAlert({ type: 'danger', message: error.message });
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    if (Object.values(user).length < 4) return;

    try {
      setLoginLoading(true);
      const { data } = await register(user);

      localStorage.setItem('__auth', data.refresh);
      setApiToken(data.token as string);
      delete (data as any).refresh;
      delete (data as any).token;

      setUser({ ...data });
      setLogin(true);

      tokenWatcher();
      setAlert({ type: 'success', message: 'Registered and logged in' });

      naviagte(`/${JunePaths.User}`);
    } catch (error) {
      console.log(error);
      setLoginLoading(false);
      //@ts-ignore
      setAlert({ type: 'danger', message: error.message });
    }
  }

  return (
    <div className="my-30 w-full lg:w-3/4 m-auto h-[475px]">
      <div className="flex md:space-x-2 items-stretch h-full">
        <div className="w-full lg:w-1/2 hidden sm:block self-center">
          <img src="/june-logo.svg" className="max-w-full m-auto block w-80" alt="" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col space-y-4 flex-grow self-center">
          <div>
            {isLogin ? (
              <JContainer className="flex flex-col space-y-4 border-1 rounded-md px-3 py-4 text-center">
                <div className="text-xl text-gray-600 hidden sm:block">Log In</div>
                <img
                  src="/june-logo.svg"
                  className="max-w-full m-auto block sm:hidden w-16"
                  alt=""
                />

                <form className="flex flex-col space-y-4 " onSubmit={handleLogin}>
                  {' '}
                  <JInput
                    value={user?.email}
                    type="text"
                    onInput={(email) => setUSerDto({ ...user, email })}
                    placeholder="Email or username"
                  />
                  <JInput
                    value={user?.password}
                    onInput={(password) => setUSerDto({ ...user, password })}
                    placeholder="Password"
                    type="password"
                  />
                  <JButton label="Log In" type="submit" block loading={isLoginLoading} />
                </form>

                <div className="text-base">OR</div>

                <div className="flex items-center justify-center">
                  <JButton icon="ion:logo-google" size="22px" sm onClick={() => googleLogin()} />
                </div>
              </JContainer>
            ) : (
              <JContainer className="flex flex-col space-y-4 border-1 rounded-md px-3 py-4 text-center">
                <div className="text-xl text-gray-600 hidden sm:block">Sign Up</div>
                <img
                  src="/june-logo.svg"
                  className="max-w-full m-auto block sm:hidden w-16"
                  alt=""
                />
                <form className="flex flex-col space-y-4" onSubmit={(e) => handleRegister(e)}>
                  <JInput
                    value={user?.name}
                    onInput={(name) => setUSerDto({ ...user, name })}
                    placeholder="Name"
                  />
                  <JInput
                    value={user?.username}
                    onInput={(username) => setUSerDto({ ...user, username })}
                    placeholder="Username"
                  />
                  <JInput
                    value={user?.email}
                    type="email"
                    onInput={(email) => setUSerDto({ ...user, email })}
                    placeholder="Email"
                  />
                  <JInput
                    value={user?.password}
                    onInput={(password) => setUSerDto({ ...user, password })}
                    placeholder="Password"
                    type="password"
                  />
                  <JButton label="Sign Up" type="submit" block loading={isLoginLoading} />
                </form>
              </JContainer>
            )}
          </div>
          <div className="flex flex-col space-y-4 border-1 rounded-md px-2 py-5 text-center">
            {isLogin ? (
              <div className="text-base text-gray-600">
                Don't have an account?
                <JButton
                  label="Sign Up"
                  flat
                  dense
                  className="!inline mx-1 !bg-transparent text-lime-600"
                  onClick={() => setLoginType(false)}
                />
              </div>
            ) : (
              <div className="text-base text-gray-600">
                Have an account?
                <JButton
                  label="Log In"
                  flat
                  dense
                  className="!inline mx-1 !bg-transparent text-lime-600"
                  onClick={() => setLoginType(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
