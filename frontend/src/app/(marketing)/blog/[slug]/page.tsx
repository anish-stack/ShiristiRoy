import BlogsDetails from '@/components/marketing/BlogsDetails'
import { blogApi } from '@/lib/api'
import React from 'react'

const page = async ({ params }: { params: { slug: string } }) => {
    let blog = {} as any
    try {
       blog = await blogApi.bySlug(params.slug)
    }
   catch (error) {
        
    }
    return <BlogsDetails blog={blog} />
}

export default page