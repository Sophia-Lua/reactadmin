import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listMenus } from '@/api/menu'

const initialState = {
  routes: [],
  addRoutes: [],
  defaultRoutes: [],
  topbarRouters: [],
  sidebarRouters: [],
}

export const getRouters = createAsyncThunk(
  'permission/getRouters',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listMenus()
      return res.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      state.addRoutes = action.payload
      state.routes = state.defaultRoutes.concat(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRouters.fulfilled, (state, action) => {
      const sdata = action.payload
      state.topbarRouters = sdata
      state.sidebarRouters = sdata
    })
  },
})

export const { setRoutes } = permissionSlice.actions
export default permissionSlice.reducer
