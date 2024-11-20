import React from "react";

const HeroCards = () => {
  const cards = [
    {
      id: 1,
      name: "UPSC CSE",
      logo: "https://static.uacdn.net/production/_next/static/images/home/goalIcons/upsc.svg?q=75&auto=format%2Ccompress&w=256",
    },
    { id: 2, name: "JEE", logo: "/api/placeholder/64/64" },
    { id: 3, name: "NEET", logo: "/api/placeholder/64/64" },
    { id: 4, name: "CAT", logo: "/api/placeholder/64/64" },
    { id: 5, name: "GATE", logo: "/api/placeholder/64/64" },
    { id: 6, name: "Bank Exams", logo: "/api/placeholder/64/64" },
    { id: 7, name: "SSC", logo: "/api/placeholder/64/64" },
    { id: 8, name: "Defence", logo: "/api/placeholder/64/64" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {cards.map((card) => (
        <div
          key={card.id}
          className="
            w-full h-full
            flex flex-col items-center justify-center
            border border-gray-200
            py-20
            
            cursor-pointer
            rounded-xl
            hover:shadow-lg
            transition-shadow duration-200 
          "
        >
          <img
            src={card.logo}
            alt={`${card.name} logo`}
            className="w-16 h-16 object-contain"
          />
          <h3 className="text-center font-medium text-lg text-gray-800">
            {card.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default HeroCards;
