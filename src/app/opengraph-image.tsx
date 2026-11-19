import { ImageResponse } from 'next/og';
import { profile } from '@/content/profile';

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(160deg,#141c33 0%,#06070b 60%)', color: '#eef1f7', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: '#8b93a7' }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: '#7cf3d6' }} />
          {profile.availability}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 64, color: '#7cf3d6', fontStyle: 'italic', marginTop: 12 }}>builds proof, not promises.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#8b93a7' }}>
          <span>{profile.role} · {profile.location}</span>
          <span>github.com/{profile.githubUser}</span>
        </div>
        <svg width="1200" height="260" viewBox="0 0 1200 260" style={{ position: 'absolute', left: 0, bottom: 0, opacity: 0.35 }}>
          <path d="M0 260 L180 120 L300 190 L470 40 L620 170 L760 90 L900 180 L1050 70 L1200 160 L1200 260 Z" fill="#11141d" stroke="#7cf3d6" strokeWidth="2" />
        </svg>
      </div>
    ),
    size
  );
}
