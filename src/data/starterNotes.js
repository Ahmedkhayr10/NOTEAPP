const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const starterNotes = [
  {
    id: 'welcome-note',
    title: 'A little space for your thoughts',
    content:
      'Welcome to Margin. Jot down the things you want to remember, the ideas you want to explore, and everything in between.',
    category: 'Personal',
    color: 'cream',
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    createdAt: now - day,
    updatedAt: now - day,
  },
  {
    id: 'weekend-ideas',
    title: 'Weekend ideas',
    content:
      'Visit the little bookshop downtown\nTry the new pasta recipe\nTake a long walk somewhere green',
    category: 'Ideas',
    color: 'sage',
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: now - day * 2,
    updatedAt: now - day * 2,
  },
  {
    id: 'project-thoughts',
    title: 'Project thoughts',
    content:
      'Keep the first version simple. Focus on what matters most, then leave room to make it better.',
    category: 'Work',
    color: 'lavender',
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    createdAt: now - day * 4,
    updatedAt: now - day * 4,
  },
];