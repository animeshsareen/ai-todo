"use client"

import { useState } from "react"
import TaskSidebar from "@/components/task-sidebar"
import MainPane from "@/components/main-pane"
import type { Task } from "@/types"

export default function Home() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([
  ])

  const handleNotesChange = (notes: string) => {
    if (!selectedTask) return

    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? { ...task, notes } : task
    ))
    setSelectedTask({ ...selectedTask, notes })
  }

  return (
    <main className="h-screen flex">
      <aside className="w-80 border-r bg-background">
        <TaskSidebar 
          tasks={tasks} 
          setTasks={setTasks}
          selectedTask={selectedTask}
          onTaskSelect={setSelectedTask}
        />
      </aside>
      <section className="flex-1 bg-muted/10">
        <MainPane 
          selectedTask={selectedTask}
          onNotesChange={handleNotesChange}
        />
      </section>
    </main>
  )
}
