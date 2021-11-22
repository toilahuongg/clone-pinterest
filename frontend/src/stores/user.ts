import { applySnapshot, Instance, SnapshotOut, types, flow } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import instance from 'src/helpers/instance';

export const UserModel = types
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
  .volatile<{ isLoading: boolean; fetched: boolean }>(() => ({ isLoading: false, fetched: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    setFetched: (value: boolean) => {
      self.fetched = value;
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
    getUser: flow(function* (value: string | number, isUsername: boolean) {
      self.detailUser.setLoading(true);
      try {
        let response;
        if (isUsername) {
          response = yield instance.get(`/user/${value}`);
        } else {
          response = yield instance.get(`/user/id/${value}`);
        }
        applySnapshot(self.detailUser, response.data);
        self.detailUser.setFetched(true);
      } finally {
        self.detailUser.setLoading(false);
      }
    }),
  }));

export interface IUser extends Instance<typeof UserModel> {}
export interface IUserOut extends SnapshotOut<typeof UserModel> {}
export interface IListUser extends Instance<typeof ListUserModel> {}

const userContext = createContext<IUser>(UserModel.create());
const useUser = () => useContext(userContext);

const usersContext = createContext<IListUser>(ListUserModel.create());
const useUsers = () => useContext(usersContext);
export { useUser, useUsers, ListUserModel };
