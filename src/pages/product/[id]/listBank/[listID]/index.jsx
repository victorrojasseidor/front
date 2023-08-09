import React from 'react'
import { useRouter } from 'next/router';
import LayoutProducts from '@/Components/LayoutProducts';



export default function ListId() {
    const router = useRouter();
    const { listID } = router.query;
  return (
    <LayoutProducts>

<div>
      id de la lista  {listID}
    </div>
    </LayoutProducts>
   
  )
}
