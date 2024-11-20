import Herocards from "./ui/HeroCards";
import { IntroCard } from "./ui/IntroCard";
import PhoneInput from "./ui/Phoneinput";
import Search from "./ui/search";

export default function Landing() {
  return (
    <div className="w-full mx-auto max-w-screen-lg ">
      <section className="flex py-20  gap-2">
        <div className="flex flex-col flex-1 gap-6">
          <h1 className="text-[#3C4852] font-semibold text-5xl w-full">
            Crack your goal with Indias top educators
          </h1>
          <h1 className="text-xl font-medium w-full py-2">
            Over <span className="text-green-600">10 crore</span> learners trust
            this platform
          </h1>
          <PhoneInput />
        </div>

        <img
          src="https://static.uacdn.net/production/_next/static/images/home-illustration.svg?q=75&auto=format%2Ccompress&w=1200"
          alt=""
        />
      </section>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-medium">Select your goal/exams</h1>
        <h1 className="font-semibold  text-xl">
          200+ exams available for your preparation
        </h1>
        <Search />
        <Herocards />
        <IntroCard />
      </div>
    </div>
  );
}
