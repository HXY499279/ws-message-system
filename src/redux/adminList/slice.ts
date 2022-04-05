import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface AdminList {
  data: any;
  message: string;
}
interface AdminListAndLoading extends AdminList {
  loading: boolean;
}

const initialState: AdminListAndLoading = {
  loading: true,
  data: null,
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getAdminListAC = createAsyncThunk(
  "adminList/getAdminListAC",
  async () => {
    const { data, message } = await httpUtil.getAdminList();
    return { data, message };
  }
);

export const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    addAdminList(state, action) {
      state.data.push(action.payload);
    },
    deleteAdminList(state, action) {
      state.data = state.data.filter((admin: any) => {
        return admin.adminId != action.payload.adminId;
      });
    },
    changeAdminList(state, action) {
      for (let [i, item] of Object.entries<any>(state.data)) {
        item.adminId === action.payload.adminId &&
          (state.data[i] = action.payload);
      }
    },
  },
  extraReducers: {
    [getAdminListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getAdminListAC.fulfilled.type]: (
      state,
      action: PayloadAction<AdminList>
    ) => {
      [state.loading, state.data, state.message] = [
        false,
        action.payload.data,
        action.payload.message,
      ];
    },
    [getAdminListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const addAdminListAC = adminListSlice.actions.addAdminList;
export const deleteAdminListAC = adminListSlice.actions.deleteAdminList;
export const changeAdminListAC = adminListSlice.actions.changeAdminList;
