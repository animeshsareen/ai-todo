import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { generateSubTasks } from "@/lib/gemini"
import type { Task, SubTask } from "@/types"

interface MainPaneProps {
  selectedTask: Task | null
  onNotesChange: (notes: string) => void
}

const SUBTASK_PROMPT = "Break this task down into 5-7 specific, actionable steps that will help accomplish the goal. Focus on unconventional wisdom and avoid common advice."

export default function MainPane({ selectedTask, onNotesChange }: MainPaneProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSubTasks = async (prompt: string) => {
    if (!selectedTask) return
    
    setIsGenerating(true)
    
    try {
      const subTaskTitles = await generateSubTasks(selectedTask.title, prompt)
      const newSubTasks: SubTask[] = subTaskTitles.map((title, index) => ({
        id: `${selectedTask.id}-sub-${index}`,
        title,
        completed: false
      }))

      // Update the notes with the new sub-tasks
      const existingNotes = selectedTask.notes.split('\n\n## Sub-tasks')[0]
      const newNotes = existingNotes + 
        "\n\n## Sub-tasks\n" + 
        newSubTasks.map(st => `- [ ] ${st.title}`).join('\n')
      
      onNotesChange(newNotes)
    } catch (error) {
      console.error('Error generating sub-tasks:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!selectedTask) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
        Select a task to view details
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{selectedTask.title}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleGenerateSubTasks(SUBTASK_PROMPT)}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Sub-tasks'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <Card className="flex-1">
          {isPreview ? (
            <div className="prose prose-sm dark:prose-invert max-w-none p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedTask.notes}
              </ReactMarkdown>
            </div>
          ) : (
            <Textarea
              value={selectedTask.notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add notes or sub-tasks..."
              className="min-h-[500px] font-mono border-0 resize-none"
            />
          )}
        </Card>
      </div>
    </>
  )
} 