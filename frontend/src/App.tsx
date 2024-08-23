import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Card, CardContent, TextField, Modal, Box, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await backend.addPost(data.title, data.body, data.author);
      await fetchPosts();
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Crypto Blog
        </Typography>
        <Box
          sx={{
            height: 200,
            backgroundImage: 'url(https://loremflickr.com/g/1000/200/crypto?lock=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 4,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          sx={{ mb: 4 }}
        >
          New Post
        </Button>
        {posts.map((post) => (
          <Card key={Number(post.id)} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body2" component="p">
                {post.body}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            New Post
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              defaultValue=""
              rules={{ required: 'Body is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Body"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              defaultValue=""
              rules={{ required: 'Author is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Author"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
