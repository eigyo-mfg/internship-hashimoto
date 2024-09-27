'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Header() {
    const router = useRouter();
    const handleClick = async () => {
      //　サインアウト処理
      await signOut();

    };
  return (
    <div>
        <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Smart Meeting</h1>
        <div>
          <span>橋本一希（ユーザー）</span>
          <button onClick={handleClick} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
            ログアウト
          </button>
        </div>
      </header>
    </div>
  )
}
