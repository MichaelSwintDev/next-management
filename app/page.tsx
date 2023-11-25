import prisma from "@/lib/db";
import RentalCard from "@/components/RentalCard";
import Image from "next/image";
import Link from "next/link";
import PaginationBar from "@/components/PaginationBar";

interface HomeProps {
  searchParams: {
    page: string;
  };
}

export default async function Home({
  searchParams: { page = "1" },
}: HomeProps) {
  const currentPage = parseInt(page);
  const pageSize = 6;
  const heroItemCount = 1;
  const totalItemCount = await prisma.rental.count();
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const rentals = await prisma.rental.findMany({
    orderBy: { id: "desc" },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  return (
    <div className="flex flex-col items-center">
      {currentPage === 1 && (
        <div className={"rounded-cl hero bg-base-200"}>
          <div className={"hero-content flex-col lg:flex-row"}>
            <Image
              src={rentals[0].image}
              alt={rentals[0].name}
              width={400}
              height={800}
              className={"w-full max-w-sm rounded-lg shadow-2xl"}
              priority
            ></Image>
            <div>
              <h1 className={"text-5xl font-bold"}>{rentals[0].name}</h1>
              <p className={"py-6"}>{rentals[0].description}</p>
              <Link
                href={"/rentals/" + rentals[0].id}
                className={"btn btn-primary"}
              >
                Take a look
              </Link>
            </div>
          </div>
        </div>
      )}
      <div
        className={"my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"}
      >
        {(currentPage === 1 ? rentals.slice(1) : rentals).map((rental) =>
          rental.userId !== null ? (
            <div key={rental.id}></div>
          ) : (
            <RentalCard rental={rental} key={rental.id}></RentalCard>
          ),
        )}
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
      ></PaginationBar>
    </div>
  );
}
