interface SuggestionReplacementWidgetProps {
  suggestion: string;
}

export function SuggestionReplacementWidget({
  suggestion,
}: SuggestionReplacementWidgetProps) {
  return (
    <div
      style={{
        backgroundColor: "#e6ffec", // A light green background to indicate new code
        border: "1px solid #2da44e",
        margin: "4px 0",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#2da44e",
          color: "white",
          padding: "4px 12px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        Suggested Replacement
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px",
          overflowX: "auto",
          fontFamily: "monospace",
          color: "#000",
        }}
      >
        <code>{suggestion}</code>
      </pre>
    </div>
  );
}
