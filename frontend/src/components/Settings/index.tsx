import React, { useEffect, useState } from 'react';

import SettingChangePassword from './SettingChangePassword';
import SettingInfomation from './SettingInfomation';
import styles from './settings.module.scss';

const Settings = () => {
  const [tabActive, setTabActive] = useState<number>(0);
  useEffect(() => {
    document.title = 'Chỉnh sửa thông tin';
  }, []);
  return (
    <div className={styles.settings}>
      <div className={styles.tabDirection}>
        <ul>
          <li className={tabActive === 0 ? styles.active : ''} role="presentation" onClick={() => setTabActive(0)}>
            Thông tin cá nhân
          </li>
          <li className={tabActive === 1 ? styles.active : ''} role="presentation" onClick={() => setTabActive(1)}>
            Thay đổi mật khẩu
          </li>
        </ul>
      </div>
      <div className={styles.mainTab}>
        <div className={styles.form480}>
          {tabActive === 0 && <SettingInfomation />}
          {tabActive === 1 && <SettingChangePassword />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
