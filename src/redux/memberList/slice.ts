import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import httpUtil from "../../utils/httpUtil";

interface MemberList {
  members: any;
  creator: any;
  message: string;
}
interface MemberListAndLoading extends MemberList {
  loading: boolean;
}

const initialState: MemberListAndLoading = {
  loading: true,
  members: null,
  creator: null,
  message: "",
};

// 同步的actionCreator会被createSlice自动创建，异步的actionCreator需要手动创建
export const getMemberListAC = createAsyncThunk(
  "memberList/getMemberListAC",
  async (groupId: string) => {
    const { data, message } = await httpUtil.getMemberList({
      groupId: groupId,
    });
    const { creator, members } = data;
    return { creator, members, message };
  }
);

export const memberListSlice = createSlice({
  name: "memberList",
  initialState,
  reducers: {
    updateMemberList(state, action) {},
  },
  extraReducers: {
    [getMemberListAC.pending.type]: (state) => {
      state.loading = true;
    },
    [getMemberListAC.fulfilled.type]: (
      state,
      action: PayloadAction<MemberList>
    ) => {
      [state.loading, state.members, state.creator, state.message] = [
        false,
        action.payload.members,
        action.payload.creator,
        action.payload.message,
      ];
      state.members.unshift(state.creator);
    },
    [getMemberListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const updateMemberListAC = memberListSlice.actions.updateMemberList;
