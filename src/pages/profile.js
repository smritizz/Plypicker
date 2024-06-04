import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container,AppBar,Toolbar,Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, CircularProgress, Link, Box } from '@mui/material';

export default function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
        const fetchStats = async () => {
          const session = await getSession();
          if (!session) {
            router.push('/signin');
            return;
          }
          setRole(session.user.role);
          setEmail(session.user.email);
          setId(session.user.id);
          //  const email=session.user.email;
          //  const role=session.user.role;
          if(session.user.role!="admin")
            {
              
          const res = await fetch(`/api/review?author=${session.user.id}`, {
            method: 'GET', // Note the method type
          });
    
          if (!res.ok) {
            console.error('Failed to fetch stats');
            return;
          }
          const data = await res.json();
          setStats(data.stats);
          setLoading(false);
        }
        else
        {
          const res = await fetch(`/api/review?admin=${session.user.id}`, {
            method: 'GET', // Note the method type
          });
    
          if (!res.ok) {
            console.error('Failed to fetch stats');
            return;
          }
          const data = await res.json();
          setStats(data.stats);
          setLoading(false);
        }
         
        };
    
        fetchStats();
      }, [router]);
    
      if (loading) {
        return <p>Loading...</p>;
      }
    

      return (
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Profile
              </Typography>
              <Button
                onClick={() => router.push(`/dashboard?role=${role}`)}
                color="inherit"
                sx={{ marginLeft: 2, textDecoration: 'none' }}
              >
                Dashboard
              </Button>
              {role === 'admin' ? (
                <Button
                  onClick={() => router.push(`/pending-requests`)}
                  color="inherit"
                  sx={{ marginLeft: 2, textDecoration: 'none' }}
                >
                  Pending Requests
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/profile/my_submissions`)}
                  color="inherit"
                  sx={{ marginLeft: 2, textDecoration: 'none' }}
                >
                  My Submissions
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
              <Typography variant="h4" gutterBottom>
                Profile
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><Typography variant="h6"><strong>Email:</strong></Typography></TableCell>
                      <TableCell><Typography variant="body1">{email}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Typography variant="h6"><strong>ID:</strong></Typography></TableCell>
                      <TableCell><Typography variant="body1">{id}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><Typography variant="h6"><strong>Role:</strong></Typography></TableCell>
                      <TableCell><Typography variant="body1">{role}</Typography></TableCell>
                    </TableRow>
                    {role !== 'admin' ? (
                      <>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Total Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.totalRequestsOfTeamMember || 0}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Approved Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.approvedRequestsOfTeamMember || 0}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Rejected Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.rejectedRequestsOfTeamMember || 0}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Pending Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.pendingRequestsOfTeamMember || 0}</Typography></TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Total Pending Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.totalRequestsOfAdmin || 0}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Approved Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.approvedRequestsOfAdmin || 0}</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography variant="h6"><strong>Rejected Requests:</strong></Typography></TableCell>
                          <TableCell><Typography variant="body1">{stats.rejectedRequestsOfAdmin || 0}</Typography></TableCell>
                        </TableRow>
                      </>
                    )}
                    <TableRow>
                      <TableCell colSpan={2}>
                        {role === 'team_member' ? (
                          <Link href="/profile/my_submissions" variant="body1" color="primary">
                            My submissions
                          </Link>
                        ) : (
                          <Link href="/pending-requests" variant="body1" color="primary">
                            Pending Requests
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Container>
        </>
      );
    };
    