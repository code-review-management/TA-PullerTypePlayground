// diffWidgetBuilders.tsx
import React, { ReactNode } from 'react';

// Import your components and types here
// import SuggestionReplacementWidget from './SuggestionReplacementWidget';
// import InlineThreadList from './InlineThreadList';
// import { ChangeData, ... } from './types';

export function buildSuggestionWidget(
  anchorKey: string,
  suggestions: string[], // Replace string with your actual suggestion type
  existingWidget: ReactNode | null
): ReactNode {
  return (
    <>
      {existingWidget}
      <div className="suggestion-replacement-block">
        {suggestions.map((suggestion, idx) => (
          <SuggestionReplacementWidget 
            key={`suggestion-${anchorKey}-${idx}`} 
            suggestion={suggestion} 
          />
        ))}
      </div>
    </>
  );
}

export function buildStandardWidget(
  change: any, // Replace with ChangeData
  published: any, // Replace with your published threads type
  draft: any, // Replace with your draft threads type
  existingWidget: ReactNode | null
): ReactNode {
  return (
    <>
      {existingWidget}
      <InlineThreadList
        change={change}
        publishedThreadsBySide={published}
        draftThreadsBySide={draft}
      />
    </>
  );
}