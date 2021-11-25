import { flow } from 'mobx';
import { applySnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import instance from 'src/helpers/instance';

import { IPinModelOut, PinModel } from './pin';

const CollectionModel = types
  .model({
    id: types.optional(types.number, 0),
    title: types.optional(types.string, ''),
    isPublic: types.optional(types.boolean, false),
    user_id: types.optional(types.number, 0),
    slug: types.optional(types.string, ''),
    pins: types.optional(types.array(PinModel), []),
    listPinIds: types.optional(types.array(types.number), []),
    createdAt: types.optional(types.string, ''),
  })
  .volatile<{ isLoading: boolean; fetched: boolean; typeForm: 'add' | 'edit' }>(() => ({
    isLoading: false,
    fetched: false,
    typeForm: 'add',
  }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    setFetched: (value: boolean) => {
      self.fetched = value;
    },
    setTypeForm: (value: 'add' | 'edit') => {
      self.typeForm = value;
    },
    setTitle: (value: string) => {
      self.title = value;
    },
    setPublic: (value: boolean) => {
      self.isPublic = value;
    },
    addPin: (data: IPinModelOut) => {
      self.pins.unshift(data);
      self.listPinIds.unshift(data.id);
    },
    editPin: (id: number, data: IPinModelOut) => {
      const idx = self.pins.findIndex((pin) => pin.id === id);
      if (idx > 0) applySnapshot(self.pins[idx], data);
    },
    deletePin: (id: number) => {
      const idx = self.pins.findIndex((pin) => pin.id === id);
      const idx2 = self.listPinIds.findIndex((curr) => curr === id);
      if (idx >= 0) self.pins.splice(idx, 1);
      if (idx2 >= 0) self.listPinIds.splice(idx2, 1);
    },
  }));
interface ICollectionModel extends Instance<typeof CollectionModel> {}
interface ICollectionModelOut extends SnapshotOut<typeof CollectionModel> {}
export const ListCollectionModel = types
  .model({
    detailCollection: types.optional(CollectionModel, {}),
    listCollection: types.array(CollectionModel),
  })
  .volatile<{ isModalShowFormCollection: boolean; isModalShowDeleteCollection: boolean; isLoading: boolean }>(() => ({
    isModalShowFormCollection: false,
    isModalShowDeleteCollection: false,
    isLoading: false,
  }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    toggleModalShowFormCollection: () => {
      applySnapshot(self.detailCollection, {});
      self.isModalShowFormCollection = !self.isModalShowFormCollection;
    },
    toggleModalShowDeleteCollection: () => {
      applySnapshot(self.detailCollection, {});
      self.isModalShowDeleteCollection = !self.isModalShowDeleteCollection;
    },
    addCollection: (collection: ICollectionModelOut) => {
      self.listCollection.unshift(collection);
    },
    editCollection: (collection: ICollectionModelOut) => {
      const idx = self.listCollection.findIndex((item) => item.id === collection.id);
      if (idx >= 0) applySnapshot(self.listCollection[idx], collection);
    },
    deleteCollection: (id: number) => {
      const idx = self.listCollection.findIndex((item) => item.id === id);
      if (idx >= 0) self.listCollection.splice(idx, 1);
    },
    getListCollection: flow(function* (userId: number) {
      if (self.listCollection.length === 0 || self.listCollection[0]?.user_id !== userId) {
        const response = yield instance.get(`/user/${userId}/collection`);
        if (response.data?.length > 0) applySnapshot(self.listCollection, response.data);
      }
    }),
    addPin: (id: number, pin: IPinModelOut) => {
      const idx = self.listCollection.findIndex((item) => item.id === id);
      if (idx >= 0) self.listCollection[idx].addPin(pin);
    },
    editPin: (cId: number, pId: number, pin: IPinModelOut) => {
      const idx = self.listCollection.findIndex((item) => item.id === cId);
      if (idx >= 0) self.listCollection[idx].editPin(pId, pin);
    },
    deletePin: (cId: number, pId: number) => {
      const idx = self.listCollection.findIndex((item) => item.id === cId);
      if (idx >= 0) self.listCollection[idx].deletePin(pId);
    },
  }));

interface IListCollectionModel extends Instance<typeof ListCollectionModel> {}

const CollectionModelContext = createContext<ICollectionModel>(CollectionModel.create());
const useCollection = () => useContext(CollectionModelContext);

const ListCollectionModelContext = createContext<IListCollectionModel>(ListCollectionModel.create());
const useCollections = () => useContext(ListCollectionModelContext);
export { useCollection, useCollections };
