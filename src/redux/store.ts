import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import {
  userInfoSlice,
  groupListSlice,
  memberListSlice,
  chatListSlice,
} from "./reducers";

const rootReducer = combineReducers({
  userInfo: userInfoSlice.reducer,
  groupList: groupListSlice.reducer,
  memberList: memberListSlice.reducer,
  chatList: chatListSlice.reducer,
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
