'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export function ReduxProvider({
     children,
     preloadedUser,
 }: {
     children: React.ReactNode;
     preloadedUser?: any;
 }) {
     const storeRef = useRef<AppStore | null>(null);
     if (!storeRef.current) {
          storeRef.current = makeStore(preloadedUser);
     }

     return <Provider store={storeRef.current}>{children}</Provider>;
}

export default ReduxProvider;





