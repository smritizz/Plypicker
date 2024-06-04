import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Container, Grid, Paper, RadioGroup, FormControlLabel, Radio, Link } from '@mui/material';
import bcrypt from 'bcryptjs';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('team_member');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setError('All the fields are required.');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: hashedPassword, role }),
    });

    if (res.ok) {
      router.push('/signin');
    } else {
      const data = await res.json(); 
      setError(data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Role
              </Typography>
              <RadioGroup aria-label="role" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="team_member" control={<Radio />} label="Team Member" />
              </RadioGroup>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Typography align="center" sx={{ mt: 2 }}>
            Already have a user? <Link href="/signin">Sign in here</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}





