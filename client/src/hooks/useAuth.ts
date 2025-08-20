import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user session on server
    const checkAuth = async () => {
      try {
        // Add detailed logging for deployment debugging
        console.log("🔵 Starting authentication check");
        const response = await fetch("/api/user-profile", {
          credentials: "include"
        });
        console.log("🔵 Auth response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("🔵 Auth data received:", data);
          if (data.id) {
            setUser(data);
          }
        } else if (response.status === 401) {
          // No session exists - stay logged out
          console.log("🔵 No session found (401)");
          setUser(null);
        } else {
          console.log("🔵 Unexpected auth response:", response.status, await response.text());
          setUser(null);
        }
      } catch (error) {
        console.error("🔴 Authentication check failed:", error);
        // In case of network failure, don't block the UI
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    console.log("🔴 LOGOUT INITIATED - Starting logout process");
    
    // Clear user state and stored data immediately
    console.log("🔴 Clearing user state and localStorage");
    setUser(null);
    localStorage.clear(); // Clear all localStorage data
    sessionStorage.clear(); // Clear all sessionStorage data
    
    try {
      console.log("🔴 Sending logout request to server");
      const response = await fetch("/api/logout", { 
        method: "POST", 
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("🔴 Logout response:", response.status);
      
      if (!response.ok) {
        console.error("🔴 Logout request failed:", await response.text());
      }
    } catch (error) {
      console.error("🔴 Logout error:", error);
    }
    
    // Force a hard reload to landing page to ensure clean state
    console.log("🔴 Forcing page reload to landing page");
    window.location.href = "/";
  };

  const switchRole = (role: 'job_seeker' | 'employer') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    switchRole
  };
}