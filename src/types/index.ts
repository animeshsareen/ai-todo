export interface Task {
  id: string
  title: string
  completed: boolean
  notes: string
  subTasks: SubTask[]
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
} 