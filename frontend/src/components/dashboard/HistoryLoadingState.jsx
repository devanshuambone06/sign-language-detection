import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-6 border border-border">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-border/50 rounded-lg w-1/3" />
      <div className="h-32 bg-border/50 rounded-xl" />
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="glass-card rounded-2xl p-6 border border-border">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-border/50 rounded-lg w-1/4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-border/50 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border/50 rounded w-1/4" />
              <div className="h-4 bg-border/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonTimeline = () => (
  <div className="glass-card rounded-2xl p-6 border border-border">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-border/50 rounded-lg w-1/4" />
      <div className="space-y-4 pl-14 relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative">
            <div className="absolute left-[-20px] top-0 w-5 h-5 rounded-full bg-border/50 border-4 border-background" />
            <div className="p-4 rounded-xl bg-border/30 border border-border/50">
              <div className="h-4 bg-border/50 rounded w-1/3 mb-2" />
              <div className="h-4 bg-border/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HistoryLoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Loading Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Loading Filters */}
      <SkeletonCard />

      {/* Loading Table */}
      <SkeletonTable />

      {/* Loading Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonTimeline />
        <SkeletonCard />
      </div>
    </motion.div>
  );
};

export default HistoryLoadingState;
