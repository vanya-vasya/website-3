import CodeSnippet from "@/components/ui/CodeSnippet"; 
import ChatInterface from "@/components/ui/ChatInterface"; 
import Image from 'next/image';

const Solutions = () => {
  return (
    <div className="py-6 sm:py-8 lg:py-12 bg-slate-900 relative">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-8 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-12">
            <h2 className="text-2xl font-bold lg:text-3xl text-white">How you can use Neuvisia</h2>

            <p className="hidden max-w-screen-sm text-white/50 md:block">
              Neuvisia lets you quickly create high-quality content—text, images, music, and videos. Just log in, choose a tool, enter your request, and generate your content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
        <div className="group relative flex h-48 items-end overflow-hidden rounded-lg shadow-lg md:h-80 hover:ring-2 hover:ring-pink-600">
            <div className="absolute inset-0 h-full w-full bg-slate-800">
              <CodeSnippet />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent opacity-50"></div>

            <span className="relative ml-4 mb-3 inline-block text-sm bg-slate-800 text-white md:ml-5 md:text-lg">
              Generate code
            </span>
          </div>

          <div className="group relative flex h-48 items-end overflow-hidden rounded-lg  shadow-lg md:col-span-2 md:h-80 hover:ring-2 hover:ring-pink-600">
            <div className="absolute inset-0 h-full w-full bg-slate-800">
              <ChatInterface />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Chat with AI</span>
          </div>

          <div className="group relative flex h-48 items-end overflow-hidden rounded-lg  shadow-lg md:col-span-2 md:h-80 hover:ring-2 hover:ring-pink-600">
            <Image
              src="/images/resource/animation.gif"
              alt="Photo by Martin Sanchez"
              width={1000}
              height={667}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Generate video</span>
          </div>

          <div className="group relative flex h-48 items-end overflow-hidden rounded-lg  shadow-lg md:h-80 hover:ring-2 hover:ring-pink-600">
            <Image
              src="/images/resource/hero-1.png"
              alt=""
              width={600}
              height={400}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

            <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Generate images</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
