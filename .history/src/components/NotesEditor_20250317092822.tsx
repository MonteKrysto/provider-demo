import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Note } from '../types/notes';

interface NotesEditorProps {
  note: Note | null;
  onSave: (content: string) => void;
  onLock: () => void;
}

export function NotesEditor({ note, onSave, onLock }: NotesEditorProps) {
  const [content, setContent] = useState(note?.content || '');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  return (
    <div className="mt-4">
      <div>Current Note: {note?.content || 'No note'}</div>
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
