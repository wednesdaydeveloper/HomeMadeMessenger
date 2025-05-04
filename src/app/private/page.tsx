import { createClient } from '@/utils/supabase/server'
import { User } from '@supabase/supabase-js'

const PrivatePage = async () => {
  const supabase = await createClient()
  const { data }: { data: { user: User | null } } = await supabase.auth.getUser()
  return (
    <div>
      <p>Hello {data.user?.email}</p>
    </div>
  )
}
export default PrivatePage