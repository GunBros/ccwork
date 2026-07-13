import { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onAddTag: (value: string) => boolean;
}

export function TagInput({ tags, onAddTag }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (value: string) => {
    const success = onAddTag(value);
    if (success) {
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 쉼표가 포함되면 onAddTag 호출
    if (value.includes(',')) {
      handleSubmit(value);
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-[0.35rem]">
      {tags.map((tag) => (
        <span key={tag} className="bg-[#dbe4e7] text-[#586064] rounded-full px-3 py-1 text-xs">
          {tag}
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="태그 입력"
        className="bg-transparent border-none outline-none text-sm text-[#2b3437] placeholder:text-[#586064]/50"
      />
    </div>
  );
}
