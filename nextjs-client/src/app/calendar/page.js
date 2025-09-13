'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
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
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import enUS from "date-fns/locale/en-US";

import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from '../../lib/api/calendarApi';
import Layout from '../../components/layout/Layout';


const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  // RTK Query hooks
  const { data: eventsData, isLoading } = useGetEventsQuery({
    startDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString(),
    endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString(),
  });

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const handleOpenDialog = (event = null) => {
    setEditingEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    formik.resetForm();
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete._id).unwrap();
        setDeleteConfirmOpen(false);
        setEventToDelete(null);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  const handleSelectSlot = ({ start, end }) => {
    formik.setValues({
      title: '',
      description: '',
      startDate: start,
      endDate: end,
      eventType: 'other',
      location: '',
    });
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    setEditingEvent(event);
    formik.setValues({
      title: event.title,
      description: event.description || '',
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      eventType: event.eventType,
      location: event.location || '',
    });
    setOpenDialog(true);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
      eventType: 'other',
      location: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string(),
      startDate: Yup.date().required('Required'),
      endDate: Yup.date()
        .required('Required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
      eventType: Yup.string()
        .oneOf(['class', 'exam', 'assignment', 'meeting', 'personal', 'other'])
        .required('Required'),
      location: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (editingEvent) {
          await updateEvent({ id: editingEvent._id, ...values }).unwrap();
        } else {
          await createEvent(values).unwrap();
        }
        handleCloseDialog();
      } catch (error) {
        console.error('Failed to save event:', error);
      }
    },
  });

  // Transform events for the calendar
  const calendarEvents = eventsData?.data
    ? eventsData.data.map((event) => ({
        ...event,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      }))
    : [];

  // Event style based on type
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // default
    switch (event.eventType) {
      case 'class':
        backgroundColor = '#4caf50'; // green
        break;
      case 'exam':
        backgroundColor = '#f44336'; // red
        break;
      case 'assignment':
        backgroundColor = '#ff9800'; // orange
        break;
      case 'meeting':
        backgroundColor = '#9c27b0'; // purple
        break;
      case 'personal':
        backgroundColor = '#ff5722'; // deep orange
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
      },
    };
  };

  if (isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Calendar</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Event
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 200px)' }}>
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            view={currentView}
            date={currentDate}
            views={['month', 'week', 'day', 'agenda']}
          />
        </Paper>

        {/* Event Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Event Title"
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
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <TextField
                margin="normal"
                fullWidth
                id="location"
                label="Location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="eventType-label">Event Type</InputLabel>
                <Select
                  labelId="eventType-label"
                  id="eventType"
                  name="eventType"
                  value={formik.values.eventType}
                  label="Event Type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.eventType && Boolean(formik.errors.eventType)}
                >
                  <MenuItem value="class">Class</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
                  <DateTimePicker
                    label="Start Time"
                    value={formik.values.startDate}
                    onChange={(value) => formik.setFieldValue('startDate', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && formik.errors.startDate
                      }
                    }}
                  />
                  <DateTimePicker
                    label="End Time"
                    value={formik.values.endDate}
                    onChange={(value) => formik.setFieldValue('endDate', value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && formik.errors.endDate
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </DialogContent>
          <DialogActions>
            {editingEvent && (
              <IconButton
                color="error"
                onClick={() => {
                  handleCloseDialog();
                  handleDeleteClick(editingEvent);
                }}
                sx={{ mr: 'auto' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={formik.handleSubmit} variant="contained">
              {editingEvent ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this event?</Typography>
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

export default Calendar;