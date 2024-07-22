import { createSlice } from "@reduxjs/toolkit";

const initialState = "Sample notification";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify(state, action) {
      return action.payload;
    },
    remove(state, action) {
      return null;
    },
  },
});

const { notify, remove } = notificationSlice.actions;

export const addNotification = (notification, timeoutInSeconds) => {
  return (dispatch) => {
    dispatch(notify(notification));
    setTimeout(() => {
      dispatch(remove());
    }, timeoutInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
