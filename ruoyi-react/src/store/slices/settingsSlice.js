import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  title: '',
  theme: '#409EFF',
  sideTheme: 'theme-dark',
  showSettings: false,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true,
  dynamicTitle: true,
  layout: 'topNav',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action) => {
      const { key, value } = action.payload
      if (key in state) {
        state[key] = value
      }
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings
    },
  },
})

export const { changeSetting, toggleSettings } = settingsSlice.actions
export default settingsSlice.reducer
