import { useUserStore } from 'src/User/store/useUserStore';
import { api, setApiToken } from 'src/utils/helpers';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getUserData } from 'src/User/services/auth';

const jtoken = () => localStorage.getItem('__token');

export function useAuth() {
  const [isLoading, setLoading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function tokenWatcher() {
    intervalRef.current = setInterval(async () => {
      if (jtoken()) {
        try {
          const {
            data: { token, refresh },
          } = await api.get('/auth/token', {
            headers: {
              token: `Bearer ${jtoken()}`,
            },
          });

          localStorage.setItem('__token', refresh);
          setApiToken(token);
        } catch (error) {
          console.log(error);
          useUserStore.setState({ user: {} as any, isLoggedIn: false });
          localStorage.removeItem('__token');
        }
      } else {
        clearInterval(intervalRef.current as number);
      }
    }, 840000);
  }

  return {
    isLoading,
    tokenWatcher,
    auth: async () => {
      if (!!jtoken()) {
        setLoading(true);

        try {
          const {
            data: { token },
          } = await api.get('/auth/token', {
            headers: {
              token: `Bearer ${jtoken()}`,
            },
          });

          setApiToken(token);
          const { data } = await getUserData();

          localStorage.setItem('__token', data.refresh);
          setApiToken(data.token as string);
          delete (data as any).refresh;
          delete (data as any).access;

          useUserStore.setState({ user: { ...data }, isLoggedIn: true });
        } catch (error) {
          console.log(error);
          localStorage.removeItem('__token');
          useUserStore.setState({ user: {} as any, isLoggedIn: false });
        } finally {
          setLoading(false);
        }

        tokenWatcher();
      }
    },
  };
}

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser, setLogin } = useUserStore();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) return;
    const tok = search.split('?auth_success=')[1];
    if (!tok) return navigate('/');
    (async () => {
      setLoading(true);
      try {
        setApiToken(tok);
        const { data } = await getUserData();

        localStorage.setItem('__token', data.refresh);
        setApiToken(data.token as string);
        delete (data as any).refresh;
        delete (data as any).access;

        setUser({ ...data });
        setLogin(true);

        navigate('/home');
      } catch (error) {
        console.log(error);

        setUser({} as any);
        setLogin(false);
        localStorage.removeItem('__token');

        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    isLoading,
  };
}
