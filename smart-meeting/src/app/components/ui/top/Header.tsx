'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { User } from '@/app/types/user';

export default function Header({user}: {user: User | undefined}) {
    const router = useRouter();
    const handleClick = async () => {
      //　サインアウト処理
      await signOut();

    };
    let userLine = "";
    if (!user) {
      userLine = "loading...";
    } else {
      userLine = user.lastName + " " + user.firstName + "（" + user.privilege + "）";
    }
  return (
    <div>
        <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Smart Meeting</h1>
        <div>
          <span>{userLine}</span>
          <button onClick={handleClick} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">
            ログアウト
          </button>
        </div>
      </header>
    </div>
  )
}
