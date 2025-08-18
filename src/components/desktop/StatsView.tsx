'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StatsView() {
  const [timeRange, setTimeRange] = useState('30');

  // Mock data
  const overviewStats = [
    { icon: '🔥', value: '7', label: 'Streak' },
    { icon: '📊', value: '89%', label: 'Retention' },
    { icon: '📚', value: '523', label: 'Reviewed' }
  ];

  const performanceData = [
    { context: 'Biology', percentage: 85, color: 'bg-success' },
    { context: 'Physics', percentage: 92, color: 'bg-primary' },
    { context: 'Spanish', percentage: 78, color: 'bg-warning' },
    { context: 'Math', percentage: 95, color: 'bg-purple-500' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Learning Analytics</h1>
            <p className="text-muted-foreground">Track your progress and performance</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Last</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:border-primary focus:outline-none"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div>
          <h2 className="font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {overviewStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-custom p-6 text-center"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Daily Reviews Chart */}
        <div className="card-custom p-6">
          <h2 className="font-semibold mb-4">Daily Reviews</h2>
          <div className="h-64 flex items-end justify-center space-x-2">
            {/* Mock chart bars */}
            {Array.from({ length: 30 }, (_, i) => {
              const height = Math.random() * 100 + 20;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-primary/60 w-2 rounded-t"
                  style={{ minHeight: '4px' }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-4">
            <span>{timeRange} days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Performance by Context */}
        <div className="card-custom p-6">
          <h2 className="font-semibold mb-6">Performance by Context</h2>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <motion.div
                key={item.context}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div className="w-20 text-sm font-medium">{item.context}:</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-right">{item.percentage}%</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-custom p-6">
            <h3 className="font-semibold mb-4">Study Patterns</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best time of day:</span>
                <span className="font-medium">Morning (9-11 AM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average session:</span>
                <span className="font-medium">12 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Longest streak:</span>
                <span className="font-medium">14 days</span>
              </div>
            </div>
          </div>

          <div className="card-custom p-6">
            <h3 className="font-semibold mb-4">Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="font-medium text-sm">Week Warrior</div>
                  <div className="text-xs text-muted-foreground">7 day streak</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-medium text-sm">Accuracy Expert</div>
                  <div className="text-xs text-muted-foreground">90%+ retention</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <div>
                  <div className="font-medium text-sm">Knowledge Seeker</div>
                  <div className="text-xs text-muted-foreground">500+ cards reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}