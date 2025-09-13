'use client';

import { TextField } from '@mui/material';

// Simplified editor component to avoid SSR issues
const QuillEditor = ({ value = '', onChange, style, ...props }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <TextField
      multiline
      rows={8}
      fullWidth
      value={value}
      onChange={handleChange}
      placeholder="Write your content here..."
      sx={style}
      {...props}
    />
  );
};

export default QuillEditor;