import { createSlice } from '@reduxjs/toolkit'

export const navbar_slice = createSlice({
  name: 'nav_name',
  initialState: {
    value: 'Categories',
  },
  reducers: {
    change_nav_value: (state,action) => {
      state.value = action.payload
    },
  },
})



// Action creators are generated for each case reducer function
export const { change_nav_value} = navbar_slice.actions


export default navbar_slice.reducer