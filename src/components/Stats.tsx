const Stats = () => {
  const stats = [
    {
      number: "2M+",
      label: "Artists Worldwide",
      description: "Trusted by musicians across the globe"
    },
    {
      number: "150+",
      label: "Streaming Platforms",
      description: "Maximum reach for your music"
    },
    {
      number: "500M+",
      label: "Monthly Streams",
      description: "Total streams from our artists"
    },
    {
      number: "24/7",
      label: "Support Available",
      description: "Always here when you need us"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Thousands of Successful Artists
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Our platform has helped artists reach millions of listeners and generate 
            substantial revenue from their music.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-white/80">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-medium">Spotify</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-medium">Apple Music</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-medium">Amazon</span>
            </div>
            <div className="text-white/80">+ 147 more</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;