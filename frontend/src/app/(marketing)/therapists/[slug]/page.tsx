import Theripist from '@/components/marketing/Theripist';
import { therapistApi } from '@/lib/api';
import React from 'react'

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}


const page = async({ params }: PageProps) => {
  const { slug } = await params;
      let therapists: any = null;
      try {
          therapists = await therapistApi.bySlug(slug);
      } catch (error) {
          console.error(error);
      }
  return <Theripist therapists={therapists}/>
}

export default page