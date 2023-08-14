import React from 'react'
import LayoutConfig from '@/Components/CompProducts/LayoutConfig'
import { useRouter } from 'next/router';
// ?iIdProdEnv=5&iId=1

export default function index () {

  const router = useRouter();
  const { idconfig, arrayParam } = router.query;


  let parsedArray = [];
  if (arrayParam) {
    try {
      parsedArray = JSON.parse(arrayParam);
    } catch (error) {
      console.error('Error parsing arrayParam:', error);
    }
  }

  console.log(parsedArray);

  return (
    <LayoutConfig id={1} iIdProdEnv={5} defaultTab={1}>

      id configurations 

    </LayoutConfig>

  )
}
