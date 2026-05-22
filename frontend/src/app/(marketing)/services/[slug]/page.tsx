import React from 'react';
import { publicApi, serviceApi, therapistApi } from '@/lib/api';
import ServiceDetails from '@/components/marketing/ServiceDetails';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { slug } = await params;

    let service: any = null;
    let testimonials: any[] = [];
    let therapists: any = null;
    try {
        testimonials = await publicApi.testimonials();
        therapists = await therapistApi.bySlug("srishti-roy");
        service = await serviceApi.bySlug(slug);
    } catch (error) {
        console.error(error);
    }


    return (
        <div>
            <ServiceDetails 
            testimonials={testimonials} 
            therapist={therapists}
            service={service} />
        </div>
    );
};

export default Page;    