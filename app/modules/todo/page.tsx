"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export type TodoItem = {
  id: string;
  listId: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoList = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: TodoItem[];
};

export default function TodoModulePage() {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New list form
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isSavingList, setIsSavingList] = useState(false);

  // Rename list form
  const [isRenamingList, setIsRenamingList] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // New item input
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Fetch all user lists on mount
  useEffect(() => {
    fetchLists();
  }, []);

  async function fetchLists() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/todos");
      if (res.status === 401) {
        setError("Unauthorized — please log in to access your todo lists.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load todo lists");
      }
      const data = await res.json();
      const loadedLists: TodoList[] = data.lists || [];
      setLists(loadedLists);

      if (loadedLists.length > 0) {
        setActiveListId((prev) => (prev && loadedLists.some((l) => l.id === prev) ? prev : loadedLists[0].id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lists");
    } finally {
      setLoading(false);
    }
  }

  const activeList = useMemo(() => {
    return lists.find((l) => l.id === activeListId) || null;
  }, [lists, activeListId]);

  // Separate active (unchecked) and completed (checked) items for the active list
  const { activeItems, completedItems } = useMemo(() => {
    if (!activeList) return { activeItems: [], completedItems: [] };

    const active: TodoItem[] = [];
    const completed: TodoItem[] = [];

    for (const item of activeList.items) {
      if (item.completed) {
        completed.push(item);
      } else {
        active.push(item);
      }
    }

    return { activeItems: active, completedItems: completed };
  }, [activeList]);

  // --- Handlers: Lists ---

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim() || isSavingList) return;

    setIsSavingList(true);
    try {
      const res = await fetch("/api/v1/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create list");
      const data = await res.json();
      const createdList: TodoList = { ...data.list, items: [] };

      setLists((prev) => [...prev, createdList]);
      setActiveListId(createdList.id);
      setNewListName("");
      setIsCreatingList(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not create list");
    } finally {
      setIsSavingList(false);
    }
  }

  async function handleRenameList(e: React.FormEvent) {
    e.preventDefault();
    if (!activeList || !renameValue.trim()) return;

    const listId = activeList.id;
    const newName = renameValue.trim();

    // Optimistic update
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, name: newName } : l))
    );
    setIsRenamingList(false);

    try {
      const res = await fetch(`/api/v1/todos/${listId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error("Failed to rename list");
    } catch {
      fetchLists(); // revert on error
    }
  }

  async function handleDeleteList(listId: string) {
    if (!confirm("Are you sure you want to delete this list and all its items?")) return;

    // Optimistic delete
    const remaining = lists.filter((l) => l.id !== listId);
    setLists(remaining);
    if (activeListId === listId) {
      setActiveListId(remaining.length > 0 ? remaining[0].id : null);
    }

    try {
      const res = await fetch(`/api/v1/todos/${listId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete list");
    } catch {
      fetchLists();
    }
  }

  // --- Handlers: Items ---

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!activeList || !newItemTitle.trim() || isAddingItem) return;

    const listId = activeList.id;
    const title = newItemTitle.trim();
    setNewItemTitle("");
    setIsAddingItem(true);

    try {
      const res = await fetch(`/api/v1/todos/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const data = await res.json();

      setLists((prev) =>
        prev.map((l) => {
          if (l.id === listId) {
            return { ...l, items: [data.item, ...l.items] };
          }
          return l;
        })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setIsAddingItem(false);
    }
  }

  async function handleToggleItem(item: TodoItem) {
    if (!activeList) return;

    const listId = activeList.id;
    const newCompleted = !item.completed;

    // Optimistic toggle
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          const updatedItems = l.items.map((i) =>
            i.id === item.id ? { ...i, completed: newCompleted } : i
          );
          return { ...l, items: updatedItems };
        }
        return l;
      })
    );

    try {
      const res = await fetch(`/api/v1/todos/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newCompleted }),
      });
      if (!res.ok) throw new Error("Failed to update item");
    } catch {
      fetchLists(); // Revert on failure
    }
  }

  async function handleDeleteItem(itemId: string) {
    if (!activeList) return;

    const listId = activeList.id;

    // Optimistic delete
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return { ...l, items: l.items.filter((i) => i.id !== itemId) };
        }
        return l;
      })
    );

    try {
      const res = await fetch(`/api/v1/todos/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    } catch {
      fetchLists();
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        {/* Navigation Breadcrumb */}
        <Link href="/modules" className="font-mono text-sm text-accent hover:underline">
          &larr; modules
        </Link>

        {/* Module Header */}
        <div className="mt-4 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Todo App
          </h1>
          <span className="rounded-full border border-status-active/40 bg-status-active/10 px-2.5 py-1 font-mono text-xs text-status-active">
            active module
          </span>
        </div>
        <p className="mt-2 max-w-xl text-fg-muted">
          Manage your tasks across multiple lists. Checked items automatically move to the bottom.
        </p>

        {loading ? (
          <div className="mt-12 rounded-lg border border-border bg-surface p-8 text-center text-fg-muted font-mono text-sm">
            Loading your todo lists...
          </div>
        ) : error ? (
          <div className="mt-12 rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center text-red-400 font-mono text-sm">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Sidebar: Lists Navigator */}
            <div className="md:col-span-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="font-mono text-xs uppercase tracking-wider text-fg-muted">
                  Your Lists ({lists.length})
                </h2>
                {!isCreatingList && (
                  <button
                    onClick={() => setIsCreatingList(true)}
                    className="font-mono text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    + New List
                  </button>
                )}
              </div>

              {/* Inline Create List Form */}
              {isCreatingList && (
                <form onSubmit={handleCreateList} className="mt-3 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="List name (e.g. Work)"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    autoFocus
                    className="w-full rounded border border-border bg-bg px-3 py-1.5 font-mono text-xs text-fg focus:border-accent focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreatingList(false)}
                      className="px-2 py-1 font-mono text-xs text-fg-muted hover:text-fg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingList || !newListName.trim()}
                      className="rounded bg-accent px-3 py-1 font-mono text-xs text-white hover:bg-accent/90 disabled:opacity-50"
                    >
                      {isSavingList ? "Saving..." : "Create"}
                    </button>
                  </div>
                </form>
              )}

              {/* List Items */}
              <div className="mt-3 space-y-1">
                {lists.length === 0 ? (
                  <p className="py-4 text-xs font-mono text-fg-muted text-center border border-dashed border-border rounded">
                    No lists yet. Create your first list!
                  </p>
                ) : (
                  lists.map((list) => {
                    const isActive = list.id === activeListId;
                    const itemCount = list.items.length;
                    const activeCount = list.items.filter((i) => !i.completed).length;

                    return (
                      <button
                        key={list.id}
                        onClick={() => {
                          setActiveListId(list.id);
                          setIsRenamingList(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md font-medium text-sm transition-colors text-left ${
                          isActive
                            ? "bg-surface-hover border border-border text-fg shadow-sm"
                            : "text-fg-muted hover:text-fg hover:bg-surface/50"
                        }`}
                      >
                        <span className="truncate">{list.name}</span>
                        <span className="font-mono text-xs text-fg-muted ml-2">
                          {activeCount}/{itemCount}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Main Area: Active List & Items */}
            <div className="md:col-span-8">
              {activeList ? (
                <div className="rounded-lg border border-border bg-surface p-6">
                  {/* List Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    {isRenamingList ? (
                      <form onSubmit={handleRenameList} className="flex items-center gap-2 flex-1 max-w-sm">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          autoFocus
                          className="w-full rounded border border-border bg-bg px-3 py-1 font-display text-lg font-bold text-fg focus:border-accent focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded bg-accent px-2.5 py-1 font-mono text-xs text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRenamingList(false)}
                          className="font-mono text-xs text-fg-muted"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h2 className="font-display text-xl font-bold">{activeList.name}</h2>
                        <button
                          onClick={() => {
                            setRenameValue(activeList.name);
                            setIsRenamingList(true);
                          }}
                          className="font-mono text-xs text-fg-muted hover:text-accent"
                          title="Rename list"
                        >
                          ✎ Edit
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleDeleteList(activeList.id)}
                      className="font-mono text-xs text-red-400/80 hover:text-red-400 transition-colors"
                      title="Delete list"
                    >
                      Delete List
                    </button>
                  </div>

                  {/* Add New Item Form */}
                  <form onSubmit={handleAddItem} className="mt-5 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a new task... (press Enter)"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      className="flex-1 rounded-md border border-border bg-bg px-4 py-2 text-sm text-fg placeholder:text-fg-muted/60 focus:border-accent focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isAddingItem || !newItemTitle.trim()}
                      className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors"
                    >
                      {isAddingItem ? "Adding..." : "Add Task"}
                    </button>
                  </form>

                  {/* Items List */}
                  <div className="mt-6 space-y-6">
                    {/* Active (Unchecked) Items */}
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-wider text-fg-muted mb-2">
                        To Do ({activeItems.length})
                      </h3>

                      {activeItems.length === 0 ? (
                        <p className="py-3 font-mono text-xs text-fg-muted text-center italic border border-dashed border-border/50 rounded">
                          {completedItems.length > 0
                            ? "All done! Great job 🎉"
                            : "No active tasks. Add one above!"}
                        </p>
                      ) : (
                        <div className="divide-y divide-border/60 border border-border rounded-md bg-bg/40">
                          {activeItems.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-start justify-between gap-3 px-4 py-3 hover:bg-surface-hover/50 transition-colors"
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={false}
                                  onClick={() => handleToggleItem(item)}
                                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface/80 hover:border-accent hover:bg-accent/10 transition-all duration-200 cursor-pointer"
                                  title="Mark as completed"
                                />
                                <span
                                  onClick={() => handleToggleItem(item)}
                                  className="text-sm font-medium text-fg break-words cursor-pointer leading-normal"
                                >
                                  {item.title}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="mt-0.5 opacity-0 group-hover:opacity-100 font-mono text-xs text-fg-muted hover:text-red-400 transition-opacity"
                                title="Delete task"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Completed (Checked) Items - Moved to Bottom */}
                    {completedItems.length > 0 && (
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-fg-muted mb-2">
                          Completed ({completedItems.length})
                        </h3>
                        <div className="divide-y divide-border/40 border border-border/60 rounded-md bg-bg/20">
                          {completedItems.map((item) => (
                            <div
                              key={item.id}
                              className="group flex items-start justify-between gap-3 px-4 py-3 hover:bg-surface-hover/30 transition-colors"
                            >
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={true}
                                  onClick={() => handleToggleItem(item)}
                                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent bg-accent text-white shadow-sm shadow-accent/20 transition-all duration-200 cursor-pointer"
                                  title="Mark as incomplete"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <span
                                  onClick={() => handleToggleItem(item)}
                                  className="text-sm text-fg-muted line-through break-words cursor-pointer leading-normal"
                                >
                                  {item.title}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="mt-0.5 opacity-0 group-hover:opacity-100 font-mono text-xs text-fg-muted hover:text-red-400 transition-opacity"
                                title="Delete task"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-surface p-12 text-center text-fg-muted font-mono text-sm">
                  Select a list from the left or create a new one to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
