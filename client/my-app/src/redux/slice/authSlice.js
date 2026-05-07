import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    user:[]
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        addUser:(state,action)=>{
             state.user = action.payload
        }
    }
})

export const {addUser} = authSlice.actions
export const userData = (state)=>state.auth.user

export default authSlice.reducer