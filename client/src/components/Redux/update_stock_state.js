import { createSlice } from '@reduxjs/toolkit'

export const stock_items_state = createSlice({
  name: 'change_state',
  initialState: {
    value: 1,
  },
  reducers: {
    change_stock: (state) => {
      state.value+=1
    },
  },
})



// Action creators are generated for each case reducer function
export const { change_stock} = stock_items_state.actions


export default stock_items_state.reducer