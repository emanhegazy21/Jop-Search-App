export const userType = `
  type User {
    _id: ID!
    username: String!
    email: String!
    mobileNumber: String
    role: String!
    isBanned: Boolean
    profilePic: String
    coverPic: String
  }
`;

export const getAllUsers = `
  getAllUsers: [User]
`;
