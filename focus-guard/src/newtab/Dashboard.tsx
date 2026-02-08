import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../shared/store';
import { formatTime, formatMoney, calculateMoney, getCurrentTime } from '../shared/utils/time';
import { StatsChart } from '../shared/components/StatsChart';

export function Dashboard() {
  const { settings, tasks, currentSession, rewardStatus, dailyStatsMap, addTask, deleteTask, completeTask, startTask, loadFromStorage, getDailyStats } = useAppStore();
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

  const todayStats = getDailyStats();
  const isRewardActive = rewardStatus.unlimitedUntil !== null && Date.now() < rewardStatus.unlimitedUntil;

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', p: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h1" sx={{ fontSize: '3.75rem', fontWeight: 700, mb: 2, fontFamily: 'monospace' }}>
          {currentTime}
        </Typography>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
          ⏰ 시간은 금이다 💰
        </Typography>
      </Box>

      {/* Reward Banner */}
      {isRewardActive && (
        <Box sx={{ maxWidth: '72rem', mx: 'auto', mb: 2 }}>
          <Alert severity="success" variant="filled" sx={{ justifyContent: 'center', fontWeight: 600 }}>
            일일 목표 달성! 자유시간 활성화
          </Alert>
        </Box>
      )}

      {/* Current Task */}
      <Box sx={{ maxWidth: '72rem', mx: 'auto', mb: 4 }}>
        <Card sx={{ background: 'linear-gradient(to right, #EAB308, #F97316)', borderRadius: 2 }}>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            {currentTask ? (
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, color: '#000' }}>
                  현재 작업 중
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#000' }}>
                  {currentTask.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '1.5rem', color: '#000' }}>
                    {formatTime(currentTask.totalTime)}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((currentTask.totalTime / (currentTask.minTime * 60)) * 100, 100)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#fff', borderRadius: 6 },
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '1.25rem', color: '#000' }}>
                    {formatMoney(calculateMoney(currentTask.totalTime, settings.hourlyRate))}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" sx={{ color: '#000' }}>
                  작업을 선택해서 시작하세요
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: '72rem', mx: 'auto' }}>
        {/* Left: Todo List */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            📝 오늘 할 일
          </Typography>

          {/* Add Task Form */}
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="작업 이름..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                type="number"
                size="small"
                value={newTaskMinTime}
                onChange={(e) => setNewTaskMinTime(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 5, step: 5 } }}
                sx={{ width: 80 }}
              />
              <Typography variant="body2" color="text.secondary">분</Typography>
              <Button
                variant="contained"
                onClick={handleAddTask}
                startIcon={<Plus size={16} />}
                sx={{ ml: 'auto' }}
              >
                추가
              </Button>
            </Box>
          </Paper>

          {/* Task List */}
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tasks.map((task) => (
              <Paper
                key={task.id}
                elevation={2}
                sx={{
                  opacity: task.isCompleted ? 0.5 : 1,
                  outline: currentSession.taskId === task.id ? '2px solid' : 'none',
                  outlineColor: 'primary.main',
                  borderRadius: 2,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: 4 },
                }}
              >
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => startTask(task.id)}
                        disabled={task.isCompleted || currentSession.isActive}
                      >
                        시작
                      </Button>
                      <IconButton edge="end" size="small" onClick={() => deleteTask(task.id)} sx={{ color: 'error.main' }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton dense disableRipple sx={{ cursor: 'default' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        checked={task.isCompleted}
                        onChange={() => completeTask(task.id)}
                        sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'success.main' } }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                          {task.title}
                        </Typography>
                      }
                      secondary={`${formatTime(task.totalTime)} / ${task.minTime}분`}
                    />
                  </ListItemButton>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Grid>

        {/* Right: Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            📊 오늘 통계
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={2} sx={{ p: 3, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>총 집중 시간</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {formatTime(totalFocusTime)}
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp size={20} color="#4ade80" />
                <Typography variant="body2" sx={{ color: '#4ade80' }}>획득 금액</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4ade80' }}>
                {formatMoney(earnedMoney)}
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingDown size={20} color="#f87171" />
                <Typography variant="body2" sx={{ color: '#f87171' }}>손실 금액</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#f87171' }}>
                {formatMoney(todayStats.lostMoney)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(248, 113, 113, 0.6)', mt: 0.5 }}>
                산만 시간: {formatTime(todayStats.totalDistractTime)}
              </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>완료한 작업</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {completedCount} / {tasks.length}
              </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 3, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>일일 목표</Typography>
              <Typography variant="h6">
                {settings.dailyGoal.hours}시간 / {settings.dailyGoal.tasks}개 작업
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                시급: {formatMoney(settings.hourlyRate)}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Weekly Stats Chart */}
      <Box sx={{ maxWidth: '72rem', mx: 'auto', mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          📈 주간 통계
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <StatsChart dailyStatsMap={dailyStatsMap} />
        </Paper>
      </Box>
    </Box>
  );
}
