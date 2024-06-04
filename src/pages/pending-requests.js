import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Container,
  AppBar,
Toolbar
} from '@mui/material';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        router.push('/signin');
        return;
      }
      // if (session || session.user.role !== 'admin') {
      //   // router.push('/signin');
        
      //   return(
      //     <Typography variant="body1">{"You don't have access to see all pending requests."}</Typography>
      //   )
      // }

      const res = await fetch('/api/review?status=pending');
      if (!res.ok) {
        console.error('Failed to fetch pending requests');
        return;
      }

      const data = await res.json();
      console.log(data, "pending");
      setRequests(data.submissions);
      setLoading(false);
    };

    fetchPendingRequests();
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
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Pending Requests
          </Typography>
       
           <Button onClick={() => router.push(`/dashboard?role=admin`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    Dashboard
  </Button>
    <Button onClick={() => router.push(`/profile`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    Profile
  </Button> 
        </Toolbar>
      </AppBar>
    <Container sx={{marginBottom:"20px", marginTop:"30px"}}>
    
      {requests.length === 0 ? (
        <Typography variant="body1">No pending requests found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  {request.oldTitle!==request.title ? ( <TableCell style={{ fontSize: '1rem', color:"green", fontStyle: 'italic'  }}>{request.title}</TableCell>) : (<TableCell>{request.title}</TableCell>) }
                  {request.oldDescription!==request.description ? ( <TableCell style={{fontSize: '1rem',color:"green", fontStyle: 'italic'  }}>{request.description}</TableCell>) : (<TableCell>{request.description}</TableCell>) }

                  {request.oldPrice!==request.price ? ( <TableCell style={{ fontSize: '1rem',color:"green",fontStyle: 'italic'  }}>{request.price}</TableCell>) : (<TableCell>{request.price}</TableCell>) }
                  <TableCell align="center">
        {request.oldImage !== request.image ? (
          <IconButton
            onClick={() => window.open(request.image, '_blank')}
            color="primary"
          >
            <VisibilityIcon />
          </IconButton>
        ) : (
          'No image change'
        )}
      </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => router.push(`/pending-requests/${request._id}`)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
    </>
  );
};

export default PendingRequests;













