import { useParams } from 'react-router-dom';
import useUser from 'src/hooks/useUser';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user, isLoading } = useUser(username || 'info');
  return (
    <h1>
      {isLoading} Hello {JSON.stringify(user)}
    </h1>
  );
};
export default Profile;
