import prisma from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { states } from "@/@types/states";
import { $Enums } from ".prisma/client";
import State = $Enums.State;
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Role } from "@prisma/client";
import AdminPropertyCard from "@/components/AdminPropertyCard";
import PaginationBar from "@/components/PaginationBar";

export const metadata = {
  title: "Add Property",
};

interface addPropertyPageProps {
  searchParams: {
    page: string;
  };
}

async function addProperty(formData: FormData) {
  "use server";
  const city = formData.get("city")?.toString();
  const state = formData.get("state")?.toString();
  const street = formData.get("street")?.toString();
  const streetNum = formData.get("streetNum")?.toString();
  const zipCode = formData.get("zipcode")?.toString();
  const name = formData.get("name")?.toString();
  const type = formData.get("type")?.toString();
  const image = formData.get("url")?.toString();

  if (!city || !state || !street || !streetNum || !zipCode || !name || !type) {
    throw Error("Missing Value");
  }

  const found = await prisma.city.findFirst({
    where: {
      name: {
        equals: city,
        mode: "insensitive",
      },
    },
  });

  let newCity = await prisma.city.findFirst({
    where: {
      name: {
        equals: city,
        mode: "insensitive",
      },
    },
  });

  if (newCity !== null) {
  } else {
    newCity = await prisma.city.create({
      data: { name: city, state: state as State },
    });
  }

  const newAddress = await prisma.address.create({
    data: {
      cityId: newCity.id,
      streetName: street,
      streetNumber: streetNum,
      zipCode: zipCode,
    },
  });

  await prisma.property.create({
    data: {
      addressId: newAddress.id,
      name: name,
      type: type,
      image: image,
    },
  });

  redirect("/");
}

export default async function AddPropertyPage({
  searchParams: { page = "1" },
}: addPropertyPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }
  if (session.user.role !== Role.ADMIN) {
    notFound();
  }

  const currentPage = parseInt(page);
  const pageSize = 2;
  const totalItemCount = await prisma.property.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const properties = await prisma.property.findMany({
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      <div className="my-4 ml-2 mr-2 grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-1">
        {properties.map((property) => (
          <AdminPropertyCard property={property} key={property.id} />
        ))}
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
        ></PaginationBar>
      </div>
      <div>
        <h1 className={"mb-3 text-center text-lg font-bold"}>Add Property</h1>
        <form action={addProperty}>
          <div className={"flex w-full"}>
            <input
              className={"input input-bordered mb-3 w-1/2 border-primary"}
              name={"city"}
              placeholder={"city"}
              required
            />
            <div className={"divider divider-horizontal"} />
            <select
              className="select select-bordered mb-3 w-1/2 border-primary"
              required
              defaultValue={"selected"}
              name={"state"}
            >
              <option disabled value={"selected"}>
                State
              </option>
              {states.map((state) => (
                <option value={state} key={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className={"flex w-full"}>
            <input
              className={"input input-bordered mb-3 w-1/3 border-primary"}
              name={"street"}
              placeholder={"Street"}
              required
            />
            <div className={"divider divider-horizontal"} />
            <input
              className={"input input-bordered mb-3 w-1/3 border-primary"}
              name={"streetNum"}
              placeholder={"Street #"}
              required
            />
            <div className={"divider divider-horizontal"} />
            <input
              className={
                "input input-bordered mb-3 w-1/3 appearance-none border-primary"
              }
              name={"zipcode"}
              placeholder={"Zip"}
              type={"number"}
              required
            />
          </div>
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"name"}
            placeholder={"Name"}
            required
          />
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"url"}
            placeholder={"Image url"}
            type={"url"}
          />
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"type"}
            placeholder={"type"}
            required
          />
          <button type={"submit"} className={"btn btn-secondary btn-block"}>
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}
