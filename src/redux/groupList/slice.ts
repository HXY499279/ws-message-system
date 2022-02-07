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
  async () => {
    const { data, message } = await httpUtil.getGroupList();
    return { data, message };
  }
);

export const groupListSlice = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    updateGroupList(state, action) {
      state.data.push(action.payload);
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

export const updateGroupListAC = groupListSlice.actions.updateGroupList;
