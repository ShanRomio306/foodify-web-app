import { useEffect, useMemo, useState } from "react";
import { User as UserIcon, Mail, Phone, MapPin, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import api from "../../services/api";
import { toast } from "sonner";

interface UserType {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export function UserProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Dummy field (not sent to server)
  const [address, setAddress] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      if (!user) return;

      // IMPORTANT: address is dummy, do not include it
      await api.patch("/users/profile", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  My Profile
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your personal information and preferences.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border rounded-full px-3 py-1">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>

              {!isEditing ? (
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      // address is dummy; keep it as-is
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="name">
                  Name
                </Label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={user.name}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="email">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    className="pl-10"
                    value={user.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Email is not editable.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-gray-700" htmlFor="phone">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={user.phone || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Dummy Address */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-gray-700" htmlFor="address">
                  Address (optional)
                </Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <Textarea
                    id="address"
                    className="min-h-[90px] pl-10"
                    value={address}
                    disabled={!isEditing}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, street, area, landmark..."
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This is a dummy field (not sent to server).
                </p>
              </div>
            </div>
          </div>

          {/* Extra spacing / info section */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900">Quick Tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Keep your phone number updated for order updates.</li>
              <li>Your email stays fixed for account security.</li>
              <li>Use the address field for convenience (saved locally only).</li>
            </ul>
          </div>
        </div>

        {/* Right column image holder */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden sticky top-24">
            <div className="relative h-56">
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1600&q=80"
                alt="Profile banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="relative p-6 h-full flex flex-col justify-end">
                <p className="text-white text-lg font-bold">Foodify Account</p>
                <p className="text-white/90 text-sm mt-1">
                  Your info helps us personalize your experience.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Account Role</span>
                <span className="font-medium text-gray-900 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900 truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">
                  We keep your profile secure. Only editable fields can be updated.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* end right column */}
      </div>
    </div>
  );
}