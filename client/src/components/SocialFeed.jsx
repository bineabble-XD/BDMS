// src/components/SocialFeed.jsx
import React from "react";
import social1 from "../assets/social1.jpg";
import social2 from "../assets/social2.jpg";
import social3 from "../assets/social3.jpg";

const socialPosts = [
    {
        id: 1,
        platform: "Instagram",
        title: "Blood Drive at City Center",
        text: "Join us this Friday for a community blood drive at City Center Muscat.",
        image: social1 ,          // put image in public/assets or src/assets
        link: "https://www.instagram.com/your_account",
        time: "2 hours ago",
    },
    {
        id: 2,
        platform: "X (Twitter)",
        title: "Urgent O- Needed",
        text: "Urgent O- units needed at Nizwa Hospital tonight for surgery.",
        image: social2 ,
        link: "https://x.com/your_account/status/123",
        time: "Yesterday",
    },
    {
        id: 3,
        platform: "Facebook",
        title: "Thank you donors!",
        text: "We reached 120 donations in our last campaign. Thank you to all heroes.",
        image: social3 ,
        time: "3 days ago",
    },
];

const SocialFeed = () => {
    return (
        <section id="social" className="urgent-section py-5 bg-light">
            <div className="container">
                <h4 className="mb-3 fw-semibold">Social Media · Announcements</h4>
                <p className="text-muted mb-4">
                    Highlights from our official social media accounts and campaigns.
                </p>

                <div className="row g-4">
                    {socialPosts.map((post) => (
                        <div key={post.id} className="col-md-4">
                            <article
                                className="shadow-sm h-100"
                                style={{
                                    borderRadius: "18px",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e5e5",
                                    overflow: "hidden",
                                }}
                            >
                                {post.image && (
                                    <div style={{ height: 180, overflow: "hidden" }}>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="p-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span
                                            className="badge"
                                            style={{ backgroundColor: "#ff4b4b1a", color: "#d62828" }}
                                        >
                                            {post.platform}
                                        </span>
                                        <span className="text-muted small">{post.time}</span>
                                    </div>

                                    <h6 className="fw-semibold mb-1">{post.title}</h6>
                                    <p className="small text-muted mb-3">{post.text}</p>

                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="small text-decoration-none"
                                        style={{ color: "#d62828", fontWeight: 500 }}
                                    >
                                        View on {post.platform} →
                                    </a>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialFeed;
