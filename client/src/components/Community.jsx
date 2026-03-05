import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-GB", { timeZone: "Asia/Muscat" });
};

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", body: "" });
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [acknowledging, setAcknowledging] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState(null);

  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
  const canPost = user && (user.role === "Hospital" || user.role === "Blood Bank");
  const userRole = user?.role === "Blood Bank" ? "Blood Bank" : user?.role === "Hospital" ? "Hospital" : null;

  const fetchPosts = () => {
    fetch(`${API_BASE}/api/community/posts`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!canPost || !postForm.title.trim() || !postForm.body.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`${API_BASE}/api/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          title: postForm.title.trim(),
          body: postForm.body.trim(),
          role: userRole,
        }),
      });
      if (res.ok) {
        setPostForm({ title: "", body: "" });
        setShowPostModal(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (postId) => {
    if (!user?._id || !replyText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/community/posts/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, body: replyText.trim() }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyText("");
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledge = async (postId) => {
    if (!user?._id) return;
    setAcknowledging(postId);
    try {
      const res = await fetch(`${API_BASE}/api/community/posts/${postId}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAcknowledging(null);
    }
  };

  const handleDeleteClick = (post) => {
    setDeleteConfirmPost(post);
  };

  const handleDeleteConfirm = async () => {
    if (!user?._id || !deleteConfirmPost) return;
    const postId = deleteConfirmPost._id;
    setDeleteConfirmPost(null);
    setDeleting(postId);
    try {
      const res = await fetch(`${API_BASE}/api/community/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, isAdmin: user.isAdmin === true }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const canDeletePost = (post) => {
    if (!user?._id) return false;
    const authorId = post.authorId?._id || post.authorId;
    return user.isAdmin === true || String(authorId) === String(user._id);
  };

  const getHandle = (author) => {
    if (!author?.fName) return "@Unknown";
    const name = String(author.fName).replace(/\s+/g, "");
    return `@${name}`;
  };

  const isAcknowledged = (post) =>
    user?._id && post.acknowledgedBy?.some((id) => String(id) === String(user._id));

  return (
    <div className="community-page">
      <main className="community-main py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Blood Bank Community</h2>
            {canPost && (
              <button
                className="btn btn-danger px-4"
                onClick={() => setShowPostModal(true)}
              >
                + New Post
              </button>
            )}
          </div>

          <p className="mb-4">
            A shared space for hospitals and blood banks to coordinate urgent
            requests, stock updates and donation drives.
          </p>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status" />
              <p className="mt-2 text-muted">Loading posts…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-5 border rounded bg-light">
              <p className="text-muted mb-3">No posts yet.</p>
              {canPost && (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowPostModal(true)}
                >
                  Create the first post
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((t) => (
                <div key={t._id} className="col-md-4">
                  <article className="community-card h-100 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="community-avatar me-3">
                          {getHandle(t.authorId).charAt(1).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold small text-dark">
                            {getHandle(t.authorId)}
                          </div>
                          <div className="community-role-badge">{t.role}</div>
                        </div>
                      </div>
                      {canDeletePost(t) && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          onClick={() => handleDeleteClick(t)}
                          disabled={deleting === t._id}
                          title="Delete post"
                        >
                          {deleting === t._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            "🗑️"
                          )}
                        </button>
                      )}
                    </div>

                    <h6 className="fw-semibold mb-2">{t.title}</h6>
                    <p className="text-muted small flex-grow-1">{t.body}</p>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                      <span className="text-muted small">
                        {formatTime(t.createdAt)}
                      </span>
                      <div className="d-flex gap-3">
                        <button
                          className={`community-icon-btn ${isAcknowledged(t) ? "text-danger fw-bold" : ""}`}
                          type="button"
                          onClick={() => handleAcknowledge(t._id)}
                          disabled={!user?._id || acknowledging === t._id}
                        >
                          👍{" "}
                          <span className="small">
                            Acknowledge
                            {t.acknowledgedBy?.length > 0 &&
                              ` (${t.acknowledgedBy.length})`}
                          </span>
                        </button>
                        <button
                          className="community-icon-btn"
                          type="button"
                          onClick={() =>
                            setReplyingTo(replyingTo === t._id ? null : t._id)
                          }
                          disabled={!user?._id}
                        >
                          💬{" "}
                          <span className="small">
                            Reply
                            {t.replies?.length > 0 && ` (${t.replies.length})`}
                          </span>
                        </button>
                      </div>
                    </div>

                    {t.replies?.length > 0 && (
                      <div className="mt-3 pt-2 border-top border-secondary">
                        <div className="small fw-semibold text-muted mb-2">
                          Replies
                        </div>
                        {t.replies.map((r) => (
                          <div
                            key={r._id}
                            className="d-flex align-items-start mb-2"
                          >
                            <div className="community-avatar me-2" style={{ width: 28, height: 28, fontSize: "0.7rem" }}>
                              {getHandle(r.authorId).charAt(1).toUpperCase()}
                            </div>
                            <div className="flex-grow-1">
                              <span className="fw-semibold small text-dark">
                                {getHandle(r.authorId)}
                              </span>
                              <span className="text-muted small ms-1">
                                {formatTime(r.createdAt)}
                              </span>
                              <p className="small text-muted mb-0 mt-1">
                                {r.body}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === t._id && (
                      <div className="mt-3 pt-2 border-top border-secondary">
                        <textarea
                          className="form-control form-control-sm mb-2"
                          rows={2}
                          placeholder="Write a reply…"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReply(t._id)}
                          >
                            Post Reply
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showPostModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => !posting && setShowPostModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !posting && setShowPostModal(false)}
                />
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Urgent A- units needed tonight"
                      value={postForm.title}
                      onChange={(e) =>
                        setPostForm((p) => ({ ...p, title: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Share your update or request…"
                      value={postForm.body}
                      onChange={(e) =>
                        setPostForm((p) => ({ ...p, body: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => !posting && setShowPostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={posting || !postForm.title.trim() || !postForm.body.trim()}
                  >
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmPost && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDeleteConfirmPost(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete post?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirmPost(null)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete &quot;{deleteConfirmPost.title}&quot;?
                  This cannot be undone and all replies will be removed.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirmPost(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
