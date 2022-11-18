import { configureStore } from '@reduxjs/toolkit'
import auth from './slice'
import state_value from './update_stock_state'
import nav_value from './navbar_slice'

export default configureStore({
  reducer: {
    isauthorized: auth,
    change_state:state_value,
    nav_name: nav_value
  },
})