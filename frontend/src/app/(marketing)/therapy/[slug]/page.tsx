import TherapyAction from '@/components/marketing/therepies_action'
import React from 'react'

interface PageProps {
  params: Promise<{ slug: string }>
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params
  return <TherapyAction slug={slug} />
}

export default Page