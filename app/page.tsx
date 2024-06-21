import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function Page() {  
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if(data?.user) {
    redirect('/dashboard')
  }
  
  return (
    <main className="">
      
    </main>
  );
}
