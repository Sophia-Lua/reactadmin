import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import settingsReducer from './slices/settingsSlice'
import permissionReducer from './slices/permissionSlice'
import tagsViewReducer from './slices/tagsViewSlice'
import dictReducer from './slices/dictSlice'
import lockReducer from './slices/lockSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    settings: settingsReducer,
    permission: permissionReducer,
    tagsView: tagsViewReducer,
    dict: dictReducer,
    lock: lockReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
