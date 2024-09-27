'use client';
import "react-toastify/dist/ReactToastify.css";
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify';

export default function SomethingProvider( { children, session } : { children: React.ReactNode, session: any }) {
  return (
    <div>
              <ToastContainer position="top-left" />
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    </div>
  )
}
