import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visitedViews: [],
  cachedViews: [],
  selectedTag: {},
}

const tagsViewSlice = createSlice({
  name: 'tagsView',
  initialState,
  reducers: {
    addView: (state, action) => {
      const exists = state.visitedViews.find(v => v.path === action.payload.path)
      if (!exists) {
        state.visitedViews.push(action.payload)
      }
    },
    addCachedView: (state, action) => {
      if (state.cachedViews.includes(action.payload)) return
      state.cachedViews.push(action.payload)
    },
    delView: (state, action) => {
      state.visitedViews = state.visitedViews.filter(v => v.path !== action.payload)
      state.cachedViews = state.cachedViews.filter(v => v !== action.payload)
    },
    delOthersViews: (state, action) => {
      state.visitedViews = state.visitedViews.filter(v => v.affix || v.path === action.payload)
      state.cachedViews = state.cachedViews.filter(v => v === action.payload)
    },
    delAllViews: (state) => {
      state.visitedViews = state.visitedViews.filter(v => v.affix)
      state.cachedViews = []
    },
    delLeftViews: (state, action) => {
      const index = state.visitedViews.findIndex(v => v.path === action.payload)
      if (index > -1) {
        state.visitedViews = state.visitedViews.filter((v, i) => i >= index || v.affix)
        state.cachedViews = state.cachedViews.filter(v => v === action.payload)
      }
    },
    delRightViews: (state, action) => {
      const index = state.visitedViews.findIndex(v => v.path === action.payload)
      if (index > -1) {
        state.visitedViews = state.visitedViews.filter((v, i) => i <= index || v.affix)
        state.cachedViews = state.cachedViews.filter(v => v === action.payload)
      }
    },
    updateVisitedView: (state, action) => {
      const index = state.visitedViews.findIndex(v => v.path === action.payload.path)
      if (index > -1) {
        state.visitedViews[index] = action.payload
      }
    },
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload
    },
  },
})

export const {
  addView,
  addCachedView,
  delView,
  delOthersViews,
  delAllViews,
  delLeftViews,
  delRightViews,
  updateVisitedView,
  setSelectedTag,
} = tagsViewSlice.actions

export default tagsViewSlice.reducer
