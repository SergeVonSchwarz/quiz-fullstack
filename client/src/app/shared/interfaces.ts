export interface User {
  email: string
  password: string
}

export interface Answers {
  answers: Array<number>
  user?: string
  userId?: string
  _id?: string
  email?: string
}

export interface Position {
  name: string
  cost: number
  category: string
  user?: string
  _id?: string
}