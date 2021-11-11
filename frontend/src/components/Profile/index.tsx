import { FaUser, FaPen } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import bbcodeToHTML from 'src/helpers/bbcode';
import useUser from 'src/hooks/useUser';
import useUsers from 'src/hooks/useUsers';

import styles from './profile.module.scss';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { detailUser } = useUsers();
  const isYourself = detailUser.username === username;
  const { user, isLoading } = useUser(username || 'info');
  return isLoading ? (
    <div className="loader size-lg" />
  ) : (
    <div className={styles.profile}>
      <div
        className={styles.cover}
        style={{ background: user?.cover ? `url(http://localhost:5000/uploads/${user.cover})` : '#ddd' }}
      >
        <div className={styles.avatar}>
          {user?.avatar ? (
            <img src={`http://localhost:5000/uploads/${user.avatar}`} alt={`avatar of ${username}`} />
          ) : (
            <FaUser size="48" color="rgb(108 108 108)" />
          )}
        </div>
      </div>
      {isYourself}
      <h1 className={styles.fullname}>
        {user?.fullname}
        <Link to="/settings" className={styles.edit}>
          <FaPen size="20" />
        </Link>
      </h1>
      {/* eslint-disable-next-line react/no-danger */}
      <p className={styles.introduce} dangerouslySetInnerHTML={{ __html: bbcodeToHTML(user?.introduce || '') }} />
    </div>
  );
};
export default Profile;
