import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark, FaCog } from "react-icons/fa"; // 
import { useMutation } from "@apollo/client";
import { UPDATE_BOOKMARKS_MUTATION } from "../graphql/mutations";
import { toast } from "react-toastify";
import { useLogin } from "../context/LoginContext";
import { Link } from "react-router-dom"; 

const BookmarkButton = ({ className = "" }) => {
  const toolId = window.location.pathname.split("/").pop();
  const [bookmarked, setBookmarked] = useState(false);
  const { isAuthenticated } = useLogin();
  const [updateBookmarks] = useMutation(UPDATE_BOOKMARKS_MUTATION);

  useEffect(() => {
    if (!isAuthenticated) return;
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedTools") || "[]");
    setBookmarked(storedBookmarks.includes(toolId));
  }, [toolId, isAuthenticated]);

  const toggleBookmark = () => {
    toast.dismiss();

    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedTools") || "[]");
    let updatedBookmarks;

    if (bookmarked) {
      updatedBookmarks = storedBookmarks.filter(id => id !== toolId);
      toast.success("Removed from bookmarks.");
    } else {
      updatedBookmarks = [...new Set([...storedBookmarks, toolId])];
      toast.success("Added to bookmarks.");
    }

    localStorage.setItem("bookmarkedTools", JSON.stringify(updatedBookmarks));
    setBookmarked(!bookmarked);

    const token = localStorage.getItem("authToken");
    if (isAuthenticated && token) {
      updateBookmarks({
        variables: { bookmarkedTools: updatedBookmarks },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      }).catch((error) => {
        toast.error("Failed to update bookmarks.");
        console.error("Bookmark update error:", error);
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 my-3">
      <button
        onClick={toggleBookmark}
        className={`bookmark-btn btn btn-outline-warning ${className}`}
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />} Bookmark
      </button>

      <Link
        to="/dashboard/settings"
        className="btn btn-outline-primary"
      >
        <FaCog /> Settings
      </Link>
    </div>
  );
};

export default BookmarkButton;
