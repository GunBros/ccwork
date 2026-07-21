import { useState } from 'react';

interface UseTagEditorReturn {
  tags: string[];
  addTag: (value: string) => boolean;
  removeTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
}

const MAX_TAG_LENGTH = 20;

export function useTagEditor(initialTags?: string[]): UseTagEditorReturn {
  const [tags, setTags] = useState<string[]>(initialTags ?? []);

  const addTag = (value: string): boolean => {
    const noComma = value.replace(/,/g, '');
    const trimmed = noComma.trim();
    if (trimmed === '') return false;
    if (trimmed.length > MAX_TAG_LENGTH) return false;
    if (tags.includes(trimmed)) return false;
    setTags((prev) => [...prev, trimmed]);
    return true;
  };

  const removeTag = (tag: string): void => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return { tags, addTag, removeTag, setTags };
}
