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
  FormControlLabel,
  Switch,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  BookOutlined as JournalIcon,
  NoteOutlined as NoteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import QuillEditor from '../components/QuillEditor';

import {
  useGetNotesQuery,
  useGetJournalEntriesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../api/noteApi';

const Notes = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // RTK Query hooks
  const { data: notesData, isLoading: isLoadingNotes } = useGetNotesQuery({
    page,
    limit,
    search: searchTerm,
    isJournal: activeTab === 1 ? 'true' : 'false',
  }, {
    skip: activeTab === 1 // Skip notes query when on journal tab
  });

  const { data: journalEntriesData, isLoading: isLoadingJournal } = useGetJournalEntriesQuery({
    page,
    limit,
  }, {
    skip: activeTab === 0 // Skip journal query when on notes tab
  });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handleOpenDialog = (note = null) => {
    setEditingNote(note);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNote(null);
    formik.resetForm();
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete._id);
      setDeleteConfirmOpen(false);
      setNoteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tags: '',
      isJournal: false,
      journalDate: new Date(),
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      content: Yup.string().required('Required'),
      tags: Yup.string(),
      isJournal: Yup.boolean(),
      journalDate: Yup.date(),
    }),
    onSubmit: async (values) => {
      try {
        // Convert tags string to array
        const tagsArray = values.tags
          ? values.tags.split(',').map((tag) => tag.trim())
          : [];

        const noteData = {
          ...values,
          tags: tagsArray,
          journalDate: values.isJournal ? values.journalDate : undefined,
        };

        if (editingNote) {
          await updateNote({ id: editingNote._id, ...noteData }).unwrap();
        } else {
          await createNote(noteData).unwrap();
        }
        handleCloseDialog();
      } catch (error) {

      }
    },
  });

  // Reset form when editing note changes
  useEffect(() => {
    if (editingNote) {
      formik.setValues({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags ? editingNote.tags.join(', ') : '',
        isJournal: editingNote.isJournal || false,
        journalDate: editingNote.journalDate ? new Date(editingNote.journalDate) : new Date(),
      });
    }
  }, [editingNote]);

  const renderNotesList = (notes, isLoading) => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (!notes || notes.length === 0) {
      return (
        <Typography variant="body1" align="center" my={4}>
          No notes found.
        </Typography>
      );
    }

    return notes.map((note) => (
      <Paper key={note._id} elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {note.isJournal ? (
                <JournalIcon color="primary" sx={{ mr: 1 }} />
              ) : (
                <NoteIcon color="primary" sx={{ mr: 1 }} />
              )}
              <Typography variant="h6">{note.title}</Typography>
            </Box>
            <Box>
              <IconButton onClick={() => handleOpenDialog(note)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(note)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              style={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}
            />
          </Grid>
          {note.tags && note.tags.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {note.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(note.createdAt).toLocaleString()}
              {note.updatedAt !== note.createdAt && (
                <> | Updated: {new Date(note.updatedAt).toLocaleString()}</>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notes & Journal</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Note
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="notes tabs">
            <Tab label="All Notes" />
            <Tab label="Journal Entries" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {activeTab === 0 && (
          <Box>
            {renderNotesList(notesData?.data, isLoadingNotes)}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {renderNotesList(journalEntriesData?.data, isLoadingJournal)}
          </Box>
        )}
      </Paper>

      {/* Note Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Content
              </Typography>
              <QuillEditor
                value={formik.values.content}
                onChange={(content) => formik.setFieldValue('content', content)}
                style={{ height: '200px', marginBottom: '50px' }}
              />
              {formik.touched.content && formik.errors.content && (
                <Typography color="error" variant="caption">
                  {formik.errors.content}
                </Typography>
              )}
            </Box>
            <TextField
              margin="normal"
              fullWidth
              id="tags"
              label="Tags (comma separated)"
              name="tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tags && Boolean(formik.errors.tags)}
              helperText={formik.touched.tags && formik.errors.tags}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isJournal}
                  onChange={(e) => formik.setFieldValue('isJournal', e.target.checked)}
                  name="isJournal"
                  color="primary"
                />
              }
              label="This is a journal entry"
              sx={{ mt: 2 }}
            />
            {formik.values.isJournal && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Journal Date"
                  value={formik.values.journalDate}
                  onChange={(value) => formik.setFieldValue('journalDate', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal"
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={formik.handleSubmit} variant="contained">
            {editingNote ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notes;