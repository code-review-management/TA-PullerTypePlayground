export interface MockCommentThread {
  side: "left" | "right";
  start_line: number;
  end_line: number;
  comments: MockCommentThreadItem[];
}

export interface MockCommentThreadItem {
  id: number;
  username: string;
  date: string;
  content: string;
}

export const MockComments: MockCommentThread = {
  side: "left",
  start_line: 7,
  end_line: 10,
  comments: [
    {
      id: 123,
      username: "octodog",
      date: "Feb 9, 2026",
      content: "Why is the line necessary?",
    },
    {
      id: 124,
      username: "octodog",
      date: "Feb 10, 2026",
      content: "LGTM!",
    },
  ],
};
