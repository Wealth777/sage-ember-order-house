import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FOOD_IMAGES, resolveImage } from "@/data/images";
import { useCurrentUser } from "@/hooks/use-app";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/lib/types";
import { createMenuItem, updateMenuItem, type MenuItemInput } from "@/services/menu";

const EMPTY: MenuItemInput = {
  name: "",
  categoryId: "",
  price: 0,
  description: "",
  image: "burger",
  available: true,
  popular: false,
  prepMinutes: 15,
  calories: 500,
  tags: [],
};

export function MenuItemDialog({
  open,
  onOpenChange,
  item,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  categories: Category[];
}) {
  const admin = useCurrentUser();
  const [form, setForm] = useState<MenuItemInput>(EMPTY);
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (!open) return;
    const { id: _id, ...rest } = item ?? { ...EMPTY, id: "", categoryId: categories[0]?.id ?? "" };
    setForm(rest);
    setTags(rest.tags.join(", "));
  }, [open, item, categories]);

  const set = <K extends keyof MenuItemInput>(key: K, value: MenuItemInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    const input = { ...form, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (item) updateMenuItem(admin, item.id, input);
      else createMenuItem(admin, input);
      toast.success(item ? "Dish updated" : "Dish added to the menu");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{item ? "Edit dish" : "Add a dish"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mi-name">Name</Label>
              <Input id="mi-name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mi-price">Price</Label>
              <Input id="mi-price" type="number" min={0} step={100} value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mi-prep">Prep time (min)</Label>
              <Input id="mi-prep" type="number" min={1} value={form.prepMinutes} onChange={(e) => set("prepMinutes", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mi-cal">Calories</Label>
              <Input id="mi-cal" type="number" min={0} value={form.calories} onChange={(e) => set("calories", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mi-desc">Description</Label>
              <Textarea id="mi-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="mi-tags">Tags (comma separated)</Label>
              <Input id="mi-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Vegan, Spicy" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Photo</Label>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
              {Object.keys(FOOD_IMAGES).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("image", key)}
                  className={cn("overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-background transition", form.image === key ? "ring-primary" : "ring-transparent hover:ring-border")}
                >
                  <img src={resolveImage(key)} alt={key} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
            <Input
              value={FOOD_IMAGES[form.image] ? "" : form.image}
              onChange={(e) => set("image", e.target.value || "burger")}
              placeholder="…or paste an image URL"
              className="mt-2"
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Switch checked={form.available} onCheckedChange={(v) => set("available", v)} /> Available
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Switch checked={form.popular} onCheckedChange={(v) => set("popular", v)} /> Chef's pick
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{item ? "Save changes" : "Add dish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
