import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface withAdminUserList {
  deleteResult: any;
  nodeleteResult: any;
  message: string;
}
interface UserListAndLoading extends withAdminUserList {
  loading: boolean;
}

const initialState: UserListAndLoading = {
  loading: true,
  deleteResult: [],
  nodeleteResult: [],
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getWithAdminUserListAC = createAsyncThunk(
  "withAdminUserList/getWithAdminUserListAC",
  async (adminId: string) => {
    const { data, message } = await httpUtil.getUserListWithAdmin({ adminId });
    let deleteResult: any[] = [];
    let nodeleteResult: any[] = [];
    for (let item of data) {
      if (item.user.showStatus)
        deleteResult.push({ ...item.user, ...item.group });
      else nodeleteResult.push({ ...item.user, ...item.group });
    }
    return { deleteResult, nodeleteResult, message };
  }
);

export const withAdminUserListSlice = createSlice({
  name: "withAdminUserList",
  initialState,
  reducers: {
    addWithAdminUserList(state, action) {
      if (action.payload.showStatus) {
        state.deleteResult.push(action.payload);
      } else {
        state.nodeleteResult.push(action.payload);
      }
    },
    deleteWithAdminUserList(state, action) {
      if (action.payload.showStatus) {
        state.deleteResult = state.deleteResult.filter((member: any) => {
          return member.userId != action.payload.userId;
        });
      } else {
        state.nodeleteResult = state.nodeleteResult.filter((member: any) => {
          return member.userId != action.payload.userId;
        });
      }
    },
    changeWithAdminUserList(state, action) {
      const result = action.payload.showStatus
        ? state.deleteResult
        : state.nodeleteResult;
      result.forEach((item: any) => {
        if (item.userId === action.payload.userId) {
          [item.userName, item.password] = [
            action.payload.userName,
            action.payload.password,
          ];
        }
      });
    },
  },
  extraReducers: {
    [getWithAdminUserListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getWithAdminUserListAC.fulfilled.type]: (
      state,
      action: PayloadAction<withAdminUserList>
    ) => {
      [state.loading, state.deleteResult, state.nodeleteResult, state.message] =
        [
          false,
          action.payload.deleteResult,
          action.payload.nodeleteResult,
          action.payload.message,
        ];
    },
    [getWithAdminUserListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  addWithAdminUserList: addWithAdminUserListAC,
  deleteWithAdminUserList: deleteWithAdminUserListAC,
  changeWithAdminUserList: changeWithAdminUserListAC,
} = withAdminUserListSlice.actions;
