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
  members: [],
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
    members.unshift(creator);
    const filterMembers = members.filter((item: any) => item);
    return { creator, members: filterMembers, message };
  }
);

export const memberListSlice = createSlice({
  name: "memberList",
  initialState,
  reducers: {
    addMemberList(state, action) {
      console.log(action.payload);
      const { userId } = action.payload;
      let hasUser = false;
      for (let user of state.members) {
        if (user.userId === userId) {
          hasUser = true;
        }
      }
      hasUser || state.members.push(action.payload);
    },
    deleteMemberList(state, action) {
      state.members = state.members.filter((member: any) => {
        return member.userId != action.payload.userId;
      });
    },
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
    },
    [getMemberListAC.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const addMemberListAC = memberListSlice.actions.addMemberList;
export const deleteMemberListAC = memberListSlice.actions.deleteMemberList;
