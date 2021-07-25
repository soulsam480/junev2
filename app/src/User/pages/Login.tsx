import React, { useState } from 'react';
import JButton from 'src/Lib/JButton';
import JInput from 'src/Lib/JInput';

interface Props {}

interface LoginUserDto {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
}

const Login: React.FC<Props> = () => {
  const [user, setUser] = useState<LoginUserDto>();
  const [isLogin, setLogin] = useState(true);

  return (
    <div className="my-30 w-full lg:w-3/4 m-auto h-[475px]">
      <div className="flex md:space-x-2 items-stretch h-full">
        <div className="w-full lg:w-1/2 hidden sm:block self-center">
          <img src="/june-logo.svg" className="max-w-full m-auto block w-80" alt="" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col space-y-4 flex-grow self-center">
          <div>
            {isLogin ? (
              <div className="flex flex-col space-y-4 border-1 rounded-md p-3 text-center">
                <div className="text-xl text-gray-600 hidden sm:block">Log In</div>
                <img
                  src="/june-logo.svg"
                  className="max-w-full m-auto block sm:hidden w-16"
                  alt=""
                />

                <form className="flex flex-col space-y-4 ">
                  {' '}
                  <JInput
                    value={user?.email}
                    type="email"
                    onInput={(email) => setUser({ ...user, email })}
                    placeholder="Email or username"
                  />
                  <JInput
                    value={user?.password}
                    onInput={(password) => setUser({ ...user, password })}
                    placeholder="Password"
                    type="password"
                  />
                  <JButton label="Log In" type="submit" block />
                </form>

                <div className="text-base">OR</div>

                <div className="flex items-center justify-center">
                  <JButton icon="ion:logo-google" size="22px" sm />
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 border-1 rounded-md p-3 text-center">
                <div className="text-xl text-gray-600 hidden sm:block">Sign Up</div>
                <img
                  src="/june-logo.svg"
                  className="max-w-full m-auto block sm:hidden w-16"
                  alt=""
                />
                <form className="flex flex-col space-y-4">
                  <JInput
                    value={user?.name}
                    onInput={(email) => setUser({ ...user, email })}
                    placeholder="Name"
                  />
                  <JInput
                    value={user?.username}
                    onInput={(password) => setUser({ ...user, password })}
                    placeholder="Username"
                  />
                  <JInput
                    value={user?.email}
                    type="email"
                    onInput={(email) => setUser({ ...user, email })}
                    placeholder="Email"
                  />
                  <JInput
                    value={user?.password}
                    onInput={(password) => setUser({ ...user, password })}
                    placeholder="Password"
                    type="password"
                  />
                  <JButton label="Sign Up" type="submit" block />
                </form>
              </div>
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
                  onClick={() => setLogin(false)}
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
                  onClick={() => setLogin(true)}
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
