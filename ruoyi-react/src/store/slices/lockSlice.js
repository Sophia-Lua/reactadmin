import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
  isLock: Cookies.get('lock') === 'true',
  lockCode: Cookies.get('lockCode') || '',
  lockTime: Cookies.get('lockTime') || '',
}

const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    setLock: (state, action) => {
      state.isLock = true
      state.lockCode = action.payload.code
      state.lockTime = action.payload.time
      Cookies.set('lock', 'true')
      Cookies.set('lockCode', action.payload.code)
      Cookies.set('lockTime', action.payload.time)
    },
    unLock: (state) => {
      state.isLock = false
      state.lockCode = ''
      state.lockTime = ''
      Cookies.remove('lock')
      Cookies.remove('lockCode')
      Cookies.remove('lockTime')
    },
  },
})

export const { setLock, unLock } = lockSlice.actions
export default lockSlice.reducer
