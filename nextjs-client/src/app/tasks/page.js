'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

import { 
  useGetTasksQuery, 
  useGetUpcomingTasksQuery,
  useGetOverdueTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation 
} from '../../lib/api/taskApi';
import Layout from '../../components/layout/Layout';


const Tasks = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // RTK Query hooks with conditional fetching
  const { data: allTasksData, isLoading: isLoadingAll, error: errorAll } = useGetTasksQuery({ 
    page, 
    limit,
    status: 'pending,in-progress' // Only active tasks, not overdue
  }, {
    skip: activeTab !== 0
  });
  const { data: upcomingTasksData, isLoading: isLoadingUpcoming, error: errorUpcoming } = useGetUpcomingTasksQuery(undefined, {
    skip: activeTab !== 1
  });
  const { data: overdueTasksData, isLoading: isLoadingOverdue, error: errorOverdue } = useGetOverdueTasksQuery(undefined, {
    skip: activeTab !== 2
  });
  
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reset pagination when switching tabs
  };

  const handleOpenDialog = (task = null) => {
    setEditingTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    formik.resetForm();
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete._id).unwrap();
        setDeleteConfirmOpen(false);
        setTaskToDelete(null);
        // Reset page to 1 after deletion
        setPage(1);
      } catch (error) {
        console.error('Failed to delete task:', error);
        // Could add toast notification here
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string(),
      dueDate: Yup.date().required('Required'),
      priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Required'),
      status: Yup.string().oneOf(['pending', 'in-progress', 'completed']).required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        if (editingTask) {
          await updateTask({ id: editingTask._id, ...values }).unwrap();
        } else {
          await createTask(values).unwrap();
        }
        handleCloseDialog();
        // Reset page to 1 to see new/updated task
        setPage(1);
      } catch (error) {
        console.error('Failed to save task:', error);
        // Could add toast notification here
      }
    },
  });

  // Reset form when editing task changes
  useEffect(() => {
    if (editingTask) {
      formik.setValues({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: new Date(editingTask.dueDate),
        priority: editingTask.priority,
        status: editingTask.status,
      });
    }
  }, [editingTask]);

  const renderTaskList = (tasks, isLoading, error) => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box textAlign="center" my={4}>
          <Typography variant="body1" color="error" gutterBottom>
            Failed to load tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message || 'Please try again later'}
          </Typography>
        </Box>
      );
    }

    if (!tasks || tasks.length === 0) {
      const messages = {
        0: 'No active tasks. Create your first task to get started!',
        1: 'No upcoming tasks. Great job staying on top of things!',
        2: 'No overdue tasks. Keep up the good work!'
      };
      return (
        <Typography variant="body1" align="center" my={4} color="text.secondary">
          {messages[activeTab] || 'No tasks found.'}
        </Typography>
      );
    }

    return tasks.map((task) => (
      <Paper key={task._id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">{task.title}</Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {task.description}
              </Typography>
            )}
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                size="small" 
                label={`Due: ${new Date(task.dueDate).toLocaleString()}`} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                size="small" 
                label={`Priority: ${task.priority}`} 
                color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'} 
              />
              <Chip 
                size="small" 
                label={`Status: ${task.status}`} 
                color={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'default'} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
            <IconButton onClick={() => handleOpenDialog(task)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(task)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    ));
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Task
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="task tabs">
              <Tab label="Active Tasks" />
              <Tab label="Upcoming" />
              <Tab label="Overdue" />
            </Tabs>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {activeTab === 0 && (
            <Box>
              {renderTaskList(allTasksData?.data, isLoadingAll, errorAll)}
              {allTasksData?.pagination?.next && (
                <Box textAlign="center" mt={2}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setPage(page + 1)}
                    disabled={isLoadingAll}
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {renderTaskList(upcomingTasksData?.data, isLoadingUpcoming, errorUpcoming)}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {renderTaskList(overdueTasksData?.data, isLoadingOverdue, errorOverdue)}
            </Box>
          )}
        </Paper>

        {/* Task Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Task Title"
                name="title"
                autoFocus
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Due Date"
                  value={formik.values.dueDate}
                  onChange={(value) => formik.setFieldValue('dueDate', value)}
                  slotProps={{
                    textField: {
                      margin: "normal",
                      required: true,
                      fullWidth: true,
                      error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                      helperText: formik.touched.dueDate && formik.errors.dueDate
                    }
                  }}
                />
              </LocalizationProvider>
              <FormControl fullWidth margin="normal">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formik.values.priority}
                  label="Priority"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  label="Status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={formik.handleSubmit} variant="contained">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this task?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Tasks;