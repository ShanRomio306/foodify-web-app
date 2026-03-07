import { useState,type FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";
import { User,Mail,Phone,Lock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import api from "../../../services/api";

export function RegisterPage(){

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleRegister = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    if(password !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }

    try{

      setLoading(true);

      const res = await api.post("/register",{
        name,
        email,
        phone,
        password
      });

      const { token } = res.data;

      localStorage.setItem("token",token);

      toast.success("Account created");

      navigate("/");

    }catch(err:any){

      toast.error(
        err?.response?.data?.message ||
        "Registration failed"
      );

    }finally{
      setLoading(false);
    }
  };

  return(

    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <h1 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-4">

            <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />

            <Button className="w-full bg-orange-600">
              {loading ? "Creating..." : "Create Account"}
            </Button>

          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
}