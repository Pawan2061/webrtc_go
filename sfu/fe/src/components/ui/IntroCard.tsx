export const IntroCard = () => {
  return (
    <div className="container mx-auto px-4 py-8  my-4 md:flex md:items-center shadow-2xl rounded-xl">
      <div className="md:w-2/3  md:pr-8">
        <img
          src="https://static.uacdn.net/web-cms/stores2_Batch_22396665d0.png?q=75&auto=format%2Ccompress&w=3840"
          alt="Unacademy Centres"
          className="w-fit"
        />
      </div>
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">
          Unacademy Centres for IIT JEE and NEET UG
        </h1>
        <p className="text-lg mb-6">
          Admissions open in Kota, Delhi, Chandigarh, Sikar, Indore and 20+
          other cities!
        </p>
        <p className="text-lg mb-6">
          Learn from top educators in your city, with in-person classNamees and
          doubt solving. Bonus access to online learning.
        </p>
        <a
          href="#"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Find a centre
        </a>
      </div>
    </div>
  );
};
