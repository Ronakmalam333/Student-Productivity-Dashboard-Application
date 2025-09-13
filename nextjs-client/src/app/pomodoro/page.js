'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  useStartPomodoroMutation,
  useCompletePomodoroMutation,
  useInterruptPomodoroMutation,
  useGetPomodoroStatsQuery,
  useGetRecentPomodorosQuery,
} from '../../lib/api/pomodoroApi';
import Layout from '../../components/layout/Layout';


const Pomodoro = () => {
  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [currentSession, setCurrentSession] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // RTK Query hooks
  const [startSession] = useStartPomodoroMutation();
  const [completeSession] = useCompletePomodoroMutation();
  const [interruptSession] = useInterruptPomodoroMutation();
  const { data: statsData, isLoading: isLoadingStats } = useGetPomodoroStatsQuery();
  const { data: recentSessionsData, isLoading: isLoadingRecent } = useGetRecentPomodorosQuery();

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time <= 1) {
            handleComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      const response = await startSession({
        duration: initialTime / 60, // Convert to minutes
      }).unwrap();
      setCurrentSession(response.data);
      setIsActive(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    if (currentSession) {
      try {
        await interruptSession(currentSession._id).unwrap();
      } catch (error) {
        console.error('Failed to interrupt session:', error);
      }
    }
    resetTimer();
  };

  const handleComplete = async () => {
    if (currentSession) {
      try {
        await completeSession(currentSession._id).unwrap();
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }
    resetTimer();
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(initialTime);
    setCurrentSession(null);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const settingsFormik = useFormik({
    initialValues: {
      focusDuration: initialTime / 60,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsBeforeLongBreak: 4,
    },
    validationSchema: Yup.object({
      focusDuration: Yup.number().min(1).max(60).required('Required'),
      shortBreakDuration: Yup.number().min(1).max(30).required('Required'),
      longBreakDuration: Yup.number().min(5).max(60).required('Required'),
      sessionsBeforeLongBreak: Yup.number().min(1).max(10).required('Required'),
    }),
    onSubmit: (values) => {
      setInitialTime(values.focusDuration * 60);
      setTime(values.focusDuration * 60);
      handleSettingsClose();
    },
  });

  // Calculate progress percentage
  const progress = ((initialTime - time) / initialTime) * 100;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Pomodoro Timer</Typography>
                <IconButton onClick={handleSettingsOpen} color="primary">
                  <SettingsIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 4,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    mb: 3,
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={200}
                    thickness={4}
                    sx={{ color: isActive ? 'primary.main' : 'text.disabled' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h2" component="div" color="text.primary">
                      {formatTime(time)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {!isActive ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<PlayIcon />}
                      onClick={handleStart}
                    >
                      Start
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color={isPaused ? 'primary' : 'secondary'}
                        size="large"
                        startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
                        onClick={handlePauseResume}
                      >
                        {isPaused ? 'Resume' : 'Pause'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        startIcon={<StopIcon />}
                        onClick={handleStop}
                      >
                        Stop
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Current Session
                </Typography>
                <Typography variant="body1">
                  {isActive
                    ? `Focus session in progress (${initialTime / 60} minutes)`
                    : 'No active session'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Statistics
              </Typography>
              {isLoadingStats ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Sessions
                      </Typography>
                      <Typography variant="h6">{statsData?.data?.summary?.totalSessions || 0}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Minutes
                      </Typography>
                      <Typography variant="h6">{statsData?.data?.summary?.totalFocusTime || 0}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Completed
                      </Typography>
                      <Typography variant="h6">{statsData?.data?.summary?.completedSessions || 0}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Interrupted
                      </Typography>
                      <Typography variant="h6">{Math.max(0, (statsData?.data?.summary?.totalSessions || 0) - (statsData?.data?.summary?.completedSessions || 0))}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Recent Sessions
                  </Typography>
                  {isLoadingRecent ? (
                    <CircularProgress size={20} />
                  ) : recentSessionsData?.data?.length > 0 ? (
                    recentSessionsData.data.map((session) => (
                      <Paper
                        key={session._id}
                        variant="outlined"
                        sx={{ p: 1, mb: 1, borderColor: session.completed ? 'success.main' : 'error.main' }}
                      >
                        <Typography variant="body2">
                          {new Date(session.startTime).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            {session.duration} min
                          </Typography>
                          <Chip
                            label={session.completed ? 'Completed' : 'Interrupted'}
                            color={session.completed ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2">No recent sessions</Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onClose={handleSettingsClose} maxWidth="sm" fullWidth>
          <DialogTitle>Timer Settings</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={settingsFormik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <Typography gutterBottom>Focus Duration (minutes)</Typography>
              <Slider
                name="focusDuration"
                value={settingsFormik.values.focusDuration}
                onChange={(e, value) => settingsFormik.setFieldValue('focusDuration', value)}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={60}
              />
              <Typography gutterBottom sx={{ mt: 2 }}>
                Short Break Duration (minutes)
              </Typography>
              <Slider
                name="shortBreakDuration"
                value={settingsFormik.values.shortBreakDuration}
                onChange={(e, value) => settingsFormik.setFieldValue('shortBreakDuration', value)}
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={30}
              />
              <Typography gutterBottom sx={{ mt: 2 }}>
                Long Break Duration (minutes)
              </Typography>
              <Slider
                name="longBreakDuration"
                value={settingsFormik.values.longBreakDuration}
                onChange={(e, value) => settingsFormik.setFieldValue('longBreakDuration', value)}
                valueLabelDisplay="auto"
                step={5}
                min={5}
                max={60}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="sessions-label">Sessions Before Long Break</InputLabel>
                <Select
                  labelId="sessions-label"
                  id="sessionsBeforeLongBreak"
                  name="sessionsBeforeLongBreak"
                  value={settingsFormik.values.sessionsBeforeLongBreak}
                  label="Sessions Before Long Break"
                  onChange={settingsFormik.handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSettingsClose}>Cancel</Button>
            <Button onClick={settingsFormik.handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Pomodoro;