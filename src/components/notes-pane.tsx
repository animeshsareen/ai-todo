"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Task } from "@/types"

interface NotesPaneProps {
  selectedTask: Task | null;
  onNotesChange: (notes: string) => void;
}

export default function NotesPane({ selectedTask, onNotesChange }: NotesPaneProps) {
  const [isPreview, setIsPreview] = useState(false)

  // Format sub-tasks in markdown if they exist
  const formattedSubTasks = selectedTask?.subTasks?.length 
    ? "\n\n## Sub-tasks\n" + selectedTask.subTasks
        .map(st => `- [ ] ${st.title}`)
        .join('\n')
    : '';

  // Combine existing notes with sub-tasks
  const combinedNotes = selectedTask 
    ? (selectedTask.notes || '') + formattedSubTasks
    : '';

  return (
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">
          {selectedTask ? `Notes for: ${selectedTask.title}` : 'Notes'}
        </h2>
        {selectedTask && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isPreview ? (
          <div className="prose prose-sm dark:prose-invert max-w-none min-h-[calc(100vh-16rem)] p-4 overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {combinedNotes}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea 
            placeholder={selectedTask 
              ? "Type your notes for this task here..." 
              : "Select a task to add notes"
            }
            value={combinedNotes}
            onChange={(e) => {
              // Only update the notes portion, preserve the sub-tasks section
              const newNotes = e.target.value.split('\n\n## Sub-tasks')[0];
              onNotesChange(newNotes);
            }}
            className="min-h-[calc(100vh-16rem)] font-mono"
            disabled={!selectedTask}
          />
        )}
      </CardContent>
    </Card>
  )
} 