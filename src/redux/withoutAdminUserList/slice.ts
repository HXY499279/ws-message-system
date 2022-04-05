import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface withoutAdminUserList {
  data: any;
  message: string;
}
interface UserListAndLoading extends withoutAdminUserList {
  loading: boolean;
}

const initialState: UserListAndLoading = {
  loading: true,
  data: null,
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getWithoutAdminUserListAC = createAsyncThunk(
  "withoutAdminUserList/getWithoutAdminUserListAC",
  async (isDelete: boolean) => {
    const { data, message } = await httpUtil.getUserListWithoutAdmin();
    let result: any[] = [];
    for (let item of data) {
      if (isDelete) {
        if (item.user.showStatus) result.push({ ...item.user, ...item.group });
      } else {
        if (!item.user.showStatus) result.push({ ...item.user, ...item.group });
      }
    }
    return { data: result, message };
  }
);

export const withoutAdminUserListSlice = createSlice({
  name: "withoutAdminUserList",
  initialState,
  reducers: {
    addWithoutAdminUserList(state, action) {
      state.data.push(action.payload);
    },
    deleteWithoutAdminUserList(state, action) {
      state.data = state.data.filter((member: any) => {
        return member.userId != action.payload.userId;
      });
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
      [state.loading, state.data, state.message] = [
        false,
        action.payload.data,
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
