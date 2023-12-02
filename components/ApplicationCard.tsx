import { Application } from "@prisma/client";
import prisma from "@/lib/db";

interface ApplicationCardProps {
  application: Application;
}

async function getRental(rentalId: number) {
  "use server";
  const rental = await prisma.rental.findFirstOrThrow({
    where: {
      id: rentalId,
    },
  });

  return rental;
}

async function getUser(userId: number) {
  "use server";
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  return user;
}

export default async function ApplicationCard({
  application,
}: ApplicationCardProps) {
  const isNew =
    Date.now() - new Date(application.createdAt).getTime() < 604800000;
  const rental = await getRental(application.rentalId);
  const user = await getUser(application.userId);

  return (
    <div className={"card w-full bg-base-200 shadow-xl"}>
      <div className={"card-body"}>
        <h2 className={"card-title"}>
          Rental: {rental.name}
          {isNew && <div className="badge badge-secondary"> NEW </div>}
        </h2>
        <h3>
          Applicant name: {application.firstName} {application.lastName}
        </h3>
        <h3>Applicant email: {user.email}</h3>
        <h1 className="text-center font-bold underline">About Them</h1>
        <p>{application.content}</p>
      </div>
    </div>
  );
}
