import { User, useUserStore } from 'src/User/store/useUserStore';
import { api, setApiToken } from 'src/utils/hepers';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export async function auth() {
  const jtoken = () => localStorage.getItem('__jtoken');

  if (!!jtoken()) {
    try {
      const {
        data: { token, refresh },
      } = await api.get('/token', {
        headers: {
          token: `Bearer ${jtoken()}`,
        },
      });

      localStorage.setItem('__token', refresh);

      const { data: userData } = await api.get('/user', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      useUserStore.setState({ user: { ...userData }, isLoggedIn: true });
    } catch (error) {
      console.log(error);
      localStorage.clear();
      useUserStore.setState({ user: {} as any, isLoggedIn: false });
    }

    setInterval(async () => {
      try {
        const {
          data: { token, refresh },
        } = await api.get('/token', {
          headers: {
            token: `Bearer ${jtoken()}`,
          },
        });

        localStorage.setItem('__token', refresh);
        setApiToken(token);
      } catch (error) {
        console.log(error);
        localStorage.clear();
      }
    });
  }
}

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser, setLogin } = useUserStore();

  useEffect(() => {
    if (!search) return;
    const tok = search.split('?auth_success=')[1];
    if (!tok) return navigate('/');
    (async () => {
      try {
        const { data } = await api.get<User>('/user', {
          headers: {
            authorization: `Bearer ${tok}`,
          },
        });

        localStorage.setItem('__token', data.refresh);
        setApiToken(data.token as string);
        delete (data as any).refresh;
        delete (data as any).access;

        setUser({ ...data });
        setLogin(true);

        navigate('/u');
      } catch (error) {
        console.log(error);

        setUser({} as any);
        setLogin(false);
        localStorage.clear();

        navigate('/');
      }
    })();
  }, []);
}
