import { useState } from 'react';

import Button from '../Layout/Button';
import FormInput from '../Layout/Form/FormInput';
import Popover from '../Layout/Popover';

const Playground = () => {
  const [isActive, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!isActive);
  return (
    <>
      <FormInput label="Username" type="text" value="hello" />
      <Button variant="block-outline-primary" loading>
        Button
      </Button>
      <div style={{ width: '200px', height: '200px', background: 'white' }}>
        <span style={{ position: 'relative' }}>
          <Popover
            isShow={isActive}
            activator={
              <button type="button" onClick={toggleActive}>
                Click!
              </button>
            }
          >
            hi
          </Popover>
        </span>
      </div>
    </>
  );
};
export default Playground;
