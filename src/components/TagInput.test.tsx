import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  // 2-1: 정상
  it('should render tag badges when tags are provided', () => {
    render(<TagInput tags={['react', 'vue']} onAddTag={() => true} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('vue')).toBeInTheDocument();
  });

  // 2-2: 정상
  it('should render input field for tag entry', () => {
    render(<TagInput tags={[]} onAddTag={() => true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  // 2-3: 정상
  it('should call onAddTag when Enter key is pressed', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAddTag).toHaveBeenCalledWith('react');
  });

  // 2-4: 정상
  it('should call onAddTag when comma is typed', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react,');
    expect(onAddTag).toHaveBeenCalledWith('react,');
  });

  // 2-5: 정상
  it('should clear input when onAddTag returns true', async () => {
    const onAddTag = vi.fn(() => true);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('');
  });

  // 2-6: 경계
  it('should not clear input when onAddTag returns false', async () => {
    const onAddTag = vi.fn(() => false);
    render(<TagInput tags={[]} onAddTag={onAddTag} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'react');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('react');
  });

  // 2-7: 정상
  it('should display empty input when no text entered', () => {
    render(<TagInput tags={[]} onAddTag={() => true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
