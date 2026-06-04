import { useCallback, useEffect, useState } from 'react';
import { capitalize } from 'lodash';
import { APP } from '@/utils/app.constants';

const normalize = (name: string) => capitalize(name).trim();

export function useWeekExcludedCategories() {
  const [excludedCategories, setExcludedCategories] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        APP.localStorage.weekExcludedCategories,
      );
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setExcludedCategories(new Set(parsed.map(normalize)));
        }
      }
    } catch {
      // corrupted localStorage value — start fresh
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      APP.localStorage.weekExcludedCategories,
      JSON.stringify(Array.from(excludedCategories)),
    );
  }, [excludedCategories]);

  const toggleCategory = useCallback((name: string) => {
    const normalized = normalize(name);
    setExcludedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(normalized)) {
        next.delete(normalized);
      } else {
        next.add(normalized);
      }
      return next;
    });
  }, []);

  const isExcluded = useCallback(
    (name: string) => excludedCategories.has(normalize(name)),
    [excludedCategories],
  );

  return { excludedCategories, toggleCategory, isExcluded };
}
