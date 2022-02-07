import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface UserInfo {
  user: any;
  group: any;
  admin: any;
}

const initialState: UserInfo = {
  user: null,
  group: null,
  admin: null,
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getUserInfoAC = createAsyncThunk(
  "userInfo/getUserInfoAC",
  async () => {
    const {
      data: { user, group, admin },
    } = await httpUtil.getSessionInfo();
    const data = { user, group, admin };
    return data;
  }
);

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateMyGroup: (state, action) => {
      state.group = action.payload;
      console.log(state.group);
      
    },
  },
  extraReducers: {
    [getUserInfoAC.pending.type]: (state) => {},
    [getUserInfoAC.fulfilled.type]: (
      state,
      action: PayloadAction<UserInfo>
    ) => {
      [state.user, state.admin, state.group] = [
        action.payload.user,
        action.payload.admin,
        action.payload.group,
      ];
    },
    [getUserInfoAC.rejected.type]: (state, action) => {},
  },
});

export const updateMyGroupAC = userInfoSlice.actions.updateMyGroup