import { createSlice } from '@reduxjs/toolkit';

const initialState = {
     user: null,
     isAuthenticated: false,
     isLoading: true,
     error: null,
};

const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
          setUser(state, action) {
               state.user = action.payload;
               state.isAuthenticated = !!action.payload;
               state.isLoading = false;
               state.error = null;
          },
          setLoading(state, action) {
               state.isLoading = action.payload;
          },
          setError(state, action) {
               state.error = action.payload;
               state.isLoading = false;
          },
          clearAuth(state) {
               state.user = null;
               state.isAuthenticated = false;
               state.isLoading = false;
               state.error = null;
          },
          updateUser(state, action) {
               if (state.user) {
                    state.user = { ...state.user, ...action.payload };
               }
          },
     },
});

export const { setUser, setLoading, setError, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
