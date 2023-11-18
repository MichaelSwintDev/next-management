import prisma from "@/lib/db";
import {redirect} from "next/navigation";
import {states} from "@/types/states";
import {$Enums} from ".prisma/client";
import State = $Enums.State;

export const metadata = {
  title: "Add Property",
};

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
        mode: 'insensitive'
      }
    }
  })

  let newCity = await prisma.city.findFirst({
    where: {
      name: {
        equals: city,
        mode: 'insensitive'
      }
    }
  })

  if (newCity !== null) {

  } else {
    newCity = await prisma.city.create({data: {name: city, state: state as State}});
  }

  const newAddress = await prisma.address.create({
    data: {
      cityId: newCity.id,
      streetName: street,
      streetNumber: streetNum,
      zipCode: zipCode
    }
  })

  await prisma.property.create({
    data: {
      addressId: newAddress.id,
      name: name,
      type: type,
      image: image
    }
  })

  redirect("/");
}

export default async function AddPropertyPage() {
  const properties = await prisma.property.findMany();

  return (
    <div>
      <h1 className={"mb-3 text-lg font-bold"}>Add Property</h1>
      <form action={addProperty}>
        <div className={"flex w-full"}>
          <input
            className={"input input-bordered mb-3 w-1/2 border-primary"}
            name={"city"}
            placeholder={"city"}
            required
          />
          <div className={"divider divider-horizontal"}/>
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
          <div className={"divider divider-horizontal"}/>
          <input
            className={"input input-bordered mb-3 w-1/3 border-primary"}
            name={"streetNum"}
            placeholder={"Street #"}
            required
          />
          <div className={"divider divider-horizontal"}/>
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
  );
}
