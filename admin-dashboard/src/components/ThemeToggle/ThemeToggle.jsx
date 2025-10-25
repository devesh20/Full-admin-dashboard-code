import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        document.documentElement.classList.contains("dark")
    })

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        if(savedTheme === "dark"){
            document.documentElement.classList.add("dark")
            setIsDark(true)
        }

    }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
    setIsDark(!isDark)
  };
  return (
    <Button
      onClick={toggleTheme}
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}

export default ThemeToggle;
