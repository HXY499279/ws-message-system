import { createSlice } from "@reduxjs/toolkit";

interface IsChoiceAdminVisibleType {
  IsChoiceAdminVisible: boolean;
}

const initialState: IsChoiceAdminVisibleType = {
  IsChoiceAdminVisible: false,
};

export const choiceAdminSlice = createSlice({
  name: "choiceAdmin",
  initialState,
  reducers: {
    setIsChoiceAdminVisible(state, action) {
      state.IsChoiceAdminVisible = action.payload;
    },
  },
});

export const { setIsChoiceAdminVisible: setIsChoiceAdminVisibleAC } =
  choiceAdminSlice.actions;
