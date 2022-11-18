import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'isauthorized',
  initialState: {
    value: false,
  },
  reducers: {
    increment: (state) => {
      state.value = true
    },
    decrement: (state) => {
      state.value = false
    },
  },
})



// Action creators are generated for each case reducer function
export const { increment, decrement} = slice.actions


export default slice.reducer