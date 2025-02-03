

export default function  CreateButton  (label:string) {
    return (
      <button 
        className="bg-accent text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300
                   hover:bg-accent-hover hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                   animate-pulse"
      >
        {label}
      </button>
    );
  }
  