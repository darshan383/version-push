const mongoose=require('mongoose');
const Repository=require("../models/repoModel");
const User=require("../models/userModel");
const Issue=require("../models/issueModel");



const createRepository=async(req,res)=>{
    const {owner,name,issues,content,description,visibility}=req.body;
    try{
        if(!name){
            return res.status(400).json({error:"Repository name is required!"})
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){ //owner is the valid object of mongodb or not check
             return res.status(400).json({error:"Invalid User ID!"})

        }
        const existingRepo = await Repository.findOne({
            owner,
            name
        });

        if (existingRepo) {
             return res.status(400).json({
          error: "Repository already exists"
         });
        }


        const newRepository=new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });

        const result=await newRepository.save();

        await User.findByIdAndUpdate(
  owner,
  {
    $push: {
      repositories: result._id,
    },
  },
  { new: true }
);

        res.status(201).json({
            message:"Repository created!",
            repositoryID:result._id,
        })

    }catch(err){
        console.error("Error during repository creation : ",err.message);
        res.status(500).send("Server error!")
    }
}






const getAllRepositories=async(req,res)=>{
   try{
    const repositories=await Repository.find({})
    .populate("owner").populate("issues");

    res.json(repositories);

   }catch(err){
        console.error("Error during fetching repositories : ",err.message);
        res.status(500).send("Server error!")
    }
}




const fetchRepositoryById=async(req,res)=>{
    const {id}=req.params;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({
        error: "Invalid repository id"
         });
      }


        const repository=await Repository.find({_id:id}).populate("owner").populate("issues");

        res.json(repository);

    }catch(err){
        console.error("Error during fetching repository : ",err.message);
        res.status(500).send("Server error!")
    }

}



const fetchRepositoryByName=async(req,res)=>{
   const {name}=req.params;
    try{
        const repository=await Repository.find({name}).populate("owner").populate("issues");

        res.json(repository);

    }catch(err){
        console.error("Error during fetching repository : ",err.message);
        res.status(500).send("Server error!")
    }
}



async function fetchedRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}


const updateRepositoryById=async(req,res)=>{
   const {id}=req.params;
    const {content,description}=req.body;

    try{
        const repository=await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"})
        }
        repository.content.push(content);
        repository.description=description;

        const updatedRepository=await repository.save();
        res.json({message:"repository updated successfully!",repository:updatedRepository,})

    }catch(err){
        console.error("Error during udating repository : ",err.message);
        res.status(500).send("Server error!")
    }
}




const toggleVisibilityById=async(req,res)=>{
     const {id}=req.params;
    // const {visibility}=req.body;

    try{
        const repository=await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"})
        }
        repository.visibility=!repository.visibility;

        const updatedRepository=await repository.save();
        res.json({message:"Repository visibility toggled successfully!",repository:updatedRepository,})

    }catch(err){
        console.error("Error during toggling visibility repository : ",err.message);
        res.status(500).send("Server error!")
    }
}




const deleteRepositoryById=async(req,res)=>{
  const {id}=req.params;


  try{
    const repository=await Repository.findByIdAndDelete(id);
    if(!repository){
            return res.status(404).json({error:"Repository not found"})
        }
        res.json({message:"Repository deleted successfully!"})

  }catch(err){
        console.error("Error during deleting repository : ",err.message);
        res.status(500).send("Server error!")
    }
}

module.exports={
createRepository,
getAllRepositories,
fetchRepositoryById,
fetchRepositoryByName,
fetchedRepositoriesForCurrentUser,
updateRepositoryById,
toggleVisibilityById,
deleteRepositoryById
}