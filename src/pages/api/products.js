// import dbConnect from '../../utils/dbConnect';
// import Product from '../../models/Product';
// import { getSession } from 'next-auth/react';

// export default async function handler(req, res) {
//   await dbConnect();
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   if (req.method === 'GET') {
//     try {
//       if (req.query.productId) {
//         const product = await Product.findById(req.query.productId);
//         if (!product) {
//           return res.status(404).json({ success: false, message: 'Product not found' });
//         }
//         return res.status(200).json({ success: true, product });
//       } else {
//         const products = await Product.find({});
//         res.status(200).json({ success: true, products });
//       }
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else if (req.method === 'PUT') {
//     try {
//       const { title, description, image } = req.body;
//       const product = await Product.findByIdAndUpdate(
//         req.query.productId,
//         { title, description, image },
//         { new: true }
//       );
//       if (!product) {
//         return res.status(404).json({ success: false, message: 'Product not found' });
//       }
//       res.status(200).json({ success: true, product });
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else {
//     res.status(405).json({ success: false, message: 'Method not allowed' });
//   }
// }






















import mongoose from 'mongoose';
import Product from '../../models/Product';

const MONGODB_URI = "mongodb+srv://okayxyz91:Smriti%4015@cluster0.ws7xmqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
}

export default async function handler(req, res) {
  await dbConnect();


  if (req.method === 'GET') {
    try {
      // Connect to the database if not already connected
      if (mongoose.connection.readyState < 1) {
        await mongoose.connect(MONGODB_URI, {
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
        });
      }
      console.log(req.query.p);
      
      if (req.query.productId) {
        // If productId is provided in query params, fetch individual product
        const product = await Product.findById(req.query.productId);
        if (!product) {
          console.log("No product found");
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        return res.status(200).json({ success: true, product });
      } else {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
  else if (req.method === 'PUT') {
    try {
      const { productId } = req.query;
      const { title, description,price, image } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      product.title = title;
      product.description = description;
      product.price= price;
      product.image= image;

      await product.save();

      res.status(200).json({ success: true, product });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }

}

  



//   // if (req.method === 'GET') {
//   //   try {
//   //     const products = await Product.find({});
//   //     res.status(200).json({ success: true, products });
//   //   } catch (error) {
//   //     res.status(400).json({ success: false, error: error.message });
//   //   }
//   // } else {
//   //   res.status(405).json({ success: false, message: 'Method not allowed' });
//   // }