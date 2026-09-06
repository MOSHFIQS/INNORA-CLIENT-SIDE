import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/authSlice';
import { baseApi } from '@/redux/api/baseApi';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

export const makeStore = (preloadedUser?: any) => {
     let user = preloadedUser;

     if (!user && typeof window !== 'undefined') {
          const match = document.cookie.match(/(^| )user_session=([^;]+)/);
          if (match) {
               try {
                    user = JSON.parse(decodeURIComponent(match[2]));
               } catch {
                    // ignore parsing errors
               }
          }
     }

     const preloadedState = user
          ? {
                 auth: {
                      user,
                      isAuthenticated: true,
                      isLoading: false,
                      error: null,
                 },
            }
          : undefined;

     return configureStore({
          reducer: {
               auth: authReducer,
               [baseApi.reducerPath]: baseApi.reducer,
          },
          middleware: (getDefaultMiddleware) =>
               getDefaultMiddleware().concat(baseApi.middleware),
          preloadedState,
     });
};

const defaultStore = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof defaultStore.getState>;
export type AppDispatch = typeof defaultStore.dispatch;

let clientStore: AppStore | null = null;

export const getClientStore = (preloadedUser?: any): AppStore => {
     if (typeof window === 'undefined') {
          return makeStore(preloadedUser);
     }
     if (!clientStore) {
          clientStore = makeStore(preloadedUser);
     }
     return clientStore;
};

export const store = new Proxy({} as AppStore, {
     get(target, prop, receiver) {
          const activeStore = getClientStore();
          const value = Reflect.get(activeStore, prop, receiver);
          if (typeof value === 'function') {
               return value.bind(activeStore);
          }
          return value;
     },
});

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



