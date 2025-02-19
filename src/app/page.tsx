import Image from 'next/image'
import chitChat from './img/chit-chat.svg'
import './page.css'

export default function Home() {
  // Comment 1
  return (
    <div className="mx-auto flex flex-col w-6/12 gap-10 pb-20">

      <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 mt-10">
        <Image
          src={chitChat}
          className="size-12 shrink-0"
          alt="ChitChat Logo"
        />
        <div>
          <div className="text-xl font-medium text-black dark:text-white">ChitChat</div>
          <p className="text-gray-500 dark:text-gray-400">You have a new message!</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-sm flex-col gap-2 rounded-xl p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 bg-white">
        <img className="mx-auto block h-24 w-24 rounded-full sm:mx-0 sm:shrink-0" src="https://tailwindcss.com/_next/static/media/erin-lindford.90b9d461.jpg" alt="" />
        <div className="space-y-2 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg font-semibold text-black">Erin Lindford</p>
            <p className="font-medium text-gray-500">Product Engineer</p>
          </div>
          <button type="button" className="border-purple-400 border text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 rounded-full px-3 py">
            Message
          </button>
        </div>
      </div>

      <div className="mx-auto flex flex-col gap-10">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-600 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
        </div>
      </div>

      <div className="flex flex-row rounded-xl border border-gray-700 hover:ring-2">
        <div className="bg-gray-800 px-6 py-8 w-6/12 flex flex-col rounded-tl-xl rounded-bl-xl">
          <div className="bg-white rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 mx-auto w-11/12">
            <div>
              <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z">
                  </path>
                </svg>
              </span>
            </div>
            <h3 className="text-gray-900 mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
            <p className="text-gray-500 mt-2 text-sm ">
              The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
            </p>
          </div>
        </div>
        <div className="bg-gray-900 px-6 py-8 w-6/12 flex flex-col rounded-tr-xl rounded-br-xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 mx-auto w-11/12">
            <div>
              <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z">
                  </path>
                </svg>
              </span>
            </div>
            <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
              The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
            </p>
          </div>
        </div>
      </div>

      <div className="flex border rounded-xl p-5">
        <p className="p-2 blur-sm">Phasellus sodales eget orci sit amet <span className='text-blue-400'><strong>consequat</strong></span>. Aenean et mauris risus. Nulla iaculis nulla velit, ac tempor velit efficitur ut. Nam eu risus lobortis, auctor purus ut, consectetur ex. <span className="text-red-400">Nulla</span> nec vestibulum orci. Sed tincidunt, tortor sed ornare congue, sapien ex rutrum risus, sed vulputate augue metus a dui. Vivamus porta rutrum sem at interdum.</p>
        <p className="p-2 -mr-20">Cras est turpis, cursus et condimentum et, aliquet sit amet felis. Praesent congue, ex sit amet dignissim facilisis, felis augue fringilla metus, eget tempor enim enim vel lorem. Cras vitae felis id velit semper porta sed a mauris. Ut purus urna, dictum porta tincidunt sit amet, varius nec nisl. Nam posuere lorem aliquet elit commodo dictum.</p>
        <div className="border border-gray-500 relative -left-20 rounded-full backdrop-blur-sm">
          <div className='w-20'></div>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-xl bg-white p-4">
        <div className="flex flex-col mx-auto w-4/12">
          <div className="flex items-center space-x-2 text-base">
            <h4 className="font-semibold text-slate-900">Contributors</h4>
            <span className="bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 rounded-full">204</span>
          </div>
          <div className="mt-3 flex -space-x-2 overflow-hidden">
            <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
            <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
            <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </div>
          <div className="mt-3 text-sm font-medium">
            <a href="#" className="text-blue-500">+ 198 others</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-xl bg-white p-4">
        {
          VacationCard({
            img: 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80',
            imgAlt: 'Beach',
            eyebrow: 'Private Villa',
            title: 'Relaxing All-Inclusive Resort in Cancun',
            pricing: '$299 USD per night',
            url: 'https://www.google.com/search?q=Relaxing+All-Inclusive+Resort+in+Cancun&oq=Relaxing+All-Inclusive+Resort+in+Cancun&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBBzI5NWowajGoAgCwAgA&sourceid=chrome&ie=UTF-8'
          })
        }
      </div>

      <div className="flex flex-col items-center rounded-xl border border-gray-500 p-4">
        <button className="btn-primary">Save changes</button>
      </div>

    </div>
  )
}

type VacationCardProps = {
  img: string;
  imgAlt: string;
  eyebrow: string;
  title: string;
  pricing: string;
  url: string;
};

export function VacationCard({ img, imgAlt, eyebrow, title, pricing, url }: VacationCardProps) {
  return (
    <div>
      <img className="rounded-lg" src={img} alt={imgAlt} />
      <div className="mt-4">
        <div className="text-xs font-bold text-sky-500">{eyebrow}</div>
        <div className="mt-1 font-bold text-gray-700">
          <a href={url} className="hover:underline" target='blank'>
            {title}
          </a>
        </div>
        <div className="mt-2 text-sm text-gray-600">{pricing}</div>
      </div>
    </div>
  );
}
