import Link from 'next/link';
import ThemeSwitcher from '../components/themeSwitcher';

export default function Page2() {
  return(
    <div className="mx-auto flex flex-col w-11/12 max-w-3xl gap-10 border border-neutral-700 mt-5 mb-10 p-5 rounded-xl">

      <ThemeSwitcher />

      {PageLinks()}

      <CompanyRetreats />

      {PageLinks()}

    </div>
  )
}

const PageLinks = () => (
  <div className="mx-auto mt-5 text-black dark:text-white">
      Page <Link key="page2" href="/"><u>1</u></Link> 2
  </div>
)

const CompanyRetreats = () => (
  <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl outline outline-black/5 dark:outline-white/10">
    <div className="md:flex">
      <div className="md:shrink-0">
        <img
          className="h-48 w-full object-cover md:h-full md:w-48"
          src="https://images.unsplash.com/photo-1637734433731-621aca1c8cb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=404&q=80"
          alt="Modern building architecture"
        />
      </div>
      <div className="p-8">
        <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">Company retreats</div>
        <a href="#" className="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
          Incredible accommodation for your team
        </a>
        <p className="mt-2 text-gray-500">
          Looking to take your team away on a retreat to enjoy awesome food and take in some sunshine? We have a list of
          places to do just that.
        </p>
      </div>
    </div>
  </div>
)
