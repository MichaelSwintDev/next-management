import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const city = await prisma.city.create({
    data: {
      name: "North Adams",
      state: "MA",
    },
  });

  const address = await prisma.address.create({
    data: {
      streetName: "Church St",
      cityId: city.id,
      streetNumber: "375",
      zipCode: "01247",
    },
  });

  const property = await prisma.property.create({
    data: {
      type: "College",
      name: "MCLA",
      image: "/assets/campus.jpg",
      addressId: address.id,
    },
  });

  const rental = await prisma.rental.create({
    data: {
      propertyId: property.id,
      name: "Townhouse Room",
      aptNum: "c-100",
      description: "Townhouse room for upperclassmen",
      price: 700,
      image:
        "https://images.unsplash.com/photo-1602082550187-3f954840a0f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
