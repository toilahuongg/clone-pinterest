import { createContext, useContext } from 'react';
import AuthModel, { IAuth } from 'src/stores/auth';

const authContext = createContext<IAuth>(AuthModel.create());

const useAuth = () => useContext(authContext);
export default useAuth;
