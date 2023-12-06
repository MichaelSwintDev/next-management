import { Property } from "@prisma/client";
import prisma from "@/lib/db";
import Image from "next/image";

interface AdminPropertyCardProps {
  property: Property;
}

async function getAddress(addressId: number) {
  "use server";
  const address = await prisma.address.findFirstOrThrow({
    where: {
      id: addressId,
    },
  });

  return address;
}

async function getCity(cityId: number) {
  "use server";
  const city = await prisma.city.findFirstOrThrow({
    where: {
      id: cityId,
    },
  });

  return city;
}

export default async function AdminPropertyCard({
  property,
}: AdminPropertyCardProps) {
  const address = await getAddress(property.addressId);
  const city = await getCity(address.cityId);
  return (
    <div className={"card w-full bg-base-200 shadow-xl"}>
      {property.image !== "" ? (
        <figure>
          <Image
            src={`${property.image}`}
            alt={property.name || "No Name"}
            width={800}
            height={600}
            className={"h-56 object-cover"}
          ></Image>
        </figure>
      ) : (
        <></>
      )}
      <div className={"card-body"}>
        <h2 className={"card-title"}>{property.name}</h2>
        <h3>
          Location: {address.streetNumber} {address.streetName} {city.name},{" "}
          {city.state} {address.zipCode}
        </h3>
        <h4>id: {property.id}</h4>
      </div>
    </div>
  );
}
