import { useState } from "react"
import { Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/types"

interface TaskSidebarProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  selectedTask: Task | null
  onTaskSelect: (task: Task | null) => void
}

export default function TaskSidebar({ 
  tasks, 
  setTasks, 
  selectedTask, 
  onTaskSelect 
}: TaskSidebarProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      notes: '',
      subTasks: []
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
  }

  return (
    <div className="w-80 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button size="icon" type="submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
              selectedTask?.id === task.id 
                ? 'bg-secondary' 
                : 'hover:bg-secondary/50'
            }`}
            onClick={() => onTaskSelect(task)}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                setTasks(tasks.map(t =>
                  t.id === task.id ? { ...t, completed: checked as boolean } : t
                ))
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 