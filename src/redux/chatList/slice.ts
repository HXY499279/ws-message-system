import { createSlice } from "@reduxjs/toolkit";

export type ChatData = { type: number; data: any[] };

interface ChatList {
  data: ChatData[];
}

const initialState: ChatList = {
  data: [],
};

export const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    updateChatList(state, action) {
      state.data.push(action.payload);
    },
  },
});

export const updateChatListAC = chatListSlice.actions.updateChatList;
