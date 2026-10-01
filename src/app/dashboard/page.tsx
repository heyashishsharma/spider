import styles from "../page.module.css";
import Link from "next/link";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const isSuccess = resolvedParams?.token_status === "success";

  return (
    <main className={styles.main}>
      <div className={styles.backgroundEffects}>
        <div className={styles.glowBlob1}></div>
        <div className={styles.glowBlob2}></div>
      </div>

      <div className={styles.glassCard} style={{ maxWidth: '800px' }}>
        <h1 className={styles.title}>Spider Dashboard</h1>
        
        {isSuccess ? (
          <div style={{ background: 'rgba(46, 213, 115, 0.1)', border: '1px solid #2ed573', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', color: '#2ed573' }}>
            ✅ Successfully authenticated with Meta!
          </div>
        ) : (
          <div style={{ background: 'rgba(255, 165, 2, 0.1)', border: '1px solid #ffa502', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', color: '#ffa502' }}>
            ⚠️ Not connected to Instagram yet.
          </div>
        )}

        <p className={styles.subtitle}>
          This is where you will configure your AI automation rules, manage your media kit, and track real-time analytics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link href="/" className={styles.connectButton} style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
            Back to Home
          </Link>
          <Link href="/dashboard/media-kit" className={styles.connectButton}>
            Manage Media Kit
          </Link>
        </div>
      </div>
    </main>
  );
}
