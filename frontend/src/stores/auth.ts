import { Instance, types } from 'mobx-state-tree';

const AuthModel = types
  .model({ isAuth: types.optional(types.boolean, !!window.localStorage.getItem('token')) })
  .actions((self) => ({
    setAuth: (value: boolean) => {
      self.isAuth = value;
    },
    setToken: (value: string) => {
      window.localStorage.setItem('token', value);
      self.isAuth = !!value;
    },
  }));
export interface IAuth extends Instance<typeof AuthModel> {}
export default AuthModel;
