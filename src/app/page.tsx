import Image from 'next/image'
import chitChat from './img/chit-chat.svg'
import erinLindford from './img/erin-lindford.90b9d461.jpg'

export default function Home() {
  // Comment 1
  return (
    <div className="mx-auto flex flex-col gap-10">

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
        <Image className="mx-auto block h-24 w-24 rounded-full sm:mx-0 sm:shrink-0" src={erinLindford} alt="" />
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
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
      </div>

      <div className="mx-auto w-6/12 flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-10 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-300 dark:focus:ring-blue-800">Default</button>
        </div>
      </div>

      <div className="mx-auto w-6/12 flex flex-row rounded-xl border border-gray-700">
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

    </div>
  )
}
