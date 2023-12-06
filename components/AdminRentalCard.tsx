import { Rental } from "@prisma/client";
import PriceLabel from "@/components/PriceLabel";
import Image from "next/image";

interface AdminRentalCardProps {
  rental: Rental;
}

export default function AdminRentalCard({ rental }: AdminRentalCardProps) {
  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <figure>
        <Image
          src={`${rental.image}`}
          alt={rental.name}
          width={600}
          height={400}
          className={"h-48 object-cover"}
        ></Image>
      </figure>
      <div className={"card-body"}>
        <h2 className={"card-title"}>{rental.name}</h2>
        <p>Id: {rental.id}</p>
        <p>Tenants: {rental.userId}</p>
        <PriceLabel price={rental.price} />
      </div>
    </div>
  );
}
