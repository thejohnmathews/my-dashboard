// app/page.tsx
// landing page, for this project, redirect to login/dashboard depending on auth state

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient";


// landing page
export default function Home() {

  const router = useRouter();

  useEffect(() => {
    async function redirectUser(){

      const {data} = await supabase.auth.getUser();
      if (data.user) router.push('/dashboard');
      else router.push('/login');
    }

    redirectUser();

  }, [router]);

  return(<p className = "text-center mt-10 text-gray-500">Redirecting ...</p>)
}