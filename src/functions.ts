import { writeFileSync, readFileSync} from "fs"

interface Student {
    id: number,
    name: string,
    contact: Contact,
    courses: [string?]
}
interface Contact {
    phone?: number,
    email?: string,
    line?: string,
}
interface UpdateStudent {
    name?: string,
    contact?: Contact,
    courses?: [string]
}

export const findStudent = (id: number): Student => {
        const student =  getStudents().find( student => student.id === id)
        if( student !== undefined) return student
        return null
    }

export const createStudent = (student: Student): Student => {
        const students = getStudents()
        const ids = students.map(s => s.id).sort().reverse()
        const id = ids[0] + 1
        const newStudent = {
            id,
            ...student
        }
        const data = JSON.stringify([...students, newStudent] , null, 4)
        writeFileSync('students.json', data)
        return newStudent
    }

export const getStudents = (): [Student] => JSON.parse(readFileSync("students.json").toString())

export const updateStudent = (id: number, updated: UpdateStudent): Student => {
        const student = findStudent(id)
        if(! (student) ) return
        const newArr = getStudents().filter( e => e.id !== id)
        const newStudent = {
            ... student,
            ... removeInvalidFields(updated)
        }
        const data = JSON.stringify([...newArr, newStudent].sort( (a,b) => a.id-b.id ) , null, 4)
        writeFileSync('students.json', data)
        return newStudent
    }
export const deleteStudent = (id:number) => {
        const students = getStudents()
        const newArr = students.filter( e => e.id !== id)
        const data = JSON.stringify(newArr , null, 4)
        writeFileSync('students.json', data)
    }
const removeInvalidFields = (obj:Object): Object =>
        Object.keys(obj).filter(key => {
            const e = obj[key]
            return e && e.length > 0 && Object.keys(e).length > 0 
        }).map(key => { return { [key] : obj[key]} }).reduce(Object.assign)

