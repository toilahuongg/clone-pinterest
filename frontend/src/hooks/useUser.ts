import { createContext, useContext } from 'react';
import UserModel, { IUser } from 'src/stores/user';

const userContext = createContext<IUser>(UserModel.create());

const useUser = () => useContext(userContext);
export default useUser;
