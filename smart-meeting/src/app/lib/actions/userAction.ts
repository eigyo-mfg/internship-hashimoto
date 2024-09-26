'use server'

import { signIn } from "next-auth/react";
export function login(userId: string, password: string) {
    signIn("credentials", {
        userId: userId,
        password: password,
        callbackUrl: "/",
    }).catch((error) => {
        console.error("ログインに失敗しました");
        throw error
    }).then((response) => {
        if (response?.error) {
            console.error("ログインに失敗しました");
            throw Error(response.error)
        } else {
            console.log("ログインしました");
        }
    }  
    )
}
