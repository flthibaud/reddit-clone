import React from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

function Avatar({ seed, large }) {
  const { data: session } = useSession()

  return (
    <div className={`relative overflow-hidden h-10 w-10 rounded-full border-gray-300 bg-white ${large && 'h-20 w-20'}`}>
      <Image
        src={`https://avatars.dicebear.com/api/open-peeps/${seed || session?.user?.name || 'placeholder'}.svg`}
        alt='Avatar'
        layout='fill'
      />
    </div>
  )
}

export default Avatar;