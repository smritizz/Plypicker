
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';

const RequestDetail = () => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');

  const router = useRouter();
  const { request_id } = router.query;

  useEffect(() => {
    const fetchRequestDetail = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        router.push('/signin');
        return;
      }

      setId(session.user.id);

      const res = await fetch(`/api/reviews/${request_id}`);
      if (!res.ok) {
        console.error('Failed to fetch request detail');
        return;
      }

      const data = await res.json();
      setRequest(data.request);
      setLoading(false);
    };

    if (request_id) {
      fetchRequestDetail();
    }
  }, [request_id, router]);

  const handleApprove = async () => {
    const res = await fetch(`/api/reviews/${request_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'approved', admin: {id}}),
    });

    if (res.ok) {
      router.push('/pending-requests');
    } else {
      console.error('Failed to approve request');
    }
  };

  const handleReject = async () => {
    const session = await getSession();
    setId(session.user.id);
    if (!session || session.user.role !== 'admin') {
      router.push('/signin');
      return;
    }
    const res = await fetch(`/api/reviews/${request_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected',  admin: {id} }),
    });

    if (res.ok) {
      router.push('/pending-requests');
    } else {
      console.error('Failed to reject request');
    }
  };

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
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        Review Requests
      </Typography>
   
       <Button onClick={() => router.push(`/dashboard?role=admin`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
DashBoard
</Button>
<Button onClick={() => router.push(`/pending-requests`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
Pending Requests
</Button> 
    </Toolbar>
  </AppBar>
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {request ? (
        <Card style={{ width: '100%', maxWidth: 600 }}>
          {request.image && (
            <CardMedia
              component="img"
              height="300"
              image={request.image}
              alt={request.title}
            />
          )}
          <CardContent>
            {/* <Typography variant="h4" component="h1" gutterBottom>
              Review Request
            </Typography> */}
             {request.image!==request.oldImage && (<Typography variant="body1" color="red">{"New Image requested: "}<IconButton
            onClick={() => window.open(request.image, '_blank')}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton></Typography>)}
            <Typography variant="h5" component="h2" gutterBottom>
             {request.oldTitle}
            </Typography>
           {request.title!==request.oldTitle && <Typography variant="body1" color="red">{"New Title requested: "}{request.title}</Typography>}
            <Typography variant="h6" color="textSecondary" gutterBottom>
            {request.oldDescription}
            </Typography>
            {request.description!==request.oldDescription && <Typography variant="body1" color="red">{"New Description Requested: "}{request.description}</Typography>}
            <Typography variant="h6" color="textSecondary" gutterBottom>
            {"Price: "}{request.oldPrice}
            </Typography>
            {request.price!==request.oldPrice && <Typography variant="body1" color="red">{"New Price Requested: "}{request.price}</Typography>}
            <Typography variant="h6" color="textSecondary">
              Status: {request.status}
            </Typography>
          </CardContent>
          <CardActions style={{ justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              style={{ marginRight: '10px' }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
            >
              Reject
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Typography variant="h6">Request not found.</Typography>
      )}
    </Container>
    </>
  );
};

export default RequestDetail;










