export const ratings = [1, 2, 3, 4, 5] as const;
export const fields = [
  {
    key: "difficulty",
    label: "Difficulty",
    descriptions: [
      "Very easy — suitable for beginners.",
      "Easy — basic skills needed.",
      "Moderate — some experience needed.",
      "Hard — advanced skills needed.",
      "Very hard — expert skills needed.",
    ],
  },
  {
    key: "availability",
    label: "Availability",
    descriptions: [
      "Rarely accessible — very limited opportunities.",
      "Occasionally accessible — limited times.",
      "Sometimes accessible — depends on the time or day.",
      "Usually accessible — few time restrictions.",
      "Always accessible — no time restrictions.",
    ],
  },
  {
    key: "entrance",
    label: "Entrance",
    descriptions: [
      "Very poor run-up — little room and major obstacles.",
      "Poor run-up — limited room or uneven ground.",
      "Fair run-up — usable with some adjustments.",
      "Good run-up — mostly smooth and clear.",
      "Excellent run-up — smooth, clear, and spacious.",
    ],
  },
  {
    key: "landing",
    label: "Landing",
    descriptions: [
      "Very poor landing — rough or very restricted.",
      "Poor landing — uneven or limited space.",
      "Fair landing — usable with some uneven ground.",
      "Good landing — mostly smooth with room to roll away.",
      "Excellent landing — smooth with a clear, spacious roll-away.",
    ],
  },
] as const;
