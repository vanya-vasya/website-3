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
              Hear from Creative Professionals
            </h1>
            <p className="text-xl text-gray-100 md:text-center md:text-2xl">
              See how creators are elevating their work with Neuvisia.
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
                      <p className="text-gray-500 text-md">Video Creator</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The video script generator transformed my workflow. I
                    create twice as many videos now with scripts that sound
                    authentic and engage my audience.&quot;
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
                      <p className="text-gray-500 text-md">Digital Artist</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;Neuvisia&apos;s concept art generator helps me
                    visualize ideas instantly. It&apos;s like having a creative
                    partner who understands my artistic vision.&quot;
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
                      <p className="text-gray-500 text-md">Musician</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The music composition tools have changed how I create.
                    I can now generate backing tracks and explore new musical
                    directions with ease.&quot;
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
                      <p className="text-gray-500 text-md">Content Creator</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The content calendar planner and caption generator
                    save me hours every week. My engagement has increased by 40%
                    since I started using Neuvisia.&quot;
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
                      <p className="text-gray-500 text-md">
                        Documentary Filmmaker
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The video voiceover tool is astonishing - I&apos;ve
                    been able to produce professional narration for my
                    documentaries without hiring voice talent.&quot;
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
                      <p className="text-gray-500 text-md">Digital Painter</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The art style transfer and canvas expansion tools have
                    revolutionized my digital painting process. I can experiment
                    with styles and compositions in minutes instead of
                    hours.&quot;
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
                      <p className="text-gray-500 text-md">Songwriter</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;Writing song lyrics used to give me writer&apos;s
                    block, but Neuvisia&apos;s lyric generator helps me overcome
                    creative barriers and find fresh inspiration.&quot;
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
                      <p className="text-gray-500 text-md">
                        Social Media Manager
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;Managing multiple social accounts was overwhelming
                    until I found Neuvisia&apos;s social media tools. Now I can
                    create consistent, on-brand content across all platforms
                    effortlessly.&quot;
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
                        src="https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Samantha T.
                      </h3>
                      <p className="text-gray-500 text-md">YouTube Creator</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;From scripts to thumbnail optimization, Neuvisia has
                    become essential for my YouTube workflow. My channel has
                    grown 3x faster since I started using these tools.&quot;
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
                        src="https://images.unsplash.com/photo-1648183185705-45e3fd86b078?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Alex D.
                      </h3>
                      <p className="text-gray-500 text-md">
                        Album Cover Designer
                      </p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The album cover creator has made my design process so
                    much more efficient. I can now present multiple professional
                    concepts to musicians in a fraction of the time.&quot;
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
                        src="https://images.unsplash.com/photo-1629747387925-6905ff5a558a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Priya K.
                      </h3>
                      <p className="text-gray-500 text-md">Podcast Producer</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;The sound effect generator and voice melody creator
                    have added a professional touch to my podcast production. My
                    listeners notice the difference in audio quality.&quot;
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
                        src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        fill
                        alt="Testimonials"
                        className="rounded-full object-cover border"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Maya L.
                      </h3>
                      <p className="text-gray-500 text-md">Video Game Artist</p>
                    </div>
                  </div>
                  <p className="leading-normal text-gray-300 text-md">
                    &quot;As an indie game artist, Neuvisia has been a
                    game-changer. I can rapidly prototype character designs and
                    environments with the concept art tools.&quot;
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
