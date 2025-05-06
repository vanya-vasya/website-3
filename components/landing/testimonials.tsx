import React from "react";
import Image from "next/image";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-10 bg-slate-900">
      <div className="max-w-6xl mx-8 md:mx-10 lg:mx-20 xl:mx-auto relative">
        <div className="feature-one__color-overly-4 img-bounce top-[-200px]"></div>
        <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
          <div className="mb-12 space-y-5 md:mb-16 md:text-center">
            <h1 className="text-3xl font-bold mb-5 sm:mb-0 text-white md:text-center md:text-4xl">
              It&apos;s not just us.
            </h1>
            <p className="text-xl text-gray-100 md:text-center md:text-2xl">
              Here&apos;s what others have to say about us.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <ul className="space-y-8">
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1499887142886-791eca5918cd?q=80&w=2080&auto=format&fit=crop"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Emily R.
                      </h3>
                      <p className="text-gray-500 text-md">Digital marketer</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I’ve used a few AI tools before, but this one’s on another
                    level. Being able to generate text, music, images, and even
                    video in one place is amazing.
                  </p>
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1474176857210-7287d38d27c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {" "}
                        Jason M.
                      </h3>
                      <p className="text-gray-500 text-md">
                        Freelance designer
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    As a freelance designer, the image and music generation
                    features have been a total lifesaver. Super easy to use and
                    great results.
                  </p>
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1592462065256-79771d4c57b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Martha S.
                      </h3>
                      <p className="text-gray-500 text-md">
                        Software developer
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I use the code generation almost daily to build and test
                    ideas quickly. It’s surprisingly accurate and helps speed up
                    my dev process.
                  </p>
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1628359355624-855775b5c9c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Linda F.
                      </h3>
                      <p className="text-gray-500 text-md">Developer</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I’ve tried a lot of AI tools for creating text and code, but
                    this one is by far the most reliable. It really gets what I
                    need.
                  </p>
                </div>
              </div>
            </li>
          </ul>

          <ul className="hidden space-y-8 sm:block">
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1682965635721-8acb70bfb693?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Johnathan R.
                      </h3>
                      <p className="text-gray-500 text-md">Filmmaker</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I generated background music and some AI visuals for a short
                    indie project — saved time and stayed within budget. Loved
                    it!
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Marthin G.
                      </h3>
                      <p className="text-gray-500 text-md">Brand manager</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I use it for drafting emails, generating marketing content,
                    and building visuals. It cuts my workflow time in half.
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/vector-1740071248343-3802c8dd5f65?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Benji P.
                      </h3>
                      <p className="text-gray-500 text-md">Creative director</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I’ve tried many, but this one stands out in terms of
                    quality, speed, and versatility. Absolutely worth it.
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1519326773765-3ae3b02c44cc?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Colton W.
                      </h3>
                      <p className="text-gray-500 text-md">Musician</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    The AI-generated voices sound incredibly natural. I use it
                    for voiceovers in my music, and it’s been such a time-saver.
                  </p>{" "}
                </div>
              </div>
            </li>
          </ul>

          <ul className="hidden space-y-8 lg:block">
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/vector-1742739891335-8c946e23aa48?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Sofia N.
                      </h3>
                      <p className="text-gray-500 text-md">Web designer</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I had to create a bunch of graphics and videos for a
                    campaign, and this AI platform helped me get everything done
                    in a fraction of the time.
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1645860443947-62edf696d6d6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Emma C.
                      </h3>
                      <p className="text-gray-500 text-md">
                        Freelance designer
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    The range of services offered here is incredible. I used the
                    video and music generation features for a client project,
                    and they were spot on.
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1610737241336-371badac3b66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Marco D.
                      </h3>
                      <p className="text-gray-500 text-md">Writer</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I&apos;m not very tech-savvy, but this platform made it easy
                    to dive in and start creating right away. Highly recommend.
                  </p>{" "}
                </div>
              </div>
            </li>
            <li className="text-sm leading-6">
              <div className="relative group">
                <div className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src="https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=2144&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Neil W.
                      </h3>
                      <p className="text-gray-500 text-md">Copywriter</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    I was blown away by how natural the text and voice
                    generation sounded. It’s getting hard to tell it’s AI.
                  </p>{" "}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
