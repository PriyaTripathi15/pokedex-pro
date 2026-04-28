export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      {/* Pokeball */}
      <div className="relative w-20 h-20 animate-bounce">

        {/* Top Half */}
        <div className="absolute top-0 w-full h-1/2 bg-red-500 rounded-t-full"></div>

        {/* Bottom Half */}
        <div className="absolute bottom-0 w-full h-1/2 bg-white rounded-b-full border-t-4 border-black"></div>

        {/* Middle Line */}
        <div className="absolute top-1/2 left-0 w-full h-[4px] bg-black transform -translate-y-1/2"></div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white border-4 border-black rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
        </div>

      </div>

      {/* Loading Text */}
      <p className="mt-6 text-sm text-yellow-200 animate-pulse tracking-wide">
        Loading Pokémon...
      </p>

    </div>
  );
}