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
  DialogTrigger
} from "../../../components/ui/dialog";

import api from "../../../../services/api";
import { toast } from "sonner";

interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
}

export function OffersManagement() {

  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
  try {
    const restaurantId = localStorage.getItem("restaurantId");
    if (!restaurantId) {
      toast.error("restaurantId missing");
      setOffers([]);
      return;
    }

    const res = await api.get(`/offers/${restaurantId}`);
    setOffers(Array.isArray(res.data) ? res.data : []);
  } catch {
    toast.error("Failed to load offers");
  }
};

  const handleSave = async () => {

    try {

      if (editingOffer) {

        await api.patch(`/offers/${editingOffer._id}`, {
          title,
          description,
          discount
        });

        toast.success("Offer updated");

      } else {

        await api.post("/offers", {
          title,
          description,
          discount
        });

        toast.success("Offer created");
      }

      setOpen(false);
      setEditingOffer(null);

      setTitle("");
      setDescription("");
      setDiscount(0);

      fetchOffers();

    } catch {

      toast.error("Operation failed");

    }

  };

  const handleDelete = async (id: string) => {

    try {

      await api.delete(`/offers/${id}`);

      toast.success("Offer deleted");

      fetchOffers();

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          Offers Management
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>

            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => {

                setEditingOffer(null);

                setTitle("");
                setDescription("");
                setDiscount(0);

              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>

          </DialogTrigger>

          <DialogContent>

            <DialogHeader>

              <DialogTitle>
                {editingOffer ? "Edit Offer" : "Create Offer"}
              </DialogTitle>

            </DialogHeader>

            <div className="space-y-4">

              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label>Discount %</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleSave}
              >
                Save Offer
              </Button>

            </div>

          </DialogContent>

        </Dialog>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {offers.map((offer) => (

          <div
            key={offer._id}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >

            <h3 className="text-lg font-bold mb-2">
              {offer.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {offer.description}
            </p>

            <p className="text-orange-600 font-bold mb-4">
              {offer.discount}% OFF
            </p>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => {

                  setEditingOffer(offer);

                  setTitle(offer.title);
                  setDescription(offer.description);
                  setDiscount(offer.discount);

                  setOpen(true);

                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => handleDelete(offer._id)}
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