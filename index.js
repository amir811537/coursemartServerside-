const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// amirhossainbc75
// sHiKJoo3fAljOTPP

// midewaare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yb9d5d.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productDB").collection("products");
    const brandCollection = client.db("productDB").collection("brand");
    const courseCollection = client.db("productDB").collection("courses");
    const profileCollection = client.db("productDB").collection("profileInfo");

    // user collection
    const usercollection = client.db("productDB").collection("user");

    // adding courses for job task
    app.post("/courses", async (req, res) => {
      const course = req.body;
      // console.log('get product',product)
      const result = await courseCollection.insertOne(course);
      res.send(result);
    });

    //getting products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get added courses
    app.get("/courses", async (req, res) => {
      const cursor = courseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //getting brand
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get products by brand
    app.get("/products/:brand", async (req, res) => {
      const brandName = req.params.brand;

      const query = { brandname: brandName.toLowerCase() };
      // console.log(query)
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get singel product by id
    app.get("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await courseCollection.findOne(query);
      res.send(result);
    });

    // updated a products
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          photourl: updatedProduct.photourl,
          brandname: updatedProduct.brandname,
          name: updatedProduct.name,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          type: updatedProduct.type,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    // delete a data
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    //user related api post
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });
    app.get("/user", async (req, res) => {
      const cursor = usercollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //  user get with email and products
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = usercollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //user profile related api post
    app.post("/profileInfo", async (req, res) => {
      const profileInfo = req.body;
      const result = await profileCollection.insertOne(profileInfo);
      res.send(result);
    });


     //getting all profile info
     app.get("/profileInfo", async (req, res) => {
      const cursor = profileCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete profile 
    app.delete('/profileInfo/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)}
      const result =await profileCollection.deleteOne(query);
      res.send(result)
    })


    // make admin apis 
    app.patch('/profileInfo/admin/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={ _id: new ObjectId(id)};
      const updatedDocs={
        $set:{
          role: "admin"
        }
      }
      const result =await profileCollection.updateOne(query,updatedDocs)
      res.send(result)
    })

// check by email isAdmin 
app.get('/profileInfo/admin/:email',async(req,res)=>{
  const clientEmail=req.params.email;
  // console.log(email)
const query ={email: clientEmail};
const profile =await profileCollection.findOne(query)
let admin ;
if(profile){
  admin = profile.role === 'admin';

}
console.log(admin)
res.send({admin})

})


    // get profile info using email
    app.get("/profileInfo/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = profileCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get profileinfo by id
    app.get("/profileInfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await profileCollection.findOne(query);
      res.send(result);
    });


// PATCH route for updating user profile information
app.patch("/profileInfo/:id", async (req, res) => {
  const { id } = req.params;
  const profileInfoUpdates = req.body;

  try {
    const result = await profileCollection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: profileInfoUpdates }
    );

    res.send(result);
  } catch (error) {
    console.error("Error updating profile information:", error);
    res.status(500).send("Internal server error");
  }
});

    //  user delete
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
