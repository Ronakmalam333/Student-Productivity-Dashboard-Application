import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  CircularProgress, 
  Alert,
  Skeleton,
  Card,
  CardContent
} from '@mui/material';

import { useGetUpcomingTasksQuery, useGetOverdueTasksQuery, useGetTasksQuery } from '../api/taskApi';
import { useGetDayEventsQuery, useGetEventsQuery } from '../api/calendarApi';
import { useGetPomodoroStatsQuery, useGetRecentPomodorosQuery } from '../api/pomodoroApi';
import { useGetNotesQuery } from '../api/noteApi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Get comprehensive data for dashboard context
  const { data: upcomingTasks, isLoading: tasksLoading, error: tasksError } = useGetUpcomingTasksQuery();
  const { data: overdueTasks } = useGetOverdueTasksQuery();
  const { data: allTasks } = useGetTasksQuery({ limit: 100 });
  const { data: todayEvents, isLoading: eventsLoading, error: eventsError } = useGetDayEventsQuery(today);
  const { data: weekEvents } = useGetEventsQuery({
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
  });
  const { data: pomodoroStats, isLoading: statsLoading, error: statsError } = useGetPomodoroStatsQuery();
  const { data: recentPomodoros } = useGetRecentPomodorosQuery(10);
  const { data: recentNotes } = useGetNotesQuery({ limit: 100 });
  const { data: allNotes } = useGetNotesQuery({ limit: 1000 });
  
  // Calculate comprehensive stats with full context
  const taskStats = {
    total: allTasks?.data?.length || 0,
    completed: allTasks?.data?.filter(task => task.status === 'completed').length || 0,
    inProgress: allTasks?.data?.filter(task => task.status === 'in-progress').length || 0,
    pending: allTasks?.data?.filter(task => task.status === 'pending').length || 0,
    overdue: overdueTasks?.data?.length || 0,
    completionRate: allTasks?.data?.length > 0 ? 
      Math.round((allTasks.data.filter(task => task.status === 'completed').length / allTasks.data.length) * 100) : 0
  };
  
  const eventStats = {
    today: todayEvents?.data?.length || 0,
    thisWeek: weekEvents?.data?.length || 0,
    upcoming: weekEvents?.data?.filter(event => new Date(event.startDate) > new Date()).length || 0
  };
  
  const productivityStats = {
    todaySessions: pomodoroStats?.data?.summary?.totalSessions || 0,
    todayCompleted: pomodoroStats?.data?.summary?.completedSessions || 0,
    todayFocusTime: pomodoroStats?.data?.summary?.totalFocusTime || 0,
    recentSessionsCount: recentPomodoros?.data?.length || 0,
    completionRate: pomodoroStats?.data?.summary?.completionRate || 0
  };
  
  const contentStats = {
    totalNotes: allNotes?.data?.length || 0,
    journalEntries: allNotes?.data?.filter(note => note.isJournal).length || 0
  };

  const LoadingSkeleton = () => (
    <Box>
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 1 }} />
    </Box>
  );

  const ErrorAlert = ({ message }) => (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message || 'Failed to load data. Please try again.'}
    </Alert>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 500,
          color: 'text.primary'
        }}
      >
        Welcome back, {user?.name || 'Student'}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Upcoming Tasks
              </Typography>
              {tasksLoading ? (
                <LoadingSkeleton />
              ) : tasksError ? (
                <ErrorAlert message="Failed to load tasks" />
              ) : upcomingTasks?.data?.length > 0 ? (
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {upcomingTasks.data.slice(0, 5).map((task) => (
                    <Paper 
                      key={task._id} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        borderLeft: 4, 
                        borderColor: 
                          task.priority === 'high' ? 'error.main' : 
                          task.priority === 'medium' ? 'warning.main' : 'success.main',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-1px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(task.dueDate).toLocaleDateString()} | Status: {task.status}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : allTasks?.data?.filter(task => task.status !== 'completed').length > 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No tasks due in the next 7 days
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    You have {allTasks.data.filter(task => task.status !== 'completed').length} pending task{allTasks.data.filter(task => task.status !== 'completed').length !== 1 ? 's' : ''}
                  </Typography>
                  <Box sx={{ mt: 2, maxHeight: 150, overflowY: 'auto' }}>
                    {allTasks.data.filter(task => task.status !== 'completed').slice(0, 3).map((task) => (
                      <Paper 
                        key={task._id} 
                        elevation={1} 
                        sx={{ 
                          p: 1.5, 
                          mb: 1, 
                          borderLeft: 3, 
                          borderColor: task.status === 'overdue' ? 'error.main' : 'warning.main',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 2,
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => navigate('/tasks')}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'} | {task.status}
                        </Typography>
                      </Paper>
                    ))}
                    {allTasks.data.filter(task => task.status !== 'completed').length > 3 && (
                      <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={() => navigate('/tasks')}>
                        View all {allTasks.data.filter(task => task.status !== 'completed').length} tasks →
                      </Typography>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first task to get started!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Today's Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Today's Events
              </Typography>
              {eventsLoading ? (
                <LoadingSkeleton />
              ) : eventsError ? (
                <ErrorAlert message="Failed to load events" />
              ) : todayEvents?.data?.length > 0 ? (
                <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {todayEvents.data.slice(0, 5).map((event) => (
                    <Paper 
                      key={event._id} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 1,
                        borderLeft: 4,
                        borderColor: event.color || 'primary.main',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-1px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {event.title || event.summary || 'Untitled Event'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.allDay 
                          ? 'All day' 
                          : `${new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                             ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        }
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No events today
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enjoy your free time!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Task Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 280 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Task Management Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.completionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.completed}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Done
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.inProgress}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.pending}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box textAlign="center">
                    <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                      {taskStats.overdue}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Overdue
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Pomodoro Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 200 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Productivity Stats
              </Typography>
              {statsLoading ? (
                <LoadingSkeleton />
              ) : statsError ? (
                <ErrorAlert message="Failed to load productivity stats" />
              ) : pomodoroStats?.data ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {pomodoroStats?.data?.summary?.totalSessions || 0}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Total Sessions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {pomodoroStats?.data?.summary?.completedSessions || 0}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center" sx={{ p: 2 }}>
                      <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                        {pomodoroStats?.data?.summary?.totalFocusTime || 0}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Focus Minutes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No productivity data available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a Pomodoro session to track your progress!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activity Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Weekly Activity Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {eventStats.today}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today's Events
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {eventStats.thisWeek}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This Week's Events
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                      {contentStats.totalNotes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Notes & Documents
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {contentStats.journalEntries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Journal Entries
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {/* Quick Insights */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📊 Quick Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      🎯 Task completion rate: <strong>{taskStats.completionRate}%</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      🍅 Focus efficiency: <strong>{Math.round(productivityStats.completionRate)}%</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      📅 Upcoming events: <strong>{eventStats.upcoming}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      ⚠️ Tasks need attention: <strong>{taskStats.overdue + taskStats.pending}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;