import { useState } from 'react';

import Modal from '../Layout/Modal';

const Playground = () => {
  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);
  return (
    <>
      <button type="button" onClick={toggleActive}>
        Click!
      </button>
      <Modal isShow={isActive} onClose={toggleActive}>
        hi
      </Modal>
    </>
  );
};
export default Playground;
