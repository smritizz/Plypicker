// // components/ImageUploader.js

// import React, { useState } from 'react';
// import { storage } from '../utils/firebase';
// import ImageCrop from './ImageCrop';

// const ImageUploader = () => {
//   const [image, setImage] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setImage(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   const handleCropComplete = (croppedImageUrl) => {
//     setCroppedImage(croppedImageUrl);
//   };

//   const handleUpload = () => {
//     const uploadTask = storage.ref(`images/${Date.now()}-${image.name}`).putString(croppedImage, 'data_url');

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         // progress function
//         const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//         setUploadProgress(progress);
//       },
//       (error) => {
//         // error function
//         console.error(error);
//       },
//       () => {
//         // complete function
//         storage
//           .ref('images')
//           .child(image.name)
//           .getDownloadURL()
//           .then((url) => {
//             console.log('Uploaded image URL:', url);
//           });
//       }
//     );
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageChange} />
//       {image && <ImageCrop imageUrl={image} onCropComplete={handleCropComplete} />}
//       <button onClick={handleUpload}>Upload</button>
//       <p>Upload progress: {uploadProgress}%</p>
//     </div>
//   );
// };

// export default ImageUploader;


import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { storage } from '../utils/firebase';
import ImageCrop from './ImageCrop';
import { ref, uploadString, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
const ImageUploader = ({ onImageUpload, productId,price,author,title, description }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cropping, setCropping] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setCropping(true);
    }
  };
  
  const handleCropComplete = (croppedImageUrl) => {
    setCroppedImage(croppedImageUrl);
    setCropping(false);
  };

  const handleUpload = async () => {
    if (!croppedImage) {
      console.error('No cropped image to upload.');
      return;
    }
    console.log(croppedImage,"c");

    
    // const uploadTask = storage.ref(`images/${Date.now()}-cropped`).putString(croppedImage, 'data_url');
//     const storageRef = ref(storage, `images/${Date.now()}-cropped`);
//     const uploadTask = uploadString(storageRef, croppedImage);

//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//         setUploadProgress(progress);
//       },
//       (error) => {
//         console.error(error);
//       },
//       async () => {
//         const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
//         onImageUpload(downloadURL);
//       }
//     );
//   };
const response = await fetch(croppedImage);
    const blob = await response.blob();

const storageRef = ref(storage, `images/${Date.now()}-cropped.jpeg`);
const uploadTask = uploadBytesResumable(storageRef, blob);
    // const uploadTask = uploadBytesResumable(storageRef, new Blob([croppedImage], { type: 'image/jpeg' }));

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onImageUpload(downloadURL);
  
    // const session = await getSession();
           
    //     const res = await fetch('/api/review', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           productId,
    //           title,
    //           price,
    //           description,
    //           author: session.user.id,
    //           image: downloadURL
    //         }),
    //       });
      
    //       if (res.ok) {
    //         // router.push('/profile/my_submissions');
    //       } else {
    //         console.error('Failed to submit review');
    //       }
    
      }
    );

  
  };
  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {cropping && image && <ImageCrop imageUrl={image} onCropComplete={handleCropComplete} />}
      <button onClick={handleUpload}> Click Here To Upload</button>
      <p>Upload progress: {uploadProgress}%</p>
    </div>
  );
};

export default ImageUploader;
