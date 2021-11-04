import { Instance, types } from 'mobx-state-tree';

const UserModel = types
  .model({
    id: types.optional(types.number, 0),
    username: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    confirm: types.optional(types.string, ''),
    fullname: types.optional(types.string, ''),
    gender: types.optional(types.string, ''),
  })
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    setUsername: (value: string) => {
      self.username = value;
    },
    setEmail: (value: string) => {
      self.email = value;
    },
    setPassword: (value: string) => {
      self.password = value;
    },
    setConfirm: (value: string) => {
      self.confirm = value;
    },
    setFullname: (value: string) => {
      self.fullname = value;
    },
    setGender: (value: string) => {
      self.gender = value;
    },
  }));

export interface IUser extends Instance<typeof UserModel> {}
export default UserModel;
