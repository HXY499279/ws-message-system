import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface withAdminGroupList {
  data: any;
  message: string;
}
interface withAdminGroupListAndLoading extends withAdminGroupList {
  loading: boolean;
}

const initialState: withAdminGroupListAndLoading = {
  loading: true,
  data: [],
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getWithAdminGroupListAC = createAsyncThunk(
  "withAdminGroupList/getWithAdminGroupListAC",
  async (adminId: string) => {
    const { data, message } = await httpUtil.getGroupListWithAdmin({ adminId });
    return { data, message };
  }
);

export const withAdminGroupListSlice = createSlice({
  name: "withAdminGroupList",
  initialState,
  reducers: {
    addWithAdminGroupList(state, action) {
      state.data.push(action.payload);
    },
    deleteWithAdminGroupList(state, action) {
      state.data = state.data.filter((member: any) => {
        return member.groupId != action.payload.groupId;
      });
    },
    changeWithAdminGroupList(state, action) {
      for (let item of state.data) {
        if (item.creatorId == action.payload.userId) {
          [item.creatorName = item.creatorName] = [action.payload.userName];
          break;
        }
      }
    },
  },
  extraReducers: {
    [getWithAdminGroupListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getWithAdminGroupListAC.fulfilled.type]: (
      state,
      action: PayloadAction<withAdminGroupList>
    ) => {
      [state.loading, state.data, state.message] = [
        false,
        action.payload.data,
        action.payload.message,
      ];
    },
    [getWithAdminGroupListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  addWithAdminGroupList: addWithAdminGroupListAC,
  deleteWithAdminGroupList: deleteWithAdminGroupListAC,
  changeWithAdminGroupList: changeWithAdminGroupListAC,
} = withAdminGroupListSlice.actions;
