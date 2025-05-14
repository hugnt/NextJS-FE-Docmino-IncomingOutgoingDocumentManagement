
export default function PageLoading() {
    return (
        <div>
            <section className="relative place-items-center grid h-64 gap-1 my-auto">
                <div className="bg-blue-500 w-28 h-28  absolute animate-ping rounded-full delay-5s shadow-xl"></div>
                <div className="bg-blue-400 w-20 h-20 absolute animate-ping rounded-full shadow-xl"></div>
                <div className="bg-white w-16 h-16 absolute animate-pulse rounded-full shadow-xl"></div>

            </section>
            <div className="text-center">
                <span className="text-center text-xl ">Loading ...</span>
            </div>
        </div>

    )
}
