import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function useremail() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

    
  return (
    <div className="flex items-center gap-4">
      {user ?user.email : "Users email"}
      
    </div>
  
  );
}


export function SignOutButton (){
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={"outline"}>
        Sign out
      </Button>
    </form>
  )
}