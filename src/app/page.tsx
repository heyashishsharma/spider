import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.backgroundEffects}>
        <div className={styles.glowBlob1}></div>
        <div className={styles.glowBlob2}></div>
      </div>

      <div className={styles.glassCard}>
        <h1 className={styles.title}>Spider Automation</h1>
        <p className={styles.subtitle}>
          Connect your Instagram account to unlock fully autonomous, AI-driven posting, replying, and engagement.
        </p>

        <div className={styles.actionContainer}>
          {/* Trigger the Meta OAuth flow from this button */}
          <a href="/api/auth/meta/login" className={styles.connectButton}>
            <span className={styles.buttonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </span>
            Connect Instagram Account
          </a>
        </div>

        <div className={styles.features}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>⚡</div>
            <span>Autopilot Reels & Posts</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💬</div>
            <span>Smart Comment Replies</span>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📈</div>
            <span>Live Analytics Sync</span>
          </div>
        </div>
      </div>
    </main>
  );
}
