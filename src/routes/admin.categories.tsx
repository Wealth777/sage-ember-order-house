import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashHeader } from "@/components/dashboard/DashboardShell";
import { resolveImage } from "@/data/images";
import { useCurrentUser } from "@/hooks/use-app";
import { useDb } from "@/lib/store";
import type { Category } from "@/lib/types";
import { deleteCategory, saveCategory } from "@/services/menu";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const db = useDb();
  const admin = useCurrentUser()!;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const openFor = (c: Category | null) => {
    setEditing(c);
    setName(c?.name ?? "");
    setDescription(c?.description ?? "");
    setOpen(true);
  };

  return (
    <>
      <DashHeader title="Categories" description="Group dishes so customers can find them quickly." actions={<Button onClick={() => openFor(null)}><Plus /> Add category</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {db.categories.map((c) => {
          const items = db.menuItems.filter((m) => m.categoryId === c.id);
          return (
            <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.description || "No description"}</p>
                </div>
                <div className="flex">
                  <Button size="icon" variant="ghost" aria-label={`Edit ${c.name}`} onClick={() => openFor(c)}><Pencil /></Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${c.name}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      try {
                        if (!confirm(`Delete category ${c.name}?`)) return;
                        deleteCategory(admin, c.id);
                        toast.success(`${c.name} deleted`);
                      } catch (e) {
                        toast.error((e as Error).message);
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {items.slice(0, 4).map((m) => (
                    <img key={m.id} src={resolveImage(m.image)} alt="" className="size-9 rounded-full border-2 border-card object-cover" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{items.length} dish{items.length === 1 ? "" : "es"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                saveCategory(admin, { ...(editing ? { id: editing.id } : {}), name, description });
                toast.success(editing ? "Category updated" : "Category added");
                setOpen(false);
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Short description</Label>
              <Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
