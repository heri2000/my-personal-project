import Link from 'next/link';

export default function Page2() {
  return(
    <div className="mx-auto flex flex-col w-6/12 gap-10 pb-20">

      <div className="mx-auto mt-10">
          Page <Link key="page2" href="/"><span className="bg-blue-900 p-2 rounded-full">1</span></Link> 2
      </div>

      <div>
          Page 2
      </div>

    </div>
  )
}
