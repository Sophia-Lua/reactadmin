const sessionStorage = window.sessionStorage
const localStorage = window.localStorage

const cache = {
  session: {
    get: (key) => {
      return sessionStorage.getItem(key)
    },
    set: (key, value) => {
      sessionStorage.setItem(key, value)
    },
    remove: (key) => {
      sessionStorage.removeItem(key)
    },
    clear: () => {
      sessionStorage.clear()
    },
    getJSON: (key) => {
      const value = sessionStorage.getItem(key)
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    },
    setJSON: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch {
        // ignore
      }
    },
  },
  local: {
    get: (key) => {
      return localStorage.getItem(key)
    },
    set: (key, value) => {
      localStorage.setItem(key, value)
    },
    remove: (key) => {
      localStorage.removeItem(key)
    },
    clear: () => {
      localStorage.clear()
    },
    getJSON: (key) => {
      const value = localStorage.getItem(key)
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    },
    setJSON: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // ignore
      }
    },
  },
}

export default cache
