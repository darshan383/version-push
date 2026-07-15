const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs");
const {MongoClient, ReturnDocument} =require("mongodb");
const dotenv=require("dotenv");
var ObjectId=require("mongodb").ObjectId


dotenv.config();
const uri=process.env.MONGODB_URL;

let client;

async function connectClient(){
    if(!client){
        client=new MongoClient(uri);
        await client.connect();
    }
}

const signup=async(req,res)=>{
   const {username,password,email}=req.body;
   try{
    await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");

    const user=await usersCollection.findOne({username});
    if(user){
        return res.status(400).json({message:"User already exists!"})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser={
        username,
        password:hashedPassword,
        email,
        repositories:[],
        followedUsers:[],
        starRepos:[]
    }

    const result =await usersCollection.insertOne(newUser);
  

    const token = jwt.sign(
      { id: result.insertedId,username:result.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

res.json({token,userId:result.insertedId,username:result.username });
   }catch(err){
    console.error("Error during signup : ",err.message);
    res.status(500).send("Server error");
   }
};






const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
         await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");

    const user=await usersCollection.findOne({email});
    if(!user){
       return res.status(400).json({message:"Invalid credential"})
    }
    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({message:"Invalid Credential"})
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
    console.log("userid:",user._id)
    res.json({token,userId:user._id,username:user.username})

    }catch(err){
        console.error("Error during login : ",err.message);
        res.status(500).send("Server error!")
    }
};





const getAllUsers=async(req,res)=>{
   try{
    await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");
    const users=await usersCollection.find({}).toArray();
   
    res.json(users);

   }catch(err){
        console.error("Error during fetching : ",err.message);
        res.status(500).send("Server error!")
    }
};



const getUserProfile=async(req,res)=>{
  const currentID=req.params.id;
    try{
          await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");

    const user=await usersCollection.findOne({
        _id:new ObjectId(currentID) , //currentID will be the string so thats why we converted that id as a mongodb id
      
    })
      if(!user){
       return res.status(404).json({message:"User not found"})
    }
    res.send(user)

    }catch(err){
        console.error("Error during fetching : ",err.message);
        res.status(500).send("Server error!")
    }
    
};




const updateUserProfile=async(req,res)=>{
    const currentID=req.params.id;
    const {email,password}=req.body;

    try{
        await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");

        let updateFields={email};
        if(password){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);
            updateFields.password=hashedPassword;
        }
        const result=await usersCollection.findOneAndUpdate(
            { _id:new ObjectId(currentID),  },
            { $set: updateFields },
            { returnDocument:"after"}

    );
    if(!result){
        return res.status(404).json({message:"User not found!"})
    }
    res.send(result);


    }catch(err){
        console.error("Error during updation : ",err.message);
        res.status(500).send("Server error!")
    }
};



const deleteUserProfile=async(req,res)=>{
     const currentID=req.params.id;

     try{
        await connectClient();
    const db=client.db("githubclone")
    const usersCollection=db.collection("users");

    const result=await usersCollection.deleteOne({
        _id:new ObjectId(currentID),
    });

     if(result.deletedCount===0){
        return res.status(404).json({message:"User not found!"})
    }

    res.json({message:"User Profile Deleted!"})


     }catch(err){
        console.error("Error during Deletion: ",err.message);
        res.status(500).send("Server error!")
    }
};

module.exports={
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}