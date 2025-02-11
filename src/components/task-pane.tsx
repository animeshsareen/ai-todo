"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { generateSubTasks } from "@/lib/gemini"
import type { Task, SubTask } from "@/types"

interface TaskPaneProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  onTaskSelect: (task: Task | null) => void
}

export default function TaskPane({ tasks, setTasks, onTaskSelect }: TaskPaneProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id)
    onTaskSelect(task)
  }

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

  const handleGenerateSubTasks = async (task: Task) => {
    setIsGenerating(true)
    try {
      const subTaskTitles = await generateSubTasks(task.title)
      const newSubTasks: SubTask[] = subTaskTitles.map((title, index) => ({
        id: `${task.id}-sub-${index}`,
        title,
        completed: false
      }))

      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, subTasks: newSubTasks } : t
      )
      setTasks(updatedTasks)
      
      // Update selected task if this is the currently selected one
      if (task.id === selectedTaskId) {
        onTaskSelect(updatedTasks.find(t => t.id === task.id) || null)
      }
    } catch (error) {
      console.error('Error generating sub-tasks:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubTaskToggle = (taskId: string, subTaskId: string, checked: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subTasks: task.subTasks.map(subTask =>
              subTask.id === subTaskId 
                ? { ...subTask, completed: checked }
                : subTask
            )
          }
        : task
    ))
  }

  return (
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Tasks</h2>
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto">
        {tasks.map((task) => (
          <div key={task.id} className="space-y-2">
            <div 
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                selectedTaskId === task.id ? 'bg-secondary' : 'hover:bg-secondary/50'
              }`}
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center space-x-2">
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
              {selectedTaskId === task.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleGenerateSubTasks(task)
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Sub-tasks'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 