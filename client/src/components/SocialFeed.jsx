import React from "react";
import { useLanguage } from "../context/LanguageContext";

const posts = [
  {
    id: 1,
    platform: "Instagram",
    title: "Instagram Post",
    subtitle: "Official BDMS Instagram post",
    url: "https://www.instagram.com/p/DVi2cmUjBfs/?igsh=YzcxMDNhemg2OG53",
    embedUrl: "https://www.instagram.com/p/DVi2cmUjBfs/embed/captioned/",
    time: "Instagram",
  },
  {
    id: 2,
    platform: "Instagram",
    title: "Instagram Post",
    subtitle: "Official BDMS Instagram post",
    url: "https://www.instagram.com/p/DVi2mCaDKdM/?igsh=MTZ1NDd0ZmZpOTZsYQ==",
    embedUrl: "https://www.instagram.com/p/DVi2mCaDKdM/embed/captioned/",
    time: "Instagram",
  },
  {
    id: 3,
    platform: "X (Twitter)",
    title: "X Post",
    subtitle: "Official BDMS X post",
    url: "https://x.com/bdmsoman/status/2029912788458688845?s=46",
    embedUrl:
      "https://platform.twitter.com/embed/Tweet.html?id=2029912788458688845",
    time: "X",
  },
];

const SocialFeed = () => {
  const { t } = useLanguage();
  return (
    <section className="social-media-section">
      <div className="container">
        <h2
          style={{
            fontWeight: "700",
            marginBottom: "10px",
            color: "#0d2b52",
          }}
        >
          {t("socialTitle")}
        </h2>

        <p
          style={{
            color: "#6c757d",
            marginBottom: "30px",
          }}
        >
          {t("socialSubtitle")}
        </p>

        <div className="row g-4">
          {posts.map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6 col-12">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    padding: "12px 14px 0 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background:
                        post.platform === "Instagram" ? "#ffe5ea" : "#f1f3f5",
                      color:
                        post.platform === "Instagram" ? "#e1306c" : "#111827",
                    }}
                  >
                    {post.platform}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      color: "#6c757d",
                    }}
                  >
                    {post.time}
                  </span>
                </div>

                <div
                  style={{
                    padding: "12px 14px 0 14px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      minHeight: "470px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#f8f9fa",
                    }}
                  >
                    <iframe
                      src={post.embedUrl}
                      title={post.title}
                      width="100%"
                      height="470"
                      style={{
                        border: "none",
                        display: "block",
                        background: "#fff",
                      }}
                      allowTransparency="true"
                      scrolling="no"
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 16px 18px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <h5
                    style={{
                      margin: 0,
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {post.title}
                  </h5>

                  <p
                    style={{
                      margin: 0,
                      color: "#6c757d",
                      fontSize: "14px",
                    }}
                  >
                    {post.subtitle}
                  </p>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "8px",
                      color: "#dc3545",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    {t("viewOn")} {post.platform} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;