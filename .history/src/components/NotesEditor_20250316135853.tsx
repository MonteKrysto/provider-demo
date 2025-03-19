import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Note } from '../types/notes';

interface NotesEditorProps {
  note: Note | null;
  onSave: (content: string) => void;
  onLock: () => void;
}

export function NotesEditor({ note, onSave, onLock }: NotesEditorProps) {
  return (
    <div>
      <Input
        value={note?.content || ''}
        onChange={(e) => onSave(e.target.value)}
        placeholder="Write clinical note..."
      />
      <Button onClick={onLock} disabled={note?.status === 'locked'}>
        Lock Note
      </Button>
    </div>
  );
}
