

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Grid, Typography, Link, Card, Button, CardContent, CardMedia, AppBar, Toolbar } from '@mui/material';
import PendingRequests from './pending-requests';

const Dashboard = () => {
  const router = useRouter();
  const { role } = router.query;
  const [prodds, setProdds] = useState([]);

  useEffect(() => {
    const fetchProdds = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProdds(data.products);
        } else {
          console.error('Failed to fetch prodds:', res.status);
        }
      } catch (error) {
        console.error('Error fetching prodds:', error);
      }
    };

    fetchProdds();
  }, []);

  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
       
           <Button onClick={() => router.push(`/profile`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    Profile
  </Button>
  {role === 'admin' ? <Button onClick={() => router.push(`/pending-requests`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    Pending Requests 
  </Button> :   <Button onClick={() => router.push(`/profile/my_submissions`)}  color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    My Submissions
  </Button> }
        </Toolbar>
      </AppBar>
      <Container sx={{ paddingTop: 4 }}>
        
        <DashboardByRole prodds={prodds} role={role} />
      </Container>
    </div>
  );
};

// const StyledLink = ({ href, children }) => (
//   <Link href={href} color="inherit" sx={{ marginLeft: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
//     {children}
//   </Link>
// );
const StyledLink = ({ href, onClick, children }) => (
  <Button onClick={() => router.push(`/produc/${productId}`)} component={href ? Link : 'button'} to={href} color="inherit" sx={{ marginLeft: 2, textDecoration: 'none' }}>
    {children}
  </Button>
);
const DashboardByRole = ({ prodds, role }) => {
  const router = useRouter();

  const handleProductClick = (productId) => {
    router.push(`/produc/${productId}`);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>{role.toUpperCase()}
       {" Dashboard"}</Typography>
      <Grid container spacing={3}>
        {prodds.map((prodd) => (
          <Grid item xs={12} sm={6} md={4} key={prodd._id}>
            <Card onClick={() => handleProductClick(prodd._id)} style={{ cursor: 'pointer' }}>
              <CardMedia component="img" height="200" image={prodd.image} alt={prodd.title} />
              <CardContent>
                <Typography variant="subtitle1">{prodd.title}</Typography>
                <Typography variant="body2" color="textSecondary">ID: {prodd._id}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};



export default Dashboard;
