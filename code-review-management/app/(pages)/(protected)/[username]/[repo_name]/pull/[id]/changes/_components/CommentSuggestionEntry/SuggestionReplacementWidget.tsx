import React, { ReactNode, useMemo, Fragment, useState, useEffect } from 'react';
import refractor from 'refractor';
import { SuggestiveComment } from "./suggestionParser";
import { IsSuggestionOutdated } from './suggestionValidator';
import { SuggestionModuleContent } from '../SuggestionModulePopup/SuggestionModulePopup';
import styles from "./SuggestionReplacementWidget.module.css"
import { getLanguage } from '../../_utils/diff-utils';
import { useFileContentQuery } from '@/lib/api/queries/useFileContentQuery';
import { useParams } from 'next/navigation';
import { PullParams } from '@/types/routing.types';

interface SuggestionReplacementWidgetProps {
  suggestion: SuggestiveComment,
  activePath: string,
  startLine: number,
  commentID: number,
}

// A raw text node
export type ASTTextNode = {
  type: 'text';
  value: string;
};

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

export function SuggestionReplacementWidget({ suggestion, activePath, startLine, commentID }: SuggestionReplacementWidgetProps) {
  const language = getLanguage(activePath);
  const { username, repo_name, id } = useParams<PullParams>();
  const [activeTab, setActiveTab] = useState<'replace' | 'insert'>('insert');
  const [moduleExpanded, setModuleExpanded] = useState(false);

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

  const {
    data: fileContent,
    isSuccess,
    isLoading,
    isError,
    error
  } = useFileContentQuery(username, repo_name, id, activePath);

  const { deletionContent, additionContent, relativeStartLine } = suggestion;
  const adjustedStartLine = startLine + relativeStartLine - 1;
  const endLine: number = adjustedStartLine + deletionContent.split('\n').length;

  const outdated = useMemo(() => {
    if (isSuccess && fileContent) {
      return IsSuggestionOutdated(fileContent, deletionContent, adjustedStartLine);
    }
    return false;
  }, [isSuccess, fileContent, deletionContent, adjustedStartLine]);

  return (
    <>
      {moduleExpanded && (
        <div className={styles.modalBackdrop} onClick={() => setModuleExpanded(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalBody}>
              {isLoading && (
                <div className={styles.notificationText}>Loading file content...</div>
              )}
              {isError && (
                <div className={styles.notificationText}>Failed to load: {error?.message}</div>
              )}

              {/* If NOT loading, NOT an error, and we have content, render the good state */}
              {!isLoading && !isError && fileContent && (
                <SuggestionModuleContent
                  commentID={commentID}
                  threadLine={startLine}
                  fullFileCode={fileContent}
                  filename={activePath}
                  replaceStartLine={adjustedStartLine}
                  replaceEndLine={endLine}
                  deletionContent={deletionContent}
                  additionContent={additionContent}
                  onXClicked={() => setModuleExpanded(false)}
                />
              )}
            </div>

          </div>
        </div>
      )}



      <div className={styles.container}>

        {/* 2. The Formal Header with Toggle Buttons */}
        <div className={styles.formalHeader}>
          <div className={styles.headerTitle}>
            Suggested Change {(!suggestion.isCommited && !outdated) && "(AI can make mistakes)"}
          </div>

          {suggestion.isCommited && (
            <div className={styles.commitedContainer}>
              Commited
            </div>
          )}

          {(!suggestion.isCommited && outdated) && (
            <div className={styles.outdatedContainer}>
              Outdated
            </div>
          )}

          <div className={styles.buttonContainer}>
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
            {!suggestion.isCommited && (
              <button
                className={styles.expandButton}
                onClick={() => setModuleExpanded(true)}
              >
                Expand
              </button>
            )}
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
      </div>
    </>
  );
}
