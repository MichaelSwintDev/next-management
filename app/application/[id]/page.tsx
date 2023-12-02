import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { cache } from "react";
import Image from "next/image";

interface ApplicationPageProps {
  params: {
    id: number;
  };
}

const getRental = cache(async (id: number) => {
  const rental = await prisma.rental.findUnique({ where: { id: Number(id) } });

  if (!rental) notFound();
  return rental;
});

async function applicationSubmit(formData: FormData) {
  "use server";
  const firstName = formData.get("fName")?.toString();
  const lastName = formData.get("lName")?.toString();
  const content = formData.get("description")?.toString();
  const rentalId = Number(formData.get("rentalId"));
  const userId = Number(formData.get("userId"));

  if (!firstName || !lastName || !content || !rentalId || !userId) {
    throw Error("Missing Required Field");
  }

  await prisma.application
    .create({
      data: {
        firstName: firstName,
        lastName: lastName,
        content: content,
        userId: userId,
        rentalId: rentalId,
      },
    })
    .catch((error) => {
      console.log("Application already submitted!");
    });

  redirect("/rentals/" + rentalId);
}

export default async function ApplicationPage({
  params: { id },
}: ApplicationPageProps) {
  const rental = await getRental(id);
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center">
      {!session ? (
        <>
          You Must
          <Link
            className={"btn-link"}
            href={{
              pathname: "/api/auth/signin",
              query: { callbackUrl: "/application/" + rental.id },
            }}
          >
            Sign in
          </Link>{" "}
          to apply
        </>
      ) : (
        <div className="sm: grid grid-cols-1 gap-2 xl:grid-cols-2">
          <div className="sm: grid grid-cols-1 gap-2 xl:grid-cols-1">
            <Image
              src={rental.image}
              alt={rental.name}
              width={400}
              height={800}
              className={"m-auto w-full max-w-sm rounded-lg shadow-2xl"}
              priority
            ></Image>
          </div>
          <div className="form">
            <h1 className={"mb-3 text-center text-lg font-bold"}>
              Application
            </h1>
            <form action={applicationSubmit}>
              <input
                className={"input input-bordered mb-3 w-full border-primary"}
                name={"fName"}
                placeholder={"First name"}
                required
              />
              <input
                className={"input input-bordered mb-3 w-full border-primary"}
                name={"lName"}
                placeholder={"Last name"}
                required
              />
              <textarea
                required
                name={"description"}
                placeholder={"Tell us about yourself and your situation."}
                className={
                  "textarea-border textarea mb-3 w-full border-primary"
                }
              />
              <input
                type="hidden"
                name="userId"
                value={session.user.id}
              ></input>
              <input type="hidden" name="rentalId" value={rental.id}></input>
              <button type={"submit"} className={"btn btn-secondary btn-block"}>
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
