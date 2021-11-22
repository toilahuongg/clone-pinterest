import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';

import { UserModel } from './user';

const CommentModel = types
  .model({
    id: types.optional(types.number, 0),
    content: types.optional(types.string, ''),
    user_id: types.optional(types.number, 0),
    pin_id: types.optional(types.number, 0),
    user: types.optional(UserModel, {}),
  })
  .volatile<{ isLoading: boolean }>(() => ({ isLoading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    setContent: (value: string) => {
      self.content = value;
    },
  }));
const ListCommentModel = types
  .model({
    detailComment: types.optional(CommentModel, {}),
    listComment: types.array(CommentModel),
  })
  .volatile<{ isLoading: boolean }>(() => ({ isLoading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.isLoading = value;
    },
    addComment: (data: TCommentOut) => {
      self.listComment.unshift(data);
    },
  }));
export type TComment = Instance<typeof CommentModel>;
export type TListComment = Instance<typeof ListCommentModel>;
export type TCommentOut = SnapshotOut<typeof CommentModel>;
const ListCommentContext = createContext<TListComment>(ListCommentModel.create());
const useComments = () => useContext(ListCommentContext);
export default useComments;
