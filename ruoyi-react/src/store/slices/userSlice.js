import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const initialState = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: [],
}

export const loginAction = createAsyncThunk(
  'user/login',
  async (loginForm, { rejectWithValue }) => {
    try {
      const res = await login(loginForm)
      setToken(res.token)
      return res.token
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getInfoAction = createAsyncThunk(
  'user/getInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getInfo()
      return {
        user: res.user,
        roles: res.roles,
        permissions: res.permissions,
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutAction = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout()
      removeToken()
    } catch {
      removeToken()
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAvatar: (state, action) => {
      state.avatar = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        state.token = action.payload
      })
      .addCase(getInfoAction.fulfilled, (state, action) => {
        state.name = action.payload.user.userName
        state.avatar = action.payload.user.avatar
        state.roles = action.payload.roles
        state.permissions = action.payload.permissions
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.token = null
        state.name = ''
        state.avatar = ''
        state.roles = []
        state.permissions = []
      })
  },
})

export const { setAvatar } = userSlice.actions
export default userSlice.reducer
