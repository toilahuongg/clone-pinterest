import { useEffect, useMemo, useState } from 'react';
import instance from 'src/helpers/instance';

type TUser = {
  id: number;
  fullname: string;
  username: string;
  gender: string;
  introduce: string | null;
  avatar: string | null;
  cover: string | null;
};
const useUser = (username: string) => {
  const [data, setData] = useState<TUser>();
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/user/${username}`);
        setData(response.data as TUser);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);
  return useMemo(() => ({ user: data, isLoading }), [data, isLoading]);
};
export default useUser;
