"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/providers";
import { BoardList, BoardDetail, type BoardItem } from "@/components/board";
import { Button } from "@/components/ui";

type BoardView = "list" | "detail";

// Sample data
const samplePosts: BoardItem[] = [
  {
    id: 1,
    title: "Important announcement for all users",
    author: "Admin",
    date: new Date("2026-02-05"),
    views: 1234,
    comments: 15,
    category: "Notice",
    pinned: true,
  },
  {
    id: 2,
    title: "How to get started with our platform",
    author: "John Doe",
    date: new Date("2026-02-04"),
    views: 567,
    comments: 8,
    category: "Guide",
  },
  {
    id: 3,
    title: "Question about the new features",
    author: "Jane Smith",
    date: new Date("2026-02-03"),
    views: 234,
    comments: 12,
    category: "Q&A",
  },
  {
    id: 4,
    title: "Feedback on the recent update",
    author: "Bob Wilson",
    date: new Date("2026-02-02"),
    views: 189,
    comments: 5,
    category: "Feedback",
  },
  {
    id: 5,
    title: "Tips for better productivity",
    author: "Alice Brown",
    date: new Date("2026-02-01"),
    views: 456,
    comments: 21,
    category: "Tips",
  },
  {
    id: 6,
    title: "Community guidelines reminder",
    author: "Admin",
    date: new Date("2026-01-31"),
    views: 789,
    comments: 3,
    category: "Notice",
  },
  {
    id: 7,
    title: "Share your success stories",
    author: "Community Team",
    date: new Date("2026-01-30"),
    views: 345,
    comments: 28,
    category: "Discussion",
  },
];

const sampleDetail = {
  title: "How to get started with our platform",
  author: "John Doe",
  date: new Date("2026-02-04"),
  views: 567,
  category: "Guide",
  content: `Welcome to our platform! This guide will help you get started quickly.

1. Create Your Account
   First, sign up using your email address. You'll receive a confirmation email to verify your account.

2. Complete Your Profile
   Add your profile picture and fill in your bio to let others know about you.

3. Explore Features
   - Browse through the dashboard to see all available features
   - Check out the settings to customize your experience
   - Join communities that interest you

4. Start Creating
   Once you're familiar with the platform, start creating your first content!

5. Connect with Others
   Follow other users, comment on their posts, and build your network.

If you have any questions, don't hesitate to ask in the Q&A section.

Happy exploring!`,
};

export default function BoardExamplePage() {
  const [view, setView] = useState<BoardView>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);

  const handleItemClick = (item: BoardItem) => {
    setSelectedItem(item);
    setView("detail");
  };

  const handleBack = () => {
    setView("list");
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        logo={
          <Link href="/" className="font-semibold text-[var(--text-primary)]">
            Wireframe
          </Link>
        }
        actions={
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
        }
        sticky
      />

      <Container size="lg" className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Board Components
          </h1>
          <p className="text-[var(--text-secondary)]">
            Board list and detail view examples
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={view === "list" ? "solid" : "ghost"}
            onClick={() => {
              setView("list");
              setSelectedItem(null);
            }}
          >
            List View
          </Button>
          <Button
            variant={view === "detail" ? "solid" : "ghost"}
            onClick={() => setView("detail")}
          >
            Detail View
          </Button>
        </div>

        {/* Content */}
        {view === "list" ? (
          <BoardList
            items={samplePosts}
            onItemClick={handleItemClick}
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
            showCategory
          />
        ) : (
          <BoardDetail
            title={selectedItem?.title || sampleDetail.title}
            content={sampleDetail.content}
            author={selectedItem?.author || sampleDetail.author}
            date={selectedItem?.date || sampleDetail.date}
            views={selectedItem?.views || sampleDetail.views}
            category={selectedItem?.category || sampleDetail.category}
            onBack={handleBack}
            onEdit={() => alert("Edit clicked (Demo)")}
            onDelete={() => alert("Delete clicked (Demo)")}
            showActions
          />
        )}
      </Container>
    </div>
  );
}
