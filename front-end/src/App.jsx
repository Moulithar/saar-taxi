"use client"

import * as React from "react"
import Navbar from "./components/ui/navbar"
import { Routes, Route } from "react-router-dom"
import Analytics from "./pages/Analytics"

const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]
function App() {
  return (
   <div>
    <Navbar />
    <Routes>
      <Route path="/" element={<h1>Home page</h1>} />
      <Route path="/book" element={<h1>Book</h1>} />
      <Route path="/about" element={<h1>About</h1>} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
   </div>
  )
}

export default App


