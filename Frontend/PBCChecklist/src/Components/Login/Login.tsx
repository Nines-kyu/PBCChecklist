import React, {useState} from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../Services/Auth";

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const inputClasses = 'bg-[#D9DDDC] p-2 w-full focus:outline-none focus:ring-2 border-2 rounded-md';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = await loginUser(username, password);

        if (data.access_token) {
            window.location.href = "/dashboard";
        } else {
            setError(data.message || "Invalid username or password");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
            <div className="w-full max-w-sm p-6 rounded-2xl shadow-xl/30 bg-[#ffffff]">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Login</label>
                        <input 
                        className={inputClasses} 
                        placeholder="John123" 
                        type="text" 
                        name="user" 
                        id="UN"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Password</label>
                        <div className="relative ">
                            <input 
                            className={inputClasses + "pr-10"} 
                            placeholder="********" 
                            type={showPassword ? "text" : "password"} 
                            name="pass" 
                            id="PW" 
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="absolute right-3 flex items-center  justify-center top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20} />}    
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button className="w-full bg-black text-white py-2 rounded-md mt-4 hover:bg-gray-800 transition" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;