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

    </div>
  )
}
