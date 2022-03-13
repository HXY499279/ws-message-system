import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface GroupList {
  data: any;
  message: string;
}
interface GroupListAndLoading extends GroupList {
  loading: boolean;
}

const initialState: GroupListAndLoading = {
  loading: true,
  data: null,
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getGroupListAC = createAsyncThunk(
  "groupList/getGroupListAC",
  async (adminId: string) => {
    const { data, message } = await httpUtil.getGroupList({ adminId });
    return { data, message };
  }
);

export const groupListSlice = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    addGroupList(state, action) {
      state.data.push(action.payload);
    },
    deleteGroupList(state, action) {
      state.data = state.data.filter((member: any) => {
        return member.groupId != action.payload.groupId;
      });
    },
  },
  extraReducers: {
    [getGroupListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getGroupListAC.fulfilled.type]: (
      state,
      action: PayloadAction<GroupList>
    ) => {
      [state.loading, state.data, state.message] = [
        false,
        action.payload.data,
        action.payload.message,
      ];
    },
    [getGroupListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  addGroupList: addGroupListAC,
  deleteGroupList: deleteGroupListAC,
} = groupListSlice.actions;
