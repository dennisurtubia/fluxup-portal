const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex space-x-4">
        <div
          className="w-3 h-3 bg-primary rounded-full animate-ping"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-ping"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-3 h-3 bg-primary rounded-full animate-ping"
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
