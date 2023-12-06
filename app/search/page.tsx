import prisma from "@/lib/db";
import RentalCard from "@/components/RentalCard";
import {Metadata} from "next";

interface SearchPageProps {
  searchParams: { query: string }
}

export function generateMetadata({searchParams: {query},}: SearchPageProps): Metadata {
  return {
    title: `Search: ${query} - Next Management`
  }

}

export default async function SearchPage({searchParams: {query}}: SearchPageProps) {
  const rentals = await prisma.rental.findMany({
    where: {
      OR: [
        {name: {contains: query, mode: "insensitive"}},
        {description: {contains: query, mode: "insensitive"}}
      ]
    },
    orderBy: {id: "desc"}
  })

  if (rentals.length === 0) {
    return <div className={"text-center"}>No rental matches your search</div>
  }

  return (<div className={"grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"}>
    {rentals.map(rental => (
      <RentalCard rental={rental} key={rental.id}></RentalCard>
    ))}
  </div>)
}