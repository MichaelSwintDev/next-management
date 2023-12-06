import { Rental } from "@prisma/client";
import Link from "next/link";
import PriceLabel from "@/components/PriceLabel";
import Image from "next/image";

interface RentalCardProps {
  rental: Rental;
}

export default function RentalCard({ rental }: RentalCardProps) {
  const isNew = Date.now() - new Date(rental.createdAt).getTime() < 604800000;
  return (
    <Link
      href={"/rentals/" + rental.id}
      className={"card w-full bg-base-200 transition-shadow hover:shadow-xl"}
    >
      <figure>
        <Image
          src={`${rental.image}`}
          alt={rental.name}
          width={800}
          height={400}
          className={"h-48 object-cover"}
        ></Image>
      </figure>
      <div className={"card-body"}>
        <h2 className={"card-title"}>
          {rental.name}
          {isNew && <div className="badge badge-secondary"> NEW </div>}
        </h2>
        <p>{rental.description}</p>
        <PriceLabel price={rental.price} />
      </div>
    </Link>
  );
}
