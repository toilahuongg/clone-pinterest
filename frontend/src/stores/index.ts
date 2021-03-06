import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';

import { ListCollectionModel } from './collection';
import { ListPinModel } from './pin';
import { ListUserModel } from './user';

const StoreModel = types.model({
  userModel: types.optional(ListUserModel, {}),
  collectionModel: types.optional(ListCollectionModel, {}),
  pinModel: types.optional(ListPinModel, {}),
});

type TStoreModel = Instance<typeof StoreModel>;
const StoreContext = createContext<TStoreModel>(StoreModel.create());
const useStore = () => useContext(StoreContext);
export default useStore;
