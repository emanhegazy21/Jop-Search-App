export const companyType = `
  type Company {
    _id: ID!
    name: String!
    email: String!
    logo: String
    coverPic: String
    isBanned: Boolean
    isApproved: Boolean
  }
`;

export const getAllCompanies = `
  getAllCompanies: [Company]
`;
