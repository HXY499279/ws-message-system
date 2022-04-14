import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface withoutAdminGroupList {
  data: any;
  message: string;
}
interface GroupListAndLoading extends withoutAdminGroupList {
  loading: boolean;
}

const initialState: GroupListAndLoading = {
  loading: true,
  data: [],
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getWithoutAdminGroupListAC = createAsyncThunk(
  "withoutAdminGroupList/getWithoutAdminGroupListAC",
  async () => {
    const { data, message } = await httpUtil.getGroupListWithoutAdmin();
    return { data, message };
  }
);

export const withoutAdminGroupListSlice = createSlice({
  name: "withoutAdminGroupList",
  initialState,
  reducers: {
    addWithoutAdminGroupList(state, action) {
      state.data.push(action.payload);
    },
    deleteWithoutAdminGroupList(state, action) {
      state.data = state.data.filter((member: any) => {
        return member.groupId != action.payload.groupId;
      });
    },
  },
  extraReducers: {
    [getWithoutAdminGroupListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getWithoutAdminGroupListAC.fulfilled.type]: (
      state,
      action: PayloadAction<withoutAdminGroupList>
    ) => {
      [state.loading, state.data, state.message] = [
        false,
        action.payload.data,
        action.payload.message,
      ];
    },
    [getWithoutAdminGroupListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  addWithoutAdminGroupList: addWithoutAdminGroupListAC,
  deleteWithoutAdminGroupList: deleteWithoutAdminGroupListAC,
} = withoutAdminGroupListSlice.actions;
