const Background = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="relative h-full w-full bg-black">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        {/* Radial Gradient */}
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
  
        {/* Wrap children inside */}
        <div className="relative">{children}</div>
      </div>
    );
  };
  
  export default Background;
  