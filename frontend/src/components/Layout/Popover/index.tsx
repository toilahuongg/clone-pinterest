import React from 'react';
import { ArrowContainer, Popover } from 'react-tiny-popover';

import styles from './popover.module.scss';

type TProps = {
  isShow: boolean;
  activator: JSX.Element;
  children: React.ReactNode | React.ReactNode[] | string | string[];
};

const CustomPopover: React.FC<TProps> = ({ isShow, activator, children }) => {
  return (
    <Popover
      isOpen={isShow}
      padding={10}
      positions={['right', 'left', 'bottom', 'top']}
      align="start"
      containerStyle={{ top: '-15px' }}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="white"
          arrowSize={10}
          arrowStyle={{ top: '20px' }}
        >
          <div className={styles.popover}> {children} </div>
        </ArrowContainer>
      )}
    >
      {activator}
    </Popover>
  );
};

export default CustomPopover;
