import React, { ReactNode } from 'react';
import { SuggestionReplacementWidget } from './SuggestionReplacementWidget';
import { ChangeData, getChangeKey } from 'react-diff-view';
import { SuggestiveComment } from '../../_utils/widget-utils';

export function buildSuggestionWidget(
  widgets: Record<string, ReactNode>,
  suggestion: SuggestiveComment,
  existingWidget: ReactNode | null,
  activePath:string,
  change: ChangeData
) {
  widgets[getChangeKey(change)] = (
    <SuggestionReplacementWidget 
      suggestion={suggestion}
      threadWidgets={existingWidget}
      activePath={activePath}
    />
  );
}