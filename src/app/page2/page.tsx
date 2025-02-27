import Link from 'next/link';

export default function Page2() {
  return(
    <div className="mx-auto flex flex-col w-6/12 gap-10 pb-20">

      {PageLinks()}

      <div>
          Page 2
      </div>

      {PageLinks()}

    </div>
  )
}

const PageLinks = () => (
  <div className="mx-auto mt-10">
      Page <Link key="page2" href="/"><u>1</u></Link> 2
  </div>
)
