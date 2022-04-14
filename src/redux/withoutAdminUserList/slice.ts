import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface withoutAdminUserList {
  deleteResult: any;
  nodeleteResult: any;
  message: string;
}
interface UserListAndLoading extends withoutAdminUserList {
  loading: boolean;
}

const initialState: UserListAndLoading = {
  loading: true,
  deleteResult: [],
  nodeleteResult: [],
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getWithoutAdminUserListAC = createAsyncThunk(
  "withoutAdminUserList/getWithoutAdminUserListAC",
  async () => {
    const { data, message } = await httpUtil.getUserListWithoutAdmin();
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

export const withoutAdminUserListSlice = createSlice({
  name: "withoutAdminUserList",
  initialState,
  reducers: {
    addWithoutAdminUserList(state, action) {
      if (action.payload.showStatus) {
        state.deleteResult.push(action.payload);
      } else {
        state.nodeleteResult.push(action.payload);
      }
    },
    deleteWithoutAdminUserList(state, action) {
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
  },
  extraReducers: {
    [getWithoutAdminUserListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getWithoutAdminUserListAC.fulfilled.type]: (
      state,
      action: PayloadAction<withoutAdminUserList>
    ) => {
      [state.loading, state.deleteResult, state.nodeleteResult, state.message] =
        [
          false,
          action.payload.deleteResult,
          action.payload.nodeleteResult,
          action.payload.message,
        ];
    },
    [getWithoutAdminUserListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  addWithoutAdminUserList: addWithoutAdminUserListAC,
  deleteWithoutAdminUserList: deleteWithoutAdminUserListAC,
} = withoutAdminUserListSlice.actions;
