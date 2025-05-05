import SignOutLink from "@/components/auth/SignOutLink"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"

const Header = async () => {
  const supabase = await createClient()

  const isLoggedIn = async () => {
    const { data: { user } }: { data: { user: User | null } } = await supabase.auth.getUser()
    console.log('Header user: ' + JSON.stringify(user))
    return user !== null
  }
  return (
    <header className="text-black shadow-md">
      <div className="container mx-auto px-3 py-4 flex justify-between items-center">
        {/* メニューバー（画面サイズがlg以上の時) */}
        <nav className="hidden lg:flex space-x-8">
          {(await isLoggedIn()) && <SignOutLink />}
        </nav>
      </div>
    </header>
  )
}

export default Header
