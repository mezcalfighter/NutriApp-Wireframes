import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Plus, Trash2, Save } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function SetAvailability() {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00' },
    { id: '2', day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
    { id: '3', day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
  ]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setTimeSlots(
      timeSlots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/nutritionist/appointments');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <Header title="Set Availability" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 mb-4">Weekly Schedule</h3>

          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <select
                    value={slot.day}
                    onChange={(e) => updateTimeSlot(slot.id, 'day', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(slot.id)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTimeSlot}
            className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-slate-200"
          >
            <Plus className="w-5 h-5" />
            Add Time Slot
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 mb-3">Appointment Duration</h3>
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Availability
          </button>
        </div>
      </form>
    </div>
  );
}