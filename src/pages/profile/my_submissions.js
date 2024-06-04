import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  CardMedia,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/signin');
        return;
      }

      const res = await fetch(`/api/review?author=${session.user.id}`);
      if (!res.ok) {
        console.error('Failed to fetch submissions');
        return;
      }

      const data = await res.json();
      setSubmissions(data.submissions);
      setLoading(false);
    };

    fetchSubmissions();
  }, [router]);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
    <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            My Requests
          </Typography>
       
           <Button onClick={() => router.push(`/dashboard?role=team_member`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    DashBoard
  </Button>
    <Button onClick={() => router.push(`/profile`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    Profile
  </Button> 
        </Toolbar>
      </AppBar>
    <Container>
      {/* <Typography variant="h4" component="h1" gutterBottom>
        My Submissions
      </Typography> */}
      {submissions.length === 0 ? (
        <Typography variant="body1">No submissions found.</Typography>
      ) : (
        <Grid container spacing={4}>
          {submissions.map((submission) => (
            <Grid   sx={{marginBottom:"30px"}} spacing={3} item key={submission._id} xs={12} sm={6} md={4}>
              <Card>
              <CardMedia component="img" height="200" image={submission.image} alt={submission.title} />
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {submission.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {submission.description}
                  </Typography>
                  {submission.status === 'approved' && (
        <Typography variant="body1" style={{ color: 'green' }}>
          Status: {submission.status}
        </Typography>
      )}
      {submission.status === 'rejected' && (
        <Typography variant="body1" style={{ color: 'red' }}>
          Status: {submission.status}
        </Typography>
      )}
      {submission.status === 'pending' && (
        <Typography variant="body1" style={{ color: 'black' }}>
          Status: {submission.status}
        </Typography>
      )}
                  <Typography variant="body1">
                    Price: ${submission.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </>
  );
};

export default MySubmissions;














