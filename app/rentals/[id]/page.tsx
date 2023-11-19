import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import PriceLabel from "@/components/PriceLabel";
import { cache } from "react";
import { Metadata } from "next";

interface RentalPageProps {
  params: {
    id: number;
  };
}

const getRental = cache(async (id: number) =>{
  const rental = await prisma.rental.findUnique({ where: { id: Number(id) } });

  if (!rental) notFound();
  return rental
})

export async function  generateMetadata({ params: { id } }: RentalPageProps): Promise<Metadata> {
  const rental = await getRental(id);
  return {
    title: rental.name + " - Next Management",
    description: rental.description,
    openGraph: {
      images: [{url: rental.image}]
    }
  }
}

export default async function RentalPage({ params: { id } }: RentalPageProps) {
  const rental = await getRental(id);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={rental.image}
        alt={rental.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />
      <div>
        <h1 className="text-5xl font-bold">{rental.name}</h1>
        <PriceLabel price={rental.price} className="mt-4"></PriceLabel>
        <p className="py-6">{rental.description}</p>
      </div>
    </div>
  );
}
