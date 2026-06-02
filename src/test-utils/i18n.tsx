import React from 'react';

/**
 * Thin wrapper kept for clarity. Since next-intl is fully mocked in Jest
 * (see src/__mocks__/next-intl.tsx), this component just renders its children.
 * It can be composed into context wrappers in spec files.
 */
export function I18nWrapper({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}
