import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTagEditor } from './useTagEditor';

describe('useTagEditor', () => {
  // 1-1: 정상
  it('should initialize with empty tags when no initialTags provided', () => {
    const { result } = renderHook(() => useTagEditor());
    expect(result.current.tags).toEqual([]);
  });

  // 1-2: 정상
  it('should initialize with given tags when initialTags provided', () => {
    const { result } = renderHook(() => useTagEditor(['react', 'vue']));
    expect(result.current.tags).toEqual(['react', 'vue']);
  });

  describe('addTag', () => {
    // 1-3: 정상
    it('should add tag to list when valid tag is provided', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => {
        result.current.addTag('react');
      });
      expect(result.current.tags).toEqual(['react']);
    });

    // 1-4: 정상
    it('should return true when tag is successfully added', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('react');
      });
      expect(returnValue!).toBe(true);
    });

    // 1-5: 정상
    it('should add multiple tags when called sequentially with valid values', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => {
        result.current.addTag('react');
      });
      act(() => {
        result.current.addTag('vue');
      });
      act(() => {
        result.current.addTag('angular');
      });
      expect(result.current.tags).toEqual(['react', 'vue', 'angular']);
    });

    // 1-6: 경계
    it('should trim whitespace when tag has leading/trailing spaces', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('  react  ');
      });
      expect(returnValue!).toBe(true);
      expect(result.current.tags).toEqual(['react']);
    });

    // 1-7: 경계
    it('should remove comma from value when input contains comma', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('react,');
      });
      expect(returnValue!).toBe(true);
      expect(result.current.tags).toEqual(['react']);
    });

    // 1-8: 경계
    it('should accept tag when tag is exactly 20 characters', () => {
      const { result } = renderHook(() => useTagEditor());
      const tag20 = 'a'.repeat(20);
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag(tag20);
      });
      expect(returnValue!).toBe(true);
      expect(result.current.tags).toContain(tag20);
    });

    // 1-9: 예외
    it('should return false when input is empty string', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('');
      });
      expect(returnValue!).toBe(false);
      expect(result.current.tags).toEqual([]);
    });

    // 1-10: 예외
    it('should return false when input is only whitespace', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('   ');
      });
      expect(returnValue!).toBe(false);
      expect(result.current.tags).toEqual([]);
    });

    // 1-11: 예외
    it('should return false when tag exceeds 20 characters', () => {
      const { result } = renderHook(() => useTagEditor());
      const tag21 = 'a'.repeat(21);
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag(tag21);
      });
      expect(returnValue!).toBe(false);
      expect(result.current.tags).toEqual([]);
    });

    // 1-12: 예외
    it('should return false when duplicate tag exists (case-sensitive)', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => {
        result.current.addTag('react');
      });
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('react');
      });
      expect(returnValue!).toBe(false);
      expect(result.current.tags).toEqual(['react']);
    });

    // 1-13: 정상
    it('should add tag when same text with different case exists (case-sensitive)', () => {
      const { result } = renderHook(() => useTagEditor());
      act(() => {
        result.current.addTag('react');
      });
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag('React');
      });
      expect(returnValue!).toBe(true);
      expect(result.current.tags).toEqual(['react', 'React']);
    });

    // 1-14: 경계
    it('should return false when input is only comma', () => {
      const { result } = renderHook(() => useTagEditor());
      let returnValue: boolean;
      act(() => {
        returnValue = result.current.addTag(',');
      });
      expect(returnValue!).toBe(false);
      expect(result.current.tags).toEqual([]);
    });
  });

  describe('setTags', () => {
    // 1-15: 정상
    it('should replace tags with given array', () => {
      const { result } = renderHook(() => useTagEditor(['old']));
      act(() => {
        result.current.setTags(['new1', 'new2']);
      });
      expect(result.current.tags).toEqual(['new1', 'new2']);
    });

    // 1-16: 정상
    it('should set empty array when called with empty array', () => {
      const { result } = renderHook(() => useTagEditor(['react', 'vue']));
      act(() => {
        result.current.setTags([]);
      });
      expect(result.current.tags).toEqual([]);
    });
  });
});
