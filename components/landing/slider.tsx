const Slider = () => {
  return (
    <section id="features" className="container mx-auto px-4 space-y-6 py-8 md:py-12 lg:py-20 bg-slate-900">

        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-2">
        <div className="feature-one__color-overly-3 img-bounce top-[250px] right-[50px]"></div>

            <h3 className="font-bold text-2xl leading-[1.1] sm:text-3xl md:text-6xl text-white">Features</h3>

            <p className="max-w-[85%] leading-normal text-white-300/10 sm:text-lg sm:leading-7">
              With Neuvisia, you can effortlessly generate text, images, music, videos, code, and audio. Our intelligent tools simplify every stage of the creative process, while the platform continues to evolve, offering new features to boost your creativity and productivity.
            </p>

        </div>

        <div className="mx-auto grid justify-center gap-7 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-2">

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/chat.png" alt="Text Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                      <h3 className="font-bold text-white">Text</h3>
                      <p className="text-sm text-white-300/10">Generate creative, engaging text for stories and articles effortlessly.</p>
                    </div>
                  </div>
              </div>
          </div>
          <div className="feature-one__color-overly-1 float-bob-y top-[100px] left-[50px]"></div>

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/photo.png" alt="Photo Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                  <h3 className="font-bold text-white">Images</h3>
                  <p className="text-sm text-white-300/10">Create stunning, high-quality visuals from concepts in seconds.</p>
                    </div>
                  </div>
              </div>
          </div>

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/music-note.png" alt="Music Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                      <h3 className="font-bold text-white">Music</h3>
                      <p className="text-sm text-white-300/10">Compose unique music tracks with AI-powered melody creation.</p>
                    </div>
                  </div>
              </div>
          </div>

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/web-programming.png" alt="Code Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                  <h3 className="font-bold text-white">Code</h3>
                  <p className="text-sm text-white-300/10">Generate clean, functional code for projects quickly and easily.</p>
                    </div>
                  </div>
              </div>
          </div>

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/audio.png" alt="Audio Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white">Audio</h3>
                    <p className="text-sm text-white-300/10">Create professional-quality audio, from voiceovers to sound effects.</p>
                    </div>
                  </div>
              </div>
          </div>

            <div className="relative group h-[200px]">
              <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200">
              </div>
              <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5 h-[200px] justify-between">
                <div className="flex flex-col justify-between rounded-md">
                <img src="/images/icons/video-camera.png" alt="Video Icon" width={38} height={38} />
                  </div>
                  <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                        <h3 className="font-bold text-white">Video</h3>
                        <p className="text-sm text-white-300/10">
                        Create high-quality videos, from cinematic scenes to engaging animations.</p>
                    </div>
                  </div>
              </div>
              <div className="feature-one__color-overly-3 img-bounce absolute top-[50px] right-[250px]"></div>
          </div>
        </div>
        <div className="feature-one__color-overly-2 float-bob-x top-[50px] right-[30px]"></div>
    </section>
  );
};

export default Slider;
