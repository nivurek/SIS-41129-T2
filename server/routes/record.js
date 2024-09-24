import express from "express";
// This will help us connect to the database
import db from "../db/connection.js";
// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const usersCollection = db.collection('users');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from "multer";
import { GridFSBucket } from "mongodb";


/*
// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});
*/

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email in MongoDB Atlas
    const user = await usersCollection.findOne({ email });
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
}
);


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