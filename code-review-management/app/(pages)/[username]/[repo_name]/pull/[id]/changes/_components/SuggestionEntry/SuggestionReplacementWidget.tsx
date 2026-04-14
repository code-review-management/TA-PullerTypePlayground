import React, { ReactNode, useMemo, Fragment, useState } from 'react';
import refractor from 'refractor';
import { SuggestiveComment } from "../../_utils/widget-utils";
import InlineThreadList from "../InlineThreadList/InlineThreadList";
import styles from "./SuggestionReplacementWidget.module.css"
import { getLanguage } from '../../_utils/diff-utils';

interface SuggestionReplacementWidgetProps {
  suggestion: SuggestiveComment,
  threadWidgets: ReactNode | null,
  activePath: string
}

// A raw text node
export type ASTTextNode = {
  type: 'text';
  value: string;
};

// An HTML element node (like a span containing tokenized code)
export type ASTElementNode = {
  type: 'element';
  tagName: string;
  properties?: {
    className?: string[];
    [key: string]: unknown; 
  };
  children: ASTNode[];
};

export type ASTNode = ASTTextNode | ASTElementNode;

function renderASTNode(node: ASTNode, i: number): ReactNode {
  if (node.type === 'text') {
    return <Fragment key={i}>{node.value}</Fragment>;
  }
  if (node.type === 'element') {
    const className = node.properties?.className?.join(' ') || '';
    
    return (
      <span key={i} className={className}>
        {node.children.map((childNode, childIndex) => 
          renderASTNode(childNode, childIndex)
        )}
      </span>
    );
  }

  return null;
}

export function SuggestionReplacementWidget({ suggestion, threadWidgets, activePath }: SuggestionReplacementWidgetProps) {
  const language = getLanguage(activePath); 
  const [activeTab, setActiveTab] = useState<'replace' | 'insert'>('insert');

  const deletionNodes = useMemo<ASTNode[]>(() => {
    try {
      return refractor.highlight(suggestion.deletionContent, language) as ASTNode[];
    } catch (e) {
      return [{ type: 'text', value: suggestion.deletionContent }];
    }
  }, [suggestion.deletionContent, language]);

  const additionNodes = useMemo<ASTNode[]>(() => {
    try {
      return refractor.highlight(suggestion.additionContent, language) as ASTNode[];
    } catch (e) {
      return [{ type: 'text', value: suggestion.additionContent }];
    }
  }, [suggestion.additionContent, language]);

return (
    <div className={styles.container}>
      
      {/* 2. The Formal Header with Toggle Buttons */}
      <div className={styles.formalHeader}>
        <div className={styles.headerTitle}>Suggested Change</div>
        
        <div className={styles.toggleGroup}>
          <button 
            className={`${styles.toggleButton} ${activeTab === 'replace' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('replace')}
          >
            Original
          </button>
          <button 
            className={`${styles.toggleButton} ${activeTab === 'insert' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('insert')}
          >
            Suggestion
          </button>
        </div>
      </div>

      {/* 3. Conditionally render based on the active tab */}
      {activeTab === 'replace' ? (
        <pre className={`${styles.codeText} ${styles.deletionText}`}>
          <code>
            {deletionNodes.map((node, i) => renderASTNode(node, i))}
          </code>
        </pre>
      ) : (
        <pre className={`${styles.codeText} ${styles.additionText}`}>
          <code>
            {additionNodes.map((node, i) => renderASTNode(node, i))}
          </code>
        </pre>
      )}

      {threadWidgets}
    </div>
  );
}