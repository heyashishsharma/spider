'use client';

import styles from "./media-kit.module.css";
import Link from "next/link";
import { useState } from "react";

export default function MediaKitPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: In Phase 3 backend, this will save to Firebase Firestore
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className={styles.container}>
      <div className={styles.backgroundEffects}>
        <div className={styles.glowBlob}></div>
      </div>

      <div className={styles.glassForm}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Your Media Kit</h1>
            <p className={styles.subtitle}>Configure how the AI behaves for your Instagram account.</p>
          </div>
          <Link href="/dashboard" className={styles.backLink}>
            &larr; Back
          </Link>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Account Category</label>
            <select className={styles.select} required defaultValue="tech">
              <option value="tech">Technology & Coding</option>
              <option value="fitness">Fitness & Health</option>
              <option value="business">Business & Motivation</option>
              <option value="lifestyle">Lifestyle & Travel</option>
              <option value="custom">Other / Custom</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Target Niche / Topic</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g., Python tutorials, gym tips, SaaS marketing..." 
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tone of Voice</label>
            <select className={styles.select} required defaultValue="professional">
              <option value="professional">Professional & Educational</option>
              <option value="casual">Casual & Friendly</option>
              <option value="humorous">Humorous & Witty</option>
              <option value="inspirational">Inspirational & Hype</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Custom Instructions for AI</label>
            <textarea 
              className={styles.textarea} 
              placeholder="E.g., Always use emojis, keep captions under 3 lines, avoid talking about competitors..."
            ></textarea>
          </div>

          <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <input type="checkbox" id="autoPublish" defaultChecked style={{ width: '20px', height: '20px' }} />
            <label htmlFor="autoPublish" className={styles.label} style={{ cursor: 'pointer' }}>
              Enable Auto-Publishing (Cron Job)
            </label>
          </div>

          <button type="submit" className={styles.saveButton}>
            {isSaved ? "✅ Media Kit Saved!" : "Save Automation Settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
