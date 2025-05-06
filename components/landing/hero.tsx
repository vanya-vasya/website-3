import Link from "next/link";
import Image from "next/image"


const Hero = () => {
  const timeline = [
    {
      name: 'Sign in',
      description:
        'Access your account swiftly and securely. Enjoy all features with a single click.',
      date: '1',
      dateTime: '2021-08',
    },
    {
      name: 'Get generation tokens',
      description:
        'Collect tokens to power your creativity. The more you have, the more you can create.',
      date: '2',
      dateTime: '2021-12',
    },
    {
      name: 'Describe your idea',
      description:
        'Clearly express your vision. We’ll help transform it into reality.',
      date: '3',
      dateTime: '2022-02',
    },
    {
      name: 'Generate unique, high-quality content in seconds',
      description:
        'Produce original images, sounds, code, and more in moments with our advanced tech.',
      date: '4',
      dateTime: '2022-12',
    },    
  ]
  return (
    <section id="home" className="feature-one animate__flip pb-16 bg-slate-900">
      <div className="mx-auto px-2 sm:px-4">
      <div className="feature-one__color-overly-1 flaot-bob-y top-[-150px]"></div>
        <div className="feature-one__inner">
          <h2 className="feature-one__title font-semibold">
          Discover What’s Possible with <br/>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 inline">
              Neuvisia
            </p>
          </h2>
          <div className="flex justify-center mb-12">
              <p className="max-w-4xl">Neuvisia is your creative co-pilot — a powerful AI platform that helps you turn ideas into stunning content in seconds. From images and sound to code and beyond, 
            Neuvisia gives you the tools to explore, create, and innovate effortlessly. Sign in, get your tokens, share your vision, and watch it come to life.</p>
          </div>
          <div className="feature-one__btn-box">
            <Link
              href="/dashboard"
              className="thm-btn feature-one__btn bg-slate-800 border border-slate-800 text-white transition duration-200"
            >
              <i className="fal fa-plus"></i> Get Started Free
            </Link>
          </div>
        </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0 text-white flex justify-center">Start now — it’s simpler than you think!</h1>                 
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4 mt-6">
                  {timeline.map((item) => (
                    <div key={item.name}>
                      <time
                        dateTime={item.dateTime}
                        className="flex items-center text-sm font-semibold leading-6 text-white-300/10"
                      >
                        <svg viewBox="0 0 4 4" className="mr-4 h-1 w-1 flex-none" aria-hidden="true">
                          <circle cx={2} cy={2} r={2} fill="#db2777" />
                        </svg>
                        {item.date}
                        <div
                          className="absolute -ml-2 h-px w-screen -translate-x-full bg-pink-600 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                          aria-hidden="true"
                        />
                      </time>
                      <p className="mt-6 text-lg font-semibold leading-8 tracking-tight text-white-300/10">{item.name}</p>
                      <p className="mt-1 text-base leading-7 text-white-300/10">{item.description}</p>
                    </div>
                  ))}
                <div className="feature-one__color-overly-2 float-bob-x top-[50px] right-[30px]"></div>
                </div>
            </div>
            <div className="feature-one__color-overly-3 img-bounce absolute top-[650px] left-[250px]"></div>
    </section>
  );
};

export default Hero;
