import { Note } from '../types/note';

const API_URL = 'http://localhost:3001';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

export async function createNote(
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Note> {
  const now = new Date().toISOString();
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ tags: [], ...note, createdAt: now, updatedAt: now }),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ ...updates, updatedAt: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
}
