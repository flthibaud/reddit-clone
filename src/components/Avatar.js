import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

function Avatar({ seed, large }) {
  const { data: session } = useSession()
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    async function getUserImage() {
      const res = await fetch(`https://www.reddit.com/user/${session?.user?.name}/about.json`)
      const data = await res.json()
      
      if (data.data.snoovatar_img) {
        setAvatar(data.data.snoovatar_img)
      } else {
        setAvatar(data.data.icon_img)
      }
    }

    getUserImage()
  }, [session])

  return (
    <div className={`relative overflow-hidden h-10 w-10 rounded-full border-gray-300 bg-white ${large && 'h-20 w-20'}`}>
      <Image
        src={avatar || `https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`}
        alt='Avatar'
        layout='fill'
      />
    </div>
  )
}

export default Avatar;