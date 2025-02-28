import Link from 'next/link';

export default function Page2() {
  return(
    <div className="mx-auto flex flex-col w-11/12 max-w-3xl gap-10 border border-neutral-700 bg-neutral-900 mt-5 mb-10 p-5 rounded-xl">

      {PageLinks()}

      <div className='mx-auto'>
          <p className='font-bold text-2xl'>Page 2</p>
      </div>

      {PageLinks()}

    </div>
  )
}

const PageLinks = () => (
  <div className="mx-auto mt-5">
      Page <Link key="page2" href="/"><u>1</u></Link> 2
  </div>
)
