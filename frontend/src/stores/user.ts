import { applySnapshot, Instance, SnapshotOut, types, flow } from 'mobx-state-tree';
import instance from 'src/helpers/instance';

const UserModel = types
  .model({
    id: types.optional(types.number, 0),
    username: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    fullname: types.optional(types.string, ''),
    gender: types.optional(types.string, ''),
    introduce: types.maybeNull(types.string),
    avatar: types.maybeNull(types.string),
    cover: types.maybeNull(types.string),
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
    setFullname: (value: string) => {
      self.fullname = value;
    },
    setGender: (value: string) => {
      self.gender = value;
    },
    setIntroduce: (value: string) => {
      self.introduce = value;
    },
    setAvatar: (value: string) => {
      self.avatar = value;
    },
    setCover: (value: string) => {
      self.cover = value;
    },
  }));

const ListUserModel = types
  .model({
    detailUser: types.optional(UserModel, {}),
    listUser: types.array(UserModel),
  })
  .actions((self) => ({
    setDetailUser(data: IUserOut) {
      applySnapshot(self.detailUser, data);
    },
    getUser: flow(function* () {
      const response = yield instance.get('/user/info');
      applySnapshot(self.detailUser, response.data);
    }),
  }));

export interface IUser extends Instance<typeof UserModel> {}
export interface IUserOut extends SnapshotOut<typeof UserModel> {}
export interface IListUser extends Instance<typeof ListUserModel> {}
export default ListUserModel;
