'use client'

import React from 'react'
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Form = {
    userId: string;
    password: string;
    };


export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm<Form>()

      async function submit (data: Form) {

        const response = await signIn("credentials", {
          redirect: false,
          id: data.userId,
          password: data.password,
        });
        if (response?.ok) {
          router.replace("/");
        } else {
          toast.error("ログインに失敗しました");
        }
        
      }
  return (
    <div>
        <form onSubmit={handleSubmit(submit)}>
        {/* User ID Input */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">ユーザーID</label>
          <input
            {...register("userId", {
              required: "ユーザーIDを入力してください", 
              validate: (value) => value.length === 8 || "ユーザーIDを8桁で入力してください"
            })}
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ユーザーIDを入力"
          />
            {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">パスワード</label>
          <input
          {...register("password", {
                required: "パスワードを入力してください",
                minLength: {
                    value: 8,
                    message: "パスワードは8文字以上で入力してください",
                    },
                maxLength: {
                    value: 16,
                    message: "パスワードは16文字以下で入力してください",
                    },
                }
            )
          }
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="パスワードを入力"
          />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>} 
        </div>

        {/* Submit Button */}
        <button  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          ログイン
        </button>
      </form>
      </div>

  )
}
