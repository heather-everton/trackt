const { AuthenticationError } = require('apollo-server-express');
const { User, Goal } = require('../models');
const { signToken } = require('../utils/auth');
const { GraphQLDate } = require('graphql-iso-date');

const resolvers = {
    Date: GraphQLDate,
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('goals')
            .populate('friends');
        
            return userData;
        }
        
        throw new AuthenticationError('Not logged in');
      },
      // get all users
      users: async () => {
        return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('goals');
      },
      // get a user by username
      user: async (parent, { username }) => {
        return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('goals');
      },
      goals: async (parent, { username }) => {
        const params = username ? { username } : {};
        return Goal.find(params).sort({ createdAt: -1 });
      },  
      goal: async (parent, { _id }) => {
        return Goal.findOne({ _id });
      }          
    },
    Mutation: {
      login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
        
          if (!user) {
            throw new AuthenticationError('Incorrect credentials');
          }
        
          const correctPw = await user.isCorrectPassword(password);
        
          if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials');
          }
        
          const token = signToken(user);
          return { token, user };
      },
      addUser: async (parent, args) => {
          const user = await User.create(args);
          const token = signToken(user);
        
          return { token, user };
      },
      updateUser: async (parent, args, context) => {
        if (context.user) {
          return await User.findByIdAndUpdate(context.user._id, args, { new: true });
        }
  
        throw new AuthenticationError('Not logged in');
      },
      addGoal: async (parent, args, context) => {
          if (context.user) {
            const goal = await Goal.create({ ...args, username: context.user.username });
        
            await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { goals: goal._id } },
              { new: true }
            );
        
            return goal;
          }
        
          throw new AuthenticationError('You need to be logged in!');
      },
      updateGoal: async (parent, args, context) => {
        if (context.goal) {
          return await Goal.findByIdAndUpdate(context.goal._id, args, { new: true });
        }
  
        throw new AuthenticationError('Not logged in');
      },
      addMilestone: async (parent, { goalId, milestoneTitle }, context) => {
        if (context.user) {
          const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId },
            { $push: { milestones: { milestoneTitle, username: context.user.username } } },
            { new: true, runValidators: true }
          );
      
          return updatedGoal;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
      deleteMilestone: async (parent, { goalId, milestoneId }, context) => {
        if (context.user) {
          const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId },
            { $pull: { milestones: { milestoneId, username: context.user.username } } },
            { new: true, runValidators: true }
          );
      
          return updatedGoal;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },
      addComment: async (parent, { goalId, commentBody }, context) => {
          if (context.user) {
            const updatedGoal = await Goal.findOneAndUpdate(
              { _id: goalId },
              { $push: { comments: { commentBody, username: context.user.username } } },
              { new: true, runValidators: true }
            );
        
            return updatedGoal;
          }
        
          throw new AuthenticationError('You need to be logged in!');
      },
      addFriend: async (parent, { friendId }, context) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { friendRequests: friendId } },
              { new: true }
            ).populate('friendRequests');
        
            return updatedUser;
          }
        
          throw new AuthenticationError('You need to be logged in!');
      },
      acceptFriend: async (parent, { friendId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { friends: friendId } },
            { new: true }
          ).populate('friends');
      
          return updatedUser;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      }, 
      removeFriend:  async (parent, { friendId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { friends: friendId } },
            { new: true }
          ).remove('friends');
      
          return updatedUser;
        }
      
        throw new AuthenticationError('You need to be logged in!');
      },     
    }
};
  
module.exports = resolvers;
  