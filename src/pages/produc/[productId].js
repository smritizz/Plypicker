import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Card, CardContent, CardActions, CardMedia } from '@mui/material';
import ImageUploader from '../../components/ImageUploader';
import { getSession } from 'next-auth/react';

const ProductDetail = () => {
  const router = useRouter();
  const { productId } = router.query;
  const [prod, setProd] = useState(null);
  const [oldProd, setOldProd] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?productId=${productId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        setProd(data.product);
        setOldProd(data.product);
        setTitle(data.product.title);
        setPrice(data.product.price);
        setDescription(data.product.description);
        setExistingImage(data.product.image);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchUserRole = async () => {
      const session = await getSession();
      setRole(session.user.role);
      setAuthor(session.user.id);
    };

    if (productId) {
      fetchProduct();
    }
    fetchUserRole();
  }, [productId]);

  const handleImageUpload = (fileUrl) => {
    setNewImage(fileUrl);
  };

  const handleSubmitForReview = async () => {
        
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldTitle:oldProd.title,
            oldDescription:oldProd.description,
            oldPrice:oldProd.price,
            oldImage:oldProd.image,


            productId,
            title,
            price,
            description,
            author,
            image: newImage || existingImage,
          }),
        });
    
        if (res.ok) {
          router.push('/profile/my_submissions');
        } else {
          console.error('Failed to submit review');
        }
      };
    
      const handleDone = async () => {
        try {
          const res = await fetch(`/api/products?productId=${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title,
              description,
              price,
              image: newImage || existingImage,
            }),
          });
    
          if (res.ok) {
            router.push(`/dashboard?role=${role}`);
          } else {
            console.error('Failed to update product');
          }
        } catch (error) {
          console.error('Error updating product:', error);
        }
      };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>{prod ? prod.title : 'Loading...'}</Typography>
        <Grid container spacing={4} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia component="img" height="300" image={existingImage} alt="Product Image" />
              <CardContent>
                <Typography variant="body1" gutterBottom>Price: ${price}</Typography>
                <Typography variant="body1" gutterBottom>Description: {description}</Typography>
              </CardContent>
              <CardActions>
                {/* {role === 'admin' && (
                  <Button onClick={handleEdit} variant="contained">Edit</Button>
                )} */}
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} spacing={3}>
          <Typography variant="body1" color="#ADD8E6" gutterBottom>Edit Here</Typography>

            {/* {isEditing && ( */}
              <div>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  fullWidth
                  multiline
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <ImageUploader onImageUpload={handleImageUpload} productId={productId} />

                {role === 'admin' ? (
            <Button variant="contained" onClick={handleDone}>Save Changes</Button>
          ) : (
           <Button variant="contained" onClick={handleSubmitForReview}>Submit for Review</Button>
          )}
                
              </div>
            {/* )} */}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;

