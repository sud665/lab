import { useEffect, useState } from 'react';
import { TrendingUp, Plus, Check, Trash2 } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';

export function Dashboard() {
  const { settings, tasks, currentSession, addTask, deleteTask, completeTask, startTask, loadFromStorage } = useAppStore();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinTime, setNewTaskMinTime] = useState(30);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalFocusTime = tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const earnedMoney = calculateMoney(totalFocusTime, settings.hourlyRate);
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        minTime: newTaskMinTime,
      });
      setNewTaskTitle('');
      setNewTaskMinTime(30);
    }
  };

  const currentTask = tasks.find((t) => t.id === currentSession.taskId);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl font-bold mb-4 font-mono">{currentTime}</div>
        <div className="text-2xl text-yellow-500 font-semibold">⏰ 시간은 금이다 💰</div>
      </div>

      {/* Current Task */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-6">
          {currentTask ? (
            <div>
              <div className="text-sm opacity-80 mb-2">현재 작업 중</div>
              <div className="text-3xl font-bold mb-4">{currentTask.title}</div>
              <div className="flex items-center gap-4">
                <div className="font-mono text-2xl">{formatTime(currentTask.totalTime)}</div>
                <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all"
                    style={{
                      width: `${Math.min((currentTask.totalTime / (currentTask.minTime * 60)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="font-mono text-xl">{formatMoney(calculateMoney(currentTask.totalTime, settings.hourlyRate))}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-xl">작업을 선택해서 시작하세요</div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
        {/* Left: Todo List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📝 오늘 할 일</h2>

          {/* Add Task Form */}
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <input
              type="text"
              placeholder="작업 이름..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="w-full bg-slate-700 rounded px-3 py-2 mb-2 outline-none"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newTaskMinTime}
                onChange={(e) => setNewTaskMinTime(Number(e.target.value))}
                min={5}
                step={5}
                className="w-20 bg-slate-700 rounded px-3 py-2 outline-none"
              />
              <span className="text-sm text-slate-400">분</span>
              <button
                onClick={handleAddTask}
                className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus size={16} />
                추가
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-800 rounded-lg p-4 ${
                  task.isCompleted ? 'opacity-50' : ''
                } ${currentSession.taskId === task.id ? 'ring-2 ring-yellow-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => completeTask(task.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      task.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-600'
                    }`}
                  >
                    {task.isCompleted && <Check size={16} />}
                  </button>
                  <div className="flex-1">
                    <div className={`font-semibold ${task.isCompleted ? 'line-through' : ''}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-slate-400">
                      {formatTime(task.totalTime)} / {task.minTime}분
                    </div>
                  </div>
                  <button
                    onClick={() => startTask(task.id)}
                    disabled={task.isCompleted || currentSession.isActive}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    시작
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📊 오늘 통계</h2>
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">총 집중 시간</div>
              <div className="text-3xl font-bold font-mono">{formatTime(totalFocusTime)}</div>
            </div>

            <div className="bg-green-900/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-400" />
                <div className="text-sm text-green-400">획득 금액</div>
              </div>
              <div className="text-3xl font-bold font-mono text-green-400">{formatMoney(earnedMoney)}</div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">완료한 작업</div>
              <div className="text-3xl font-bold">
                {completedCount} / {tasks.length}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-sm text-slate-400 mb-2">일일 목표</div>
              <div className="text-xl">
                {settings.dailyGoal.hours}시간 / {settings.dailyGoal.tasks}개 작업
              </div>
              <div className="mt-2 text-sm text-slate-400">
                시급: {formatMoney(settings.hourlyRate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
