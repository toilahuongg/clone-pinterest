import React, { useState } from 'react';

import SettingChangePassword from './SettingChangePassword';
import SettingInfomation from './SettingInfomation';
import styles from './settings.module.scss';

const Settings = () => {
  const [tabActive, setTabActive] = useState<number>(0);
  return (
    <div className={styles.settings}>
      <div className={styles.tabDirection}>
        <ul>
          <li role="presentation" onClick={() => setTabActive(0)}>
            Thông tin cá nhân
          </li>
          <li role="presentation" onClick={() => setTabActive(1)}>
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
