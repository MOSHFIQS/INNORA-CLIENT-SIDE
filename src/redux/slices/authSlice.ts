import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
     user: any | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     error: string | null;
}

const initialState: AuthState = {
     user: null,
     isAuthenticated: false,
     isLoading: false,
     error: null,
};

const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
          setUser(state, action: PayloadAction<any>) {
               state.user = action.payload;
               state.isAuthenticated = !!action.payload;
               state.isLoading = false;
               state.error = null;
          },
          setLoading(state, action: PayloadAction<boolean>) {
               state.isLoading = action.payload;
          },
          setError(state, action: PayloadAction<string | null>) {
               state.error = action.payload;
               state.isLoading = false;
          },
          clearAuth(state) {
               state.user = null;
               state.isAuthenticated = false;
               state.isLoading = false;
               state.error = null;
          },
          updateUser(state, action: PayloadAction<Partial<any>>) {
               if (state.user) {
                    state.user = { ...state.user, ...action.payload };
               }
          },
     },
});

export const { setUser, setLoading, setError, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
