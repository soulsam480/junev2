import { useUserStore } from 'src/User/store/useUserStore';
import { api, getToken, intervalRef, setApiToken } from 'src/utils/helpers';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserData } from 'src/User/services/auth';
import { useAlert } from 'src/Lib/store/alerts';

export async function getTokens() {
  try {
    const {
      data: { token, refresh },
    } = await api.get('/auth/token', {
      headers: {
        token: `Bearer ${getToken()}`,
      },
    });

    setApiToken(token);
    localStorage.setItem('__auth', refresh);

    return { token, refresh };
  } catch (error) {
    console.log(error);
    setApiToken(null);
    localStorage.removeItem('__auth');

    throw new Error('failed to get token');
  }
}

export function tokenWatcher() {
  const interval = setInterval(async () => {
    localStorage.removeItem('__watcher');

    if (!!getToken()) {
      try {
        await getTokens();
      } catch (error) {
        console.log(error);

        useUserStore.setState({ user: {} as any, isLoggedIn: false });
      }
    } else {
      intervalRef() && clearInterval(intervalRef() as number);
    }
  }, 840000);

  intervalRef('set', interval);
}

export function useAuth() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  return {
    isLoading,
    auth: async () => {
      if (!getToken()) return;

      setLoading(true);

      try {
        await getTokens();

        const { data } = await getUserData();

        localStorage.setItem('__auth', data.refresh);
        setApiToken(data.token as string);
        delete (data as any).refresh;
        delete (data as any).token;

        useUserStore.setState({ user: { ...data }, isLoggedIn: true });

        tokenWatcher();
      } catch (error) {
        console.log(error);

        localStorage.removeItem('__auth');
        useUserStore.setState({ user: {} as any, isLoggedIn: false });

        if (!!intervalRef()) clearInterval(intervalRef() as number);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    },
  };
}

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser, setLogin } = useUserStore();
  const [isLoading, setLoading] = useState(false);
  const setAlert = useAlert((s) => s.setAlert);

  useEffect(() => {
    if (!search) return;
    const tok = search.split('?auth_success=')[1];
    if (!tok) return navigate('/');

    (async () => {
      setLoading(true);
      try {
        setApiToken(tok);
        const { data } = await getUserData();

        localStorage.setItem('__auth', data.refresh);
        setApiToken(data.token as string);
        delete (data as any).refresh;
        delete (data as any).token;

        setUser({ ...data });
        setLogin(true);

        tokenWatcher();
        setAlert({ type: 'success', message: 'Logged in' });

        navigate('/home');
      } catch (error) {
        console.log(error);

        setUser({} as any);
        setLogin(false);
        setApiToken(null);
        localStorage.removeItem('__auth');

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
