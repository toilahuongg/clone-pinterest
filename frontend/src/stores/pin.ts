// eslint-disable-next-line
import { applySnapshot, cast, Instance, SnapshotOut, types, flow } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import instance from 'src/helpers/instance';

const PinModel = types
  .model({
    id: types.optional(types.number, 0),
    title: types.optional(types.string, ''),
    content: types.optional(types.string, ''),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    featuredImage: types.optional(types.string, ''),
    user_id: types.optional(types.number, 0),
    slug: types.optional(types.string, ''),
    link: types.maybeNull(types.string),
    createdAt: types.optional(types.string, ''),
  })
  .volatile<{ isLoading: boolean; typeForm: 'add' | 'edit' }>(() => ({ isLoading: false, typeForm: 'add' }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    setTypeForm: (value: 'add' | 'edit') => {
      self.typeForm = value;
    },
    setTitle: (value: string) => {
      self.title = value;
    },
    setContent: (value: string) => {
      self.content = value;
    },
    setFeaturedImage: (value: string) => {
      self.featuredImage = value;
    },
    setLink: (value: string) => {
      self.link = value;
    },
  }));
export interface IPinModel extends Instance<typeof PinModel> {}
export interface IPinModelOut extends SnapshotOut<typeof PinModel> {}

export const ListPinModel = types
  .model({
    detailPin: types.optional(PinModel, {}),
    listPin: types.array(PinModel),
    countPin: types.optional(types.number, 0),
    page: types.optional(types.number, 0),
    title: types.optional(types.string, ''),
  })
  .volatile<{
    isLoading: boolean;
    isModalShowFormPin: boolean;
    isModalShowDeletePin: boolean;
    isModalShowAddPinToCollection: boolean;
    typeForm: 'add' | 'edit';
  }>(() => ({
    isLoading: false,
    isModalShowFormPin: false,
    isModalShowDeletePin: false,
    isModalShowAddPinToCollection: false,
    typeForm: 'add',
  }))
  .actions((self) => ({
    setTitle: (value: string) => {
      self.title = value;
    },
    setPage: (value: number) => {
      self.page = value;
    },
    incrementPage: () => {
      if (!self.isLoading) self.page += 1;
    },
    setCountPin: (value: number) => {
      self.countPin = value;
    },
    getPins: flow(function* (title: string, slug?: string, isShuffle: boolean = false) {
      // eslint-disable-next-line
      const response = yield instance.get(slug ? `/collection/${slug}/pins` : '/pin', {params: { page: self.page, title },});
      const { count, pins } = response.data;
      self.countPin = count;
      if (isShuffle) pins.sort(() => 0.5 - Math.random());
      if (self.listPin.length < count) {
        self.listPin = cast([...self.listPin, ...pins]);
      }
    }),
    setTypeForm: (value: 'add' | 'edit') => {
      self.typeForm = value;
    },
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    toggleModalShowFormPin: () => {
      applySnapshot(self.detailPin, {});
      self.isModalShowFormPin = !self.isModalShowFormPin;
    },
    toggleModalShowDeletePin: () => {
      applySnapshot(self.detailPin, {});
      self.isModalShowDeletePin = !self.isModalShowDeletePin;
    },
    toggleModalShowAddPinToCollection: () => {
      self.isModalShowAddPinToCollection = !self.isModalShowAddPinToCollection;
    },
    deletePin: (id: number) => {
      const idx = self.listPin.findIndex((pin) => pin.id === id);
      if (idx >= 0) self.listPin.splice(idx, 1);
    },
  }));

export interface IListPinModel extends Instance<typeof ListPinModel> {}
export interface IListPinModelOut extends SnapshotOut<typeof ListPinModel> {}

const PinModelContext = createContext<IPinModel>(PinModel.create());
const usePin = () => useContext(PinModelContext);

const ListPinModelContext = createContext<IListPinModel>(ListPinModel.create());
const usePins = () => useContext(ListPinModelContext);
export { PinModel, usePin, usePins };
