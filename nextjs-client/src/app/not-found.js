'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;