import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import { Role } from "@prisma/client";
import PaginationBar from "@/components/PaginationBar";
import ApplicationCard from "@/components/ApplicationCard";

interface applicationsPageProps {
  searchParams: {
    page: string;
  };
}

export default async function ApplicationsPage({
  searchParams: { page = "1" },
}: applicationsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  if (session.user.role !== Role.ADMIN) {
    notFound();
  }

  const currentPage = parseInt(page);
  const pageSize = 6;
  const totalItemCount = await prisma.application.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const applications = await prisma.application.findMany({
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <div className="flex flex-col items-center">
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {applications.map((application) => (
          <ApplicationCard application={application} key={application.id} />
        ))}
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
      ></PaginationBar>
    </div>
  );
}
