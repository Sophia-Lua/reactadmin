import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebar: {
    opened: !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
    withoutAnimation: false,
  },
  device: 'desktop',
  size: 'middle',
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.opened = !state.sidebar.opened
    },
    closeSidebar: (state) => {
      state.sidebar.opened = false
    },
    toggleDevice: (state, action) => {
      state.device = action.payload
    },
    setSize: (state, action) => {
      state.size = action.payload
    },
  },
})

export const { toggleSidebar, closeSidebar, toggleDevice, setSize } = appSlice.actions
export default appSlice.reducer
