import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDicts } from '@/api/system/dict/data'

const initialState = {
  dict: {},
}

export const getDictData = createAsyncThunk(
  'dict/getDictData',
  async (dictType, { rejectWithValue }) => {
    try {
      const res = await getDicts(dictType)
      return { dictType, data: res.data || [] }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const dictSlice = createSlice({
  name: 'dict',
  initialState,
  reducers: {
    removeDict: (state, action) => {
      delete state.dict[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDictData.fulfilled, (state, action) => {
      state.dict[action.payload.dictType] = action.payload.data
    })
  },
})

export const { removeDict } = dictSlice.actions
export default dictSlice.reducer
