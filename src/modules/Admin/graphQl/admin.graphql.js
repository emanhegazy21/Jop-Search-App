import { GraphQLObjectType, GraphQLList, GraphQLSchema } from 'graphql';
import { userType, getAllUsers } from '../../User/graphql/user.graphql.js';
import { companyType, getAllCompanies } from '../../Company/graphql/company.graphql.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    allUsers: {
      type: new GraphQLList(userType),
      resolve: getAllUsers
    },
    allCompanies: {
      type: new GraphQLList(companyType),
      resolve: getAllCompanies
    }
  }
});

export const adminSchema = new GraphQLSchema({
  query: RootQuery
});
