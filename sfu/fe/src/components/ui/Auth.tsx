import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import axios from "axios";

// Types for our requests
interface LoginCredentials {
  email: string;
  username: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

const api = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axios.post("/auth/login", credentials);
    return data;
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    console.log(credentials, "creds are here");

    const { data } = await axios.post(
      "http://localhost:8080/auth/signup",
      credentials
    );
    console.log("data is here", data);

    return data;
  },
};

export const useAuth = () => {
  console.log("using auth");

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => api.login(credentials),

    onSuccess: (data) => {
      console.log("working fine with data", data);

      localStorage.setItem("token", data.token);
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => api.signup(credentials),
    onSuccess: (data) => {
      console.log("working fine with data", data);

      localStorage.setItem("token", data.token);
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error);
    },
  });

  return {
    login: loginMutation,
    signup: signupMutation,
  };
};

const AuthModal = ({ isOpen, onClose }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login.mutateAsync({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
      } else {
        await signup.mutateAsync({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          confirmPassword: "",
        });
      }
      onClose();
      setFormData({ email: "", password: "", username: " " });
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("reached here");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black transition-opacity duration-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-[#3C4852]">
            {isLogin ? "Login" : "Create Account"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C4852]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C4852]"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C4852]"
              placeholder="Enter your password"
            />
          </div>

          {/* {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C4852]"
                placeholder="Confirm your password"
              />
            </div>
          )} */}

          <button
            type="submit"
            disabled={login.isPending || signup.isPending}
            className="w-full py-2 px-4 bg-[#3C4852] text-white rounded-md hover:bg-[#546470] transition-colors disabled:opacity-50"
          >
            {login.isPending || signup.isPending
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

          {(login.isError || signup.isError) && (
            <p className="text-red-500 text-sm text-center">
              Authentication failed. Please try again.
            </p>
          )}
        </form>

        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[#3C4852] hover:text-[#546470] font-medium"
            >
              {isLogin ? "Sign up here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
