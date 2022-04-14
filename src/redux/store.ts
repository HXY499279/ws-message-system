import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import {
  userInfoSlice,
  withAdminGroupListSlice,
  withoutAdminGroupListSlice,
  withoutAdminUserListSlice,
  withAdminUserListSlice,
  memberListSlice,
  adminListSlice,
  chatListSlice,
  choiceAdminSlice,
} from "./reducers";

const rootReducer = combineReducers({
  userInfo: userInfoSlice.reducer,
  withAdminGroupList: withAdminGroupListSlice.reducer,
  withoutAdminGroupList: withoutAdminGroupListSlice.reducer,
  withoutAdminUserList: withoutAdminUserListSlice.reducer,
  withAdminUserList: withAdminUserListSlice.reducer,
  memberList: memberListSlice.reducer,
  adminList: adminListSlice.reducer,
  chatList: chatListSlice.reducer,
  choiceAdmin: choiceAdminSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
