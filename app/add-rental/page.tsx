import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Rental",
};

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

export default async function AddRentalPage() {
  const properties = await prisma.property.findMany();

  return (
    <div>
      <h1 className={"mb-3 text-lg font-bold"}>Add Rental</h1>
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
  );
}
