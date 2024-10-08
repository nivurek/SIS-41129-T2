import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email in MongoDB Atlas
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/api/upload/:userId/:projectName/:pageName', upload.single('image'), async (req, res) => {
  const userId = req.params.userId;
  const projectName = req.params.projectName;
  const pageName = req.params.pageName;
  const readableStream = new stream.PassThrough();
  readableStream.end(req.file.buffer);
  const filename = req.file.originalname;
  // Upload image to GridFS
  const uploadStream = bucket.openUploadStream(filename, {
    metadata: { contentType: req.file.mimetype }
  });

  readableStream.pipe(uploadStream);

  uploadStream.on('error', () => res.status(500).send('Error uploading file'));
  
  uploadStream.on('finish', async (file) => {
    try {
      // Update the user document to store the GridFS file ID in the Results.Image field
      const user = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(userId), "Projects.Name": projectName, "Projects.Pages.PageName": pageName },
        {
          $set: {
            "Projects.$[project].Pages.$[page].Results.Image": {
              fileId: file._id,  // Store the GridFS file ID here
              filename: file.filename,
              contentType: file.metadata.contentType
            }
          }
        },
        {
          arrayFilters: [
            { "project.Name": projectName },
            { "page.PageName": pageName }
          ],
          returnDocument: 'after'
        }
      );

      res.status(201).json({ message: 'Image uploaded and saved successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Error updating user document' });
    }
  });
});

// Route to retrieve image from GridFS by file ID
router.get('/api/image/:fileId', (req, res) => {
  const fileId = new ObjectId(req.params.fileId);

  // Stream the image from GridFS
  bucket.openDownloadStream(fileId)
    .pipe(res)
    .on('error', () => res.status(404).json({ error: 'Image not found' }));
});


export default router;