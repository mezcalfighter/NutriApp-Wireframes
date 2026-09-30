import { useState } from 'react';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { TrendingDown, TrendingUp, Target, Calendar } from 'lucide-react';

export default function ProgressTracking() {
  const [timeRange, setTimeRange] = useState('week');

  const currentStats = {
    weight: 68.0,
    targetWeight: 65.0,
    startWeight: 70.5,
    bmi: 24.2,
    bodyFat: 22,
  };

  const weightHistory = [
    { date: '2024-01-01', weight: 70.5, notes: 'Starting weight' },
    { date: '2024-01-02', weight: 70.3, notes: '' },
    { date: '2024-01-03', weight: 70.0, notes: 'Feeling good!' },
    { date: '2024-01-04', weight: 69.5, notes: '' },
    { date: '2024-01-05', weight: 69.2, notes: '' },
    { date: '2024-01-06', weight: 68.8, notes: '' },
    { date: '2024-01-07', weight: 68.5, notes: '' },
    { date: '2024-01-08', weight: 68.0, notes: 'Great progress!' },
  ];

  const totalLoss = currentStats.startWeight - currentStats.weight;
  const remaining = currentStats.weight - currentStats.targetWeight;
  const progressPercentage = ((totalLoss / (currentStats.startWeight - currentStats.targetWeight)) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header title="Progress Tracking" showMenu />

      <div className="p-4 space-y-4">
        {/* Progress Summary */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <h2 className="text-white mb-4">Your Progress</h2>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <p className="text-emerald-100 mb-2">Current Weight</p>
            <div className="flex items-end gap-2">
              <p className="text-white text-4xl">{currentStats.weight}</p>
              <p className="text-emerald-100 mb-2">kg</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-emerald-100 mb-1">Total Loss</p>
              <p className="text-white">{totalLoss.toFixed(1)} kg</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-emerald-100 mb-1">To Goal</p>
              <p className="text-white">{remaining.toFixed(1)} kg</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-emerald-100 mb-2">
              <span>Progress to goal</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500">BMI</p>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-900 text-2xl">{currentStats.bmi}</p>
            <p className="text-slate-500">Normal range</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500">Body Fat</p>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-slate-900 text-2xl">{currentStats.bodyFat}%</p>
            <p className="text-emerald-600">-3% from start</p>
          </div>
        </div>

        {/* Goal Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-900">Goal</h3>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 mb-1">Target Weight</p>
              <p className="text-slate-900 text-2xl">{currentStats.targetWeight} kg</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 mb-1">Estimated</p>
              <p className="text-emerald-600">7 days</p>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 mb-3">Weight History</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTimeRange('week')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                timeRange === 'week'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                timeRange === 'month'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                timeRange === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-50 text-slate-700'
              }`}
            >
              All
            </button>
          </div>

          {/* Simple Chart Representation */}
          <div className="space-y-2 mb-4">
            {weightHistory.map((entry, idx) => {
              const barWidth = ((entry.weight - 60) / 15) * 100; // Scale for visualization
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-slate-500 w-16 text-sm">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                    <div
                      className="bg-emerald-500 rounded-full h-6 flex items-center justify-end pr-2"
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-white text-xs">{entry.weight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weight Log */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 mb-3">Recent Entries</h3>
          <div className="space-y-3">
            {weightHistory.slice().reverse().slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex items-start justify-between pb-3 last:pb-0 last:border-0 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-900">{entry.weight} kg</p>
                    <p className="text-slate-500">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    {entry.notes && <p className="text-slate-600 italic">{entry.notes}</p>}
                  </div>
                </div>
                {idx < weightHistory.length - 1 && (
                  <div className="flex items-center gap-1">
                    {weightHistory[weightHistory.length - 1 - idx].weight < weightHistory[weightHistory.length - 2 - idx]?.weight ? (
                      <>
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 text-sm">
                          -{(weightHistory[weightHistory.length - 2 - idx]?.weight - weightHistory[weightHistory.length - 1 - idx].weight).toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-600 text-sm">
                          +{(weightHistory[weightHistory.length - 1 - idx].weight - weightHistory[weightHistory.length - 2 - idx]?.weight).toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileNav role="patient" />
    </div>
  );
}
