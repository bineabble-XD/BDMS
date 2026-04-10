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

  const totalReplies = posts.reduce((acc, p) => acc + (p.replies?.length || 0), 0);

  return (
    <div className="community-page community-page--modern">
      <header className="community-hero">
        <div className="community-hero__bg" aria-hidden="true" />
        <div className="container position-relative community-hero__inner">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <p className="community-hero__eyebrow text-uppercase fw-semibold mb-2">Network</p>
              <h1 className="community-hero__title fw-bold mb-3">Blood Bank Community</h1>
              <p className="community-hero__lead mb-0">
                A shared space for hospitals and blood banks to coordinate urgent requests, stock updates, and
                donation drives — in one place.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              {canPost && (
                <button
                  type="button"
                  className="btn community-hero__cta btn-lg px-4 shadow"
                  onClick={() => setShowPostModal(true)}
                >
                  <span className="me-2" aria-hidden="true">
                    ✦
                  </span>
                  New post
                </button>
              )}
            </div>
          </div>
          {!loading && (
            <div className="community-stats row g-3 mt-4 mt-md-5">
              <div className="col-6 col-md-auto">
                <div className="community-stat-pill">
                  <span className="community-stat-pill__value">{posts.length}</span>
                  <span className="community-stat-pill__label">Posts</span>
                </div>
              </div>
              <div className="col-6 col-md-auto">
                <div className="community-stat-pill">
                  <span className="community-stat-pill__value">{totalReplies}</span>
                  <span className="community-stat-pill__label">Replies</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="community-main pb-5">
        <div className="container">
          {loading ? (
            <div className="community-loading text-center py-5 rounded-4">
              <div className="spinner-border community-loading__spinner" role="status" aria-label="Loading" />
              <p className="mt-3 mb-0 community-loading__text">Loading the latest updates…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="community-empty text-center py-5 px-3 rounded-4">
              <div className="community-empty__icon mb-3" aria-hidden="true">
                💬
              </div>
              <h3 className="h5 fw-semibold mb-2">No posts yet</h3>
              <p className="text-muted mb-4 mx-auto community-empty__hint">
                When hospitals and blood banks share updates, they will appear here as beautiful cards.
              </p>
              {canPost && (
                <button type="button" className="btn community-hero__cta px-4" onClick={() => setShowPostModal(true)}>
                  Create the first post
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-xl-4">
                  <article className="community-card community-card--elevated h-100 d-flex flex-column">
                    <div className="community-card__head d-flex align-items-start justify-content-between gap-2 mb-3">
                      <div className="d-flex align-items-center min-w-0">
                        <div className="community-avatar community-avatar--lg me-3 flex-shrink-0">
                          {getHandle(post.authorId).charAt(1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="community-author text-truncate">{getHandle(post.authorId)}</div>
                          <span className="community-role-badge">{post.role}</span>
                        </div>
                      </div>
                      {canDeletePost(post) && (
                        <button
                          type="button"
                          className="btn community-card__delete"
                          onClick={() => handleDeleteClick(post)}
                          disabled={deleting === post._id}
                          title="Delete post"
                        >
                          {deleting === post._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <span aria-hidden="true">🗑️</span>
                          )}
                        </button>
                      )}
                    </div>

                    <h2 className="community-card__title h6 fw-bold mb-2">{post.title}</h2>
                    <p className="community-card__body text-muted small flex-grow-1 mb-0">{post.body}</p>

                    <div className="community-card__footer mt-auto pt-3 mt-3">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <time className="community-time" dateTime={post.createdAt}>
                          {formatTime(post.createdAt)}
                        </time>
                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                          <button
                            type="button"
                            className={`community-pill-btn ${isAcknowledged(post) ? "is-active" : ""}`}
                            onClick={() => handleAcknowledge(post._id)}
                            disabled={!user?._id || acknowledging === post._id}
                          >
                            <span aria-hidden="true">👍</span>
                            <span>
                              Acknowledge
                              {post.acknowledgedBy?.length > 0 && (
                                <span className="community-pill-btn__count">{post.acknowledgedBy.length}</span>
                              )}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="community-pill-btn"
                            onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                            disabled={!user?._id}
                          >
                            <span aria-hidden="true">💬</span>
                            <span>
                              Reply
                              {post.replies?.length > 0 && (
                                <span className="community-pill-btn__count">{post.replies.length}</span>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>

                      {post.replies?.length > 0 && (
                        <div className="community-reply-stack">
                          <div className="community-reply-stack__label">Replies</div>
                          {post.replies.map((r) => (
                            <div key={r._id} className="community-reply">
                              <div className="community-avatar community-avatar--sm me-2 flex-shrink-0">
                                {getHandle(r.authorId).charAt(1).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-grow-1">
                                <div className="d-flex flex-wrap align-items-baseline gap-2">
                                  <span className="community-reply__author">{getHandle(r.authorId)}</span>
                                  <time className="community-reply__time">{formatTime(r.createdAt)}</time>
                                </div>
                                <p className="community-reply__text mb-0">{r.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {replyingTo === post._id && (
                        <div className="community-compose mt-3">
                          <label className="visually-hidden" htmlFor={`reply-${post._id}`}>
                            Reply to post
                          </label>
                          <textarea
                            id={`reply-${post._id}`}
                            className="form-control form-control-sm mb-2 community-compose__input"
                            rows={2}
                            placeholder="Write a reply…"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-sm community-compose__submit"
                              onClick={() => handleReply(post._id)}
                            >
                              Post reply
                            </button>
                            <button
                              type="button"
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
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showPostModal && (
        <div
          className="modal show d-block community-modal-backdrop"
          onClick={() => !posting && setShowPostModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content community-modal-panel border-0 shadow-lg">
              <div className="modal-header community-modal-panel__head border-0 pb-0">
                <h5 className="modal-title fw-bold" id="community-new-post-title">
                  New post
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !posting && setShowPostModal(false)}
                />
              </div>
              <form onSubmit={handleCreatePost} aria-labelledby="community-new-post-title">
                <div className="modal-body pt-2">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      placeholder="e.g. Urgent A- units needed tonight"
                      value={postForm.title}
                      onChange={(e) =>
                        setPostForm((p) => ({ ...p, title: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control rounded-3"
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
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => !posting && setShowPostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn community-hero__cta rounded-pill px-4"
                    disabled={posting || !postForm.title.trim() || !postForm.body.trim()}
                  >
                    {posting ? "Posting…" : "Publish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmPost && (
        <div className="modal show d-block community-modal-backdrop" onClick={() => setDeleteConfirmPost(null)}>
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content community-modal-panel border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Delete post?</h5>
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
