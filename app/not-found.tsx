import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#0F172A] h-screen pt-16 fixed inset-0 z-[1005] ">
      <div className="flex items-center justify-center  flex-col max-w-[700px] mx-auto px-5 my-8">
        <div className="max-w-md md:max-w-lg text-center">
          <h2 className="text-9xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 text-[128px] font-bold mb-8 ">
            404
          </h2>
          <p className="text-[#CBD5E1] text-3xl font-medium max-w-[250px] mx-auto md:max-w-none">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p className="max-w-[250px]  mx-auto md:max-w-none text-lg text-gray-600 dark:text-slate-400 mt-4 mb-8 font-light">
            But don&apos;t worry, you can find plenty of other things on our
            homepage.
          </p>
          <Link
            href="/"
            className="bg-gray-900  hover:text-[#38BDF9] p-3 rounded-md w-[190px] block  hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-800  text-white text-[16px] mx-auto"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
