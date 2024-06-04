import dbConnect from '../../../utils/dbConnect';
import Review from '../../../models/Review';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  await dbConnect();

  const { request_id } = req.query;

  if (req.method === 'GET') {
    try {
      const request = await Review.findById(request_id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
      res.status(200).json({ success: true, request });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

else if (req.method === 'PUT') {
  try {
    const { status, admin } = req.body; 
    const request = await Review.findById(request_id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;

    
    request.admin=admin.id;

    if (status === 'approved') {
      request.admin = admin.id; 
      await Product.findByIdAndUpdate(request.productId, {
        title: request.title,
        description: request.description,
        price: request.price,
        image:request.image
      });
    }

    const updatedRequest = await request.save();
    res.status(200).json({ success: true, request: updatedRequest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
}