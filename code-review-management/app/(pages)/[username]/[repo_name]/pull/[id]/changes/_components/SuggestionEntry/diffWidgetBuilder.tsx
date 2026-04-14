import React, { ReactNode } from 'react';
import { SuggestionReplacementWidget } from './SuggestionReplacementWidget';
import InlineThreadList from '../InlineThreadList/InlineThreadList';
import { ChangeData } from 'react-diff-view';
import { PublishedThreadItem } from '../../_hooks/usePublishedThreads';
import { DraftThreadItem } from '../../_hooks/useDraftThreads';
import { SuggestiveComment } from '../../_utils/widget-utils';

export function buildSuggestionWidget(
  anchorKey: string,
  suggestions: SuggestiveComment,
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
  change: ChangeData,
  published: { left: PublishedThreadItem[]; right: PublishedThreadItem[] },
  draft: { left: DraftThreadItem | null; right: DraftThreadItem | null },
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