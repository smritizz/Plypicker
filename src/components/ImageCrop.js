import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage'; // Utility function to crop image
import '../styles/ImageCrop.css'; // Add any necessary styles

const ImageCrop = ({ imageUrl, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="crop-container">
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        onCropChange={onCropChange}
        onCropComplete={onCropCompleteHandler}
        onZoomChange={onZoomChange}
      />
      <button onClick={handleCrop}>Click Here After Cropping</button>
    </div>
  );
};

export default ImageCrop;
