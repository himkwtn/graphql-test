import { GraphQLServer } from 'graphql-yoga'
const students = require("./students")
import {writeFileSync} from "fs"
const typeDefs = `
  type Query {
    student(id: Int): Student 
  }

  type Mutation {
    createStudent(name: String,contact: ContactInput, courses:[String]): Student!
  }

  type Student {
    id: Int
    name: String
    contact: Contact
    courses: [String]
  }

  type Contact {
    phone: Int
    email: String
    line: String
  }

  input ContactInput {
    phone: Int
    email: String
    line: String
  }
`

const resolvers = {
  Query: {
    student: (_, {id}) => {
      const s = id !== undefined ? findStudent(id) : students
      return s
    }
  },
  Mutation: {
    createStudent:(_,{name,contact,courses}) => {
      const student = {
        id: students.length+1,
        name,
        contact,
        courses
      }
      update(student)
      return findStudent(student.id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

const findStudent = id => students.find( student => student.id == id)

const update = student => {
  students.push(student)
  const data = JSON.stringify(students, null, 4)
  writeFileSync('students.json', data)
}
server.options.port = 4000
server.start(() => console.log(`Server is running on http://localhost:${server.options.port}`))
