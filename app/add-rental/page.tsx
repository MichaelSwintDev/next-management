import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { Role } from "@prisma/client";
import AdminRentalCard from "@/components/AdminRentalCard";
import PaginationBar from "@/components/PaginationBar";

export const metadata = {
  title: "Add Rental",
};

interface addRentalPageProps {
  searchParams: {
    page: string;
  };
}

async function addRental(formData: FormData) {
  "use server";
  const name = formData.get("name")?.toString();
  const propertyId = Number(formData.get("prop") || 0);
  const description = formData.get("description")?.toString();
  const image = formData.get("url")?.toString();
  const price = Number(formData.get("price") || 0);
  const aptNum = formData.get("aptNum")?.toString();

  if (!name || !propertyId || !description || !image || !price || !aptNum) {
    throw Error("Missing Required Field");
  }

  await prisma.rental.create({
    data: { name, propertyId, description, image, price, aptNum },
  });

  redirect("/");
}

export default async function AddRentalPage({
  searchParams: { page = "1" },
}: addRentalPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }
  if (session.user.role !== Role.ADMIN) {
    notFound();
  }

  const properties = await prisma.property.findMany();

  const currentPage = parseInt(page);
  const pageSize = 2;
  const totalItemCount = await prisma.rental.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const rentals = await prisma.rental.findMany({
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      <div className="my-4 ml-2 mr-2 grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-1">
        {rentals.map((rental) => (
          <AdminRentalCard rental={rental} key={rental.id} />
        ))}
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
        ></PaginationBar>
      </div>
      <div>
        <h1 className={"mb-3 text-center text-lg font-bold"}>Add Rental</h1>
        <form action={addRental}>
          <select
            className="select select-bordered mb-3 w-full border-primary"
            required
            defaultValue={"selected"}
            name={"prop"}
          >
            <option disabled value={"selected"}>
              Property
            </option>
            {properties.map((property) => (
              <option value={property.id} key={property.id}>
                {property.name}
              </option>
            ))}
          </select>
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"name"}
            placeholder={"name"}
            required
          />
          <textarea
            required
            name={"description"}
            placeholder={"description"}
            className={"textarea-border textarea mb-3 w-full border-primary"}
          />
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"url"}
            placeholder={"Image url"}
            type={"url"}
            required
          />
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"price"}
            placeholder={"price"}
            type={"number"}
            required
          />
          <input
            className={"input input-bordered mb-3 w-full border-primary"}
            name={"aptNum"}
            placeholder={"Apt number"}
            required
          />
          <button type={"submit"} className={"btn btn-secondary btn-block"}>
            Add Rental
          </button>
        </form>
      </div>
    </div>
  );
}
