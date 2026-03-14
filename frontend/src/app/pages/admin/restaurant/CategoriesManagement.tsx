import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import api from "../../../../services/api";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
}

export function CategoriesManagement() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  /* FETCH CATEGORIES */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {

      const res = await api.get("/categories");

      setCategories(res.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  /* ADD / UPDATE CATEGORY */

  const handleSave = async () => {

    try {

      if (editingCategory) {

        await api.patch(`/categories/${editingCategory._id}`, {
          name
        });

        toast.success("Category updated");

      } else {

        await api.post("/categories", {
          name
        });

        toast.success("Category added");
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      setName("");

      fetchCategories();

    } catch (err) {
      toast.error("Operation failed");
    }

  };

  /* DELETE CATEGORY */

  const handleDelete = async (id: string) => {

    try {

      await api.delete(`/categories/${id}`);

      toast.success("Category deleted");

      fetchCategories();

    } catch {
      toast.error("Delete failed");
    }

  };

  return (

    <div className="p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Categories Management
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

          <DialogTrigger asChild>

            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => {
                setEditingCategory(null);
                setName("");
              }}
            >

              <Plus className="w-4 h-4 mr-2" />
              Add Category

            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div>

                <Label>Category Name</Label>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>

              <div className="flex gap-2">

                <Button
                  onClick={handleSave}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Save
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>

              </div>

            </div>

          </DialogContent>

        </Dialog>

      </div>

      {/* CATEGORY LIST */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {categories.map((category) => (

          <div
            key={category._id}
            className="bg-white rounded-xl p-6 border shadow-sm"
          >

            <h3 className="text-lg font-bold mb-4">
              {category.name}
            </h3>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {

                  setEditingCategory(category);
                  setName(category.name);
                  setIsDialogOpen(true);

                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}