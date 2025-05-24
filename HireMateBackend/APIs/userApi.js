const express = require('express');
const hireMateUserapp = express.Router();
hireMateUserapp.use(express.json());

require('dotenv').config();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

//freelauncers registration
hireMateUserapp.post('/user-1', async (req, res) => {
  const usersCollection = req.app.get('usersCollection');
  const walletAndRatingCollection = req.app.get('walletAndRatingCollection');

  try {
      const currUser = req.body;
      const ifExists = await usersCollection.findOne({ username: currUser.username });
      if (ifExists !== null) {
          return res.status(409).send({ message: "User already exists" });
      }

      const hashedPassword = await bcryptjs.hash(currUser.password, 7);
      currUser.password = hashedPassword;

      await usersCollection.insertOne(currUser);

      const walletAndRatingData = {
          username: currUser.username,
          wallet: 0,
          rating: currUser.role === 'Hirer' ? undefined : {
              totalRatings: 0,
              totalScore: 0,
              averageRating: 0,
              ratedBy: [],
          },
      };
      await walletAndRatingCollection.insertOne(walletAndRatingData);


      res.status(201).send({ message: "User created successfully" });
  } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send({ message: 'Error creating user' });
  }
});

//hirers registration
hireMateUserapp.post('/user-2', async (req, res) => {
    const usersCollection = req.app.get('hirersCollection');
    try {
        const currUser = req.body;
        const ifExists = await usersCollection.findOne({ username: currUser.username });
        if (ifExists !== null) {
            return res.status(409).send({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs.hash(currUser.password, 7);
        currUser.password = hashedPassword;
        await usersCollection.insertOne(currUser);
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send({ message: 'Error creating user' });
    }
});

//freelauncers login
hireMateUserapp.post('/login-1', async (req, res) => {
    const usersCollection = req.app.get('usersCollection');
    const userCred = req.body;
    try {
        const isUser = await usersCollection.findOne({ username: userCred.username });
        if (isUser === null) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        const isPasswordValid = await bcryptjs.compare(userCred.password, isUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        const signedToken = jwt.sign(
            { username: isUser.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const { password, ...userDetails } = isUser;
        console.log(userDetails);
        res.send({ message: "Login successful", token: signedToken, user: userDetails });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ message: 'Error during login' });
    }
});


//hirers login
hireMateUserapp.post('/login-2', async (req, res) => {
    const usersCollection = req.app.get('hirersCollection');
    const userCred = req.body;
    try {
        const isUser = await usersCollection.findOne({ username: userCred.username });
        if (isUser === null) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        const isPasswordValid = await bcryptjs.compare(userCred.password, isUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid username or password" });
        }
        const signedToken = jwt.sign(
            { username: isUser.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const { password, ...userDetails } = isUser;
        console.log(userDetails);
        res.send({ message: "Login successful", token: signedToken, user: userDetails });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ message: 'Error during login' });
    }
});

//adding description of freelauncerjobs
hireMateUserapp.post('/edit', async (req, res) => {
  const { username, description, location, portfolio, skills } = req.body;
  console.log(username);
  const usersCollection = req.app.get('usersCollection');

  try {
      const user = await usersCollection.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const updateFields = {};
      if (description) updateFields.description = description;
      if (location) updateFields.location = location;
      if (portfolio) updateFields.portfolio = portfolio;
      if (skills) updateFields.skills = skills;

      await usersCollection.updateOne(
          { username },
          { $set: updateFields }
      );

      return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Internal server error" });
  }
});


//accepting the friend request
hireMateUserapp.delete('/friendAccepted/:freelauncerUsername/:hirerUsername/:data', async (req, res) => {
    const { freelauncerUsername, hirerUsername, data } = req.params;
    const freelauncersCollection = req.app.get('usersCollection');
    const hirersCollection = req.app.get('hirersCollection');
  
    try {
      const freelancer = await freelauncersCollection.findOne({ username: freelauncerUsername });
      const hirer = await hirersCollection.findOne({ username: hirerUsername });
  
      if (!freelancer || !hirer) {
        return res.status(404).send({ message: 'Freelancer or Hirer not found' });
      }
  
      if (data === 'Accepted') {
        await hirersCollection.updateOne(
          { username: hirerUsername },
          { $addToSet: { responses: { username: freelauncerUsername, state: 1 } } }
        );
      } else {
        await hirersCollection.updateOne(
          { username: hirerUsername },
          { $addToSet: { responses: { username: freelauncerUsername, state: 0 } } }
        );
      }
  
      if(data === 'Accepted'){
      await freelauncersCollection.updateOne(
        { username: freelauncerUsername },
        {
          $pull: { pendingRequests: { username: hirerUsername } },
          $addToSet: { acceptedRequests: { username: hirerUsername, details: hirer } },
        }
      );
      }
      else
      {
        await freelauncersCollection.updateOne(
            { username: freelauncerUsername },
            {
              $pull: { pendingRequests: { username: hirerUsername } }
            }
          );
      }
  
      res.status(200).send({ message: 'Friend request successfully updated' });
    } catch (error) {
      console.error('Error in updating the user\'s accepted list:', error);
      res.status(500).send({ message: 'Failed to update. Please try again.' });
    }
  });
  

//friend requset..
hireMateUserapp.delete('/friendRequested/:freelauncerUsername/:hirerUsername',async(req,res)=>{
    const {freelauncerUsername,hirerUsername}=req.params;
    const freelauncersCollection = req.app.get('usersCollection');
    const hirersCollection = req.app.get('hirersCollection');

    try {
        const freelancer = await freelauncersCollection.findOne({ username: freelauncerUsername });
        const hirer = await hirersCollection.findOne({ username: hirerUsername });

        if (!freelancer || !hirer) {
            return res.status(404).send({ message: 'Freelancer or Hirer not found' });
        }

        await freelauncersCollection.updateOne(
            { username: freelauncerUsername },
            {
                $addToSet: { pendingRequests: { username: hirer.username, details: hirer } }
            }
        );

        res.status(200).send({ message: 'Friend request successfully updated' });

    } catch (error) {
        console.error("Error in updating the user's requested list:", error);
        res.status(500).send({ message: 'Failed to update. Please try again.' });
    }
})

//getting the freelauncers
hireMateUserapp.get('/users',async(req,res)=>{
    const usersCollection = req.app.get('usersCollection');
    try {
        let users = await usersCollection.find().toArray();
        res.send({message:"Users",payload:users});
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Error fetching users' });
    }
})

//to delete the responses
hireMateUserapp.delete('/deleteResponse/:hirerUsername/:freelancerUsername', async (req, res) => {
    const { hirerUsername, freelancerUsername } = req.params;
    const hirersCollection = req.app.get('hirersCollection');

    try {
        const result = await hirersCollection.updateOne(
            { username: hirerUsername },
            { $pull: { responses: { username: freelancerUsername , state:0 } } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Response successfully deleted' });
        } else {
            res.status(404).send({ message: 'Response not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).send({ message: 'Failed to delete response. Please try again.' });
    }
});

//to post the messages
hireMateUserapp.post('/messagePost', async (req, res) => {
    const data = req.body;
    console.log(data);
    const allMessagesCollection= req.app.get('allMessagesCollection');
    try {
        const existingMessagesDoc = await allMessagesCollection.findOne({
            participants: { $all: data.participants }
        });

        if (existingMessagesDoc) {
            const updatedMessages = [...existingMessagesDoc.messages, ...data.messages];

            await allMessagesCollection.updateOne(
                { _id: existingMessagesDoc._id },
                { $set: { messages: updatedMessages } }
            );

            return res.status(200).send({ message: 'Message added successfully', data: updatedMessages });
        } else {
            const newMessageDoc = {
                participants: data.participants,
                messages: data.messages
            };

            await allMessagesCollection.insertOne(newMessageDoc);

            return res.status(201).send({ message: 'New conversation started', data: newMessageDoc });
        }
    } catch (error) {
        console.error('Error handling message post:', error);
        res.status(500).send({ message: 'An error occurred while saving the message.' });
    }
});

//get messages
hireMateUserapp.get('/getmessage/:sender/:receiver', async (req, res) => {
    const allMessagesCollection = req.app.get('allMessagesCollection');
    const { sender, receiver } = req.params;
    const users = [sender, receiver];
  
    try {
      const messageList = await allMessagesCollection.findOne({
        participants: { $all: users },
      });
  
      if (!messageList || !messageList.messages) {
        return res.status(404).send({
          message: "No conversation found between the specified users.",
          payload: [],
        });
      }
  
      return res.status(200).send({
        message: "Messages are fetched",
        payload: messageList.messages,
      });
    } catch (error) {
      return res.status(500).send({
        message: "An error occurred while fetching messages.",
        error: error.message,
      });
    }
  });
  

 // Add data to jobDoneList
hireMateUserapp.post('/jobdonelist', async (req, res) => {
    const jobDoneList = req.app.get('jobDoneList');
    const data = req.body;
  
    try {
      await jobDoneList.insertOne(data);
      res.status(201).send({ message: "Job List updated successfully" });
    } catch (error) {
      return res.status(500).send({
        message: "An error occurred while updating the job list.",
        error: error.message,
      });
    }
  });
  
  // Retrieve the jobDoneList
  hireMateUserapp.get('/getjobList', async (req, res) => {
    const jobDoneList = req.app.get('jobDoneList');
  
    try {
      const jobList = await jobDoneList.find().toArray(); // Fetch all documents
      res.status(201).send({ message: "Job List fetched successfully", list: jobList });
    } catch (error) {
      return res.status(500).send({
        message: "An error occurred while fetching the job list.",
        error: error.message,
      });
    }
  });
  
  //creating the walletAndRating document for every user
  hireMateUserapp.post('/createWalletAndRating', async (req, res) => {
    try {
      const usersCollection = req.app.get('usersCollection');
      const hirersCollection = req.app.get('hirersCollection');
      const walletAndRatingCollection = req.app.get('walletAndRatingCollection');
  
      const freelancersData = await usersCollection.find().toArray();
      const freelancersWalletAndRating = freelancersData.map((freelancer) => ({
        username: freelancer.username,
        wallet: 0,
        rating: {
          totalRatings: 0,
          totalScore: 0,
          averageRating: 0,
          ratedBy: [],
        },
      }));
  
      const hirersData = await hirersCollection.find().toArray();
      const hirersWalletOnly = hirersData.map((hirer) => ({
        username: hirer.username,
        wallet: 0,
      }));
  
      const walletAndRatingData = [
        ...freelancersWalletAndRating,
        ...hirersWalletOnly,
      ];
  
      await walletAndRatingCollection.insertMany(walletAndRatingData);
  
      res.status(201).send({
        message: 'Wallet and Rating documents created successfully!',
        payload: walletAndRatingData,
      });
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while creating Wallet and Rating documents.',
        error: error.message,
      });
    }
  });
  

  //updating the ratings
  hireMateUserapp.post('/updateRating', async (req, res) => {
    const walletAndRating = req.app.get('walletAndRatingCollection');
    const { username, newRating, ratedByUser } = req.body;
  
    try {
      const user = await walletAndRating.findOne({ username });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      if (user.rating.ratedBy.includes(ratedByUser)) {
        return res.status(400).send({ message: 'You have already rated this user.' });
      }
  
      const totalRatings = user.rating?.totalRatings || 0;
      const totalScore = user.rating?.totalScore || 0;
  
      const updatedRatings = totalRatings + 1;
      const updatedScore = totalScore + newRating;
      const updatedAverageRating = updatedScore / updatedRatings;
  
      await walletAndRating.updateOne(
        { username },
        {
          $set: {
            'rating.totalRatings': updatedRatings,
            'rating.totalScore': updatedScore,
            'rating.averageRating': updatedAverageRating,
          },
          $push: {
            'rating.ratedBy': ratedByUser,
          },
        }
      );
  
      res.status(200).send({
        message: 'Rating updated successfully',
        updatedRating: {
          totalRatings: updatedRatings,
          totalScore: updatedScore,
          averageRating: updatedAverageRating,
        },
      });
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while updating the rating.' });
    }
  });
  
  //get the all users rating list
  hireMateUserapp.get('/getAllRatings',async(req,res)=>{
    const walletAndRatingCollection = req.app.get('walletAndRatingCollection');
    try {
        const allRatingsList = await walletAndRatingCollection.find().toArray();
        res.send({message:"Ratings List fetched" , payload:allRatingsList});
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching the ratings.' });
    }
  })

  

module.exports = hireMateUserapp;