// // // api/reviews.js

// pages/api/reviews.js
import dbConnect from '../../utils/dbConnect';
import Review from '../../models/Review';
import { getSession } from 'next-auth/react';


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { productId, title,oldTitle, description,oldDescription, price,oldPrice,oldImage, author, image } = req.body;
        console.log(oldTitle,oldDescription,oldPrice,"old");
      // Create a new review document
      const newReview = new Review({
        oldTitle,
        oldImage,
        oldDescription,
        oldPrice,
        productId,
        title,
        description,
        price,
        author,
        image,
        status: 'pending',
      });

      // Save the review to MongoDB
      const savedReview = await newReview.save();

      res.status(201).json(savedReview);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    try {
      const {admin,author, status } = req.query;
      const query = {};
       console.log(admin);
      if (author) query.author = author;
      if (status) query.status = status;
      if (admin) query.admin = admin;
      console.log(query.admin);


      const totalRequestsOfAdmin = await Review.countDocuments({status: 'pending'});
      const approvedRequestsOfAdmin = await Review.countDocuments({ admin,status: 'approved' });
      const rejectedRequestsOfAdmin = await Review.countDocuments({ admin,status: 'rejected' });
      const pendingRequestsOfTeamMember = await Review.countDocuments({author,status: 'pending'});
      const totalRequestsOfTeamMember = await Review.countDocuments({author});
      const approvedRequestsOfTeamMember = await Review.countDocuments({ author,status: 'approved' });
      const rejectedRequestsOfTeamMember = await Review.countDocuments({ author,status: 'rejected' });

      const submissions = await Review.find(query);
      res.status(200).json({ success: true, submissions,  stats: {
        totalRequestsOfAdmin,
        approvedRequestsOfAdmin,
        rejectedRequestsOfAdmin,
        totalRequestsOfTeamMember,
        pendingRequestsOfTeamMember,
        approvedRequestsOfTeamMember,
        rejectedRequestsOfTeamMember,
      }, });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
//   }else if (req.method === 'PATCH') {
//     const session = await getSession({ req });

//     if (!session) {
//       return res.status(401).json({ success: false, message: 'Not authenticated' });
//     }

//     try {
//       const { admin,author } = req.query;
//     //   if (!author) {
//     //     return res.status(400).json({ success: false, message: 'Author ID is required' });
//     //   }

//       const totalRequestsOfAdmin = await Review.countDocuments({status: 'pending'});
//       const approvedRequestsOfAdmin = await Review.countDocuments({ admin,status: 'approved' });
//       const rejectedRequestsOfAdmin = await Review.countDocuments({ admin,status: 'rejected' });
//       const totalRequestsOfTeamMember = await Review.countDocuments({author});
//       const pendingRequestsOfTeamMember = await Review.countDocuments({ author,status: 'pending' });
//       const approvedRequestsOfTeamMember = await Review.countDocuments({ author,status: 'approved' });
//       const rejectedRequestsOfTeamMember = await Review.countDocuments({ author,status: 'rejected' });

//       res.status(200).json({
//         success: true,
//         stats: {
//           totalRequestsOfAdmin,
//           approvedRequestsOfAdmin,
//           rejectedRequestsOfAdmin,
//           totalRequestsOfTeamMember,
//           pendingRequestsOfTeamMember,
//           approvedRequestsOfTeamMember,
//           rejectedRequestsOfTeamMember,
//         },
//       });
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
  }
   else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }


}
















// // import Review from '../../models/Review';

// // export default async function handler(req, res) {
// //   if (req.method === 'POST') {
// //     try {
// //       const { productId, title, description,price, author} = req.body;

// //       // Create a new review document
// //       const newReview = new Review({
// //         productId,
// //         title,
// //         description,
// //         price,
// //         author, 
// //         status: 'pending',// Assuming you have user information in the request
// //       });

// //       // Save the review to MongoDB
// //       const savedReview = await newReview.save();

// //       res.status(201).json(savedReview);
// //     } catch (error) {
// //       res.status(400).json({ success: false, error: error.message });
// //     }
// //   } else {
// //     res.status(405).json({ success: false, message: 'Method not allowed' });
// //   }
// // }

// // pages/api/reviews.js
// import dbConnect from '../../utils/dbConnect';
// import Review from '../../models/Review';
// import { getSession } from 'next-auth/react';

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === 'POST') {
//     try {
//       const { productId, title, description, price, author } = req.body;

//       // Create a new review document
//       const newReview = new Review({
//         productId,
//         title,
//         description,
//         price,
//         author,
//         status: 'pending',
//       });

//       // Save the review to MongoDB
//       const savedReview = await newReview.save();

//       res.status(201).json(savedReview);
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else if (req.method === 'GET') {
//     const session = await getSession({ req });

//     if (!session) {
//       return res.status(401).json({ success: false, message: 'Not authenticated' });
//     }

//     try {
//       const { author } = req.query;
//       if (!author) {
//         return res.status(400).json({ success: false, message: 'Author ID is required' });
//       }

//       const submissions = await Review.find({ author });
//       res.status(200).json({ success: true, submissions });
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else {
//     res.status(405).json({ success: false, message: 'Method not allowed' });
//   }
// }

