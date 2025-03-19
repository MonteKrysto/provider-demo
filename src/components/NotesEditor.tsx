import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Note } from '../types/notes';

interface NotesEditorProps {
  note: Note | null;
  onSave: (content: string) => void;
  onLock: () => void;
  notes: Record<string, Note[]>; // Add to display all notes
}

export function NotesEditor({ note, onSave, onLock, notes }: NotesEditorProps) {
  const [content, setContent] = useState(note?.content || '');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent(''); // Clear input after saving
    }
  };

  console.log('NotesEditor state:', { note, notes });

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Notes</h2>
      <div className="mb-2">
        {Object.entries(notes).map(([patientId, patientNotes]) => (
          <div key={patientId}>
            <h3>Patient ID: {patientId}</h3>
            {patientNotes.map((n) => (
              <div key={n.id} className="border p-2 mb-2">
                <p>Content: {n.content}</p>
                <p>Status: {n.status}</p>
                <p>Timestamp: {new Date(n.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write clinical note..."
        className="mt-2"
      />
      <div className="flex gap-2 mt-2">
        <Button onClick={handleSave} disabled={!content.trim()}>
          Save Draft
        </Button>
        <Button onClick={onLock} disabled={!note} className="ml-2">
          Lock Note
        </Button>
      </div>
    </div>
  );
}
