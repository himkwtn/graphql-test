import { GraphQLServer } from 'graphql-yoga'
import { getStudents, findStudent, createStudent} from "./functions"

const resolvers = {
  Query: {
    student: (_, {id}) => {
      return findStudent(id)
    },
    students: () => {
      return getStudents()
    }
  },
  Mutation: {
    createStudent:(_,arg) => {
      return createStudent(arg)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.options.port = 4000
server.start(() => console.log(`Server is running on http://localhost:${server.options.port}`))
