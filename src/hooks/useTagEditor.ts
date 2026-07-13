import { useState } from 'react';

interface UseTagEditorReturn {
  tags: string[];
  addTag: (value: string) => boolean;
  setTags: (tags: string[]) => void;
}

export function useTagEditor(initialTags?: string[]): UseTagEditorReturn {
  const [tags, setTagsState] = useState<string[]>(initialTags ?? []);

  const addTag = (value: string): boolean => {
    // 1. 쉼표 제거
    const noComma = value.replace(/,/g, '');
    // 2. 앞뒤 공백 trim
    const trimmed = noComma.trim();
    // 3. 빈 문자열 → false
    if (trimmed === '') return false;
    // 4. 20자 초과 → false
    if (trimmed.length > 20) return false;
    // 5. 중복 검사 (대소문자 구분) → false
    if (tags.includes(trimmed)) return false;
    // 6. 태그 추가 → true
    setTagsState((prev) => [...prev, trimmed]);
    return true;
  };

  const setTags = (newTags: string[]): void => {
    setTagsState(newTags);
  };

  return { tags, addTag, setTags };
}
