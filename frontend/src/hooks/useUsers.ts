import { createContext, useContext } from 'react';
import ListUserModel, { IListUser } from 'src/stores/user';

const usersContext = createContext<IListUser>(ListUserModel.create());

const useUsers = () => useContext(usersContext);
export default useUsers;
