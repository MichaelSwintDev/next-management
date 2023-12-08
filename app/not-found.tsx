import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-base-100">
      <div className="rounded-lg bg-base-300 p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4">Oops! The page you are looking for could not be found.</p>
        <Link href={"/"} className="btn btn-primary">Go back to Home </Link>
      </div>
    </div>
  )
}
