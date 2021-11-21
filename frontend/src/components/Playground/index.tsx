import { useState } from 'react';

import Button from '../Layout/Button';
import Dropdown from '../Layout/Dropdown';
import FormInput from '../Layout/Form/FormInput';

const Playground = () => {
  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);
  return (
    <>
      <FormInput label="Username" type="text" value="hello" />
      <Button variant="block-outline-primary" loading>
        Button
      </Button>
      <Dropdown
        isShow={isActive}
        activator={
          <button type="button" onClick={toggleActive}>
            Click!
          </button>
        }
        onClose={toggleActive}
      >
        hi
      </Dropdown>
    </>
  );
};
export default Playground;
