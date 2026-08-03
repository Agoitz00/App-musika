import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Search, Home, Library, Heart,
  Volume2, Volume1, VolumeX, Shuffle, Repeat, Music2, Clock, X,
  ListMusic, MoreHorizontal, ArrowUpDown, FolderOpen, Check, Cloud, HardDrive, Loader2,
  Plus, ListPlus, Trash2, ArrowLeft, Cast, ChevronUp, ChevronDown, Radio, RefreshCw,
} from 'lucide-react';

const DEMO_TRACKS = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synth-pop', duration: 200 },
  { id: 2, title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", genre: 'Pop', duration: 167 },
  { id: 3, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', duration: 355 },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', duration: 203 },
  { id: 5, title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.', genre: 'Hip-Hop', duration: 177 },
  { id: 6, title: 'Redbone', artist: 'Childish Gambino', album: 'Awaken, My Love!', genre: 'Funk', duration: 327 },
  { id: 7, title: 'Strobe', artist: 'deadmau5', album: 'For Lack of a Better Name', genre: 'Electronic', duration: 636 },
  { id: 8, title: 'Dreams', artist: 'Fleetwood Mac', album: 'Rumours', genre: 'Rock', duration: 257 },
  { id: 9, title: 'good 4 u', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop-Rock', duration: 178 },
  { id: 10, title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile', genre: 'Hip-Hop', duration: 326 },
  { id: 11, title: 'Take Five', artist: 'The Dave Brubeck Quartet', album: 'Time Out', genre: 'Jazz', duration: 324 },
  { id: 12, title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', duration: 320 },
  { id: 13, title: 'Ho Hey', artist: 'The Lumineers', album: 'The Lumineers', genre: 'Folk', duration: 163 },
  { id: 14, title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', album: 'Random Access Memories', genre: 'Funk', duration: 369 },
  { id: 15, title: 'Clint Eastwood', artist: 'Gorillaz', album: 'Gorillaz', genre: 'Alternative', duration: 340 },
  { id: 16, title: 'No Diggity', artist: 'Blackstreet', album: 'Another Level', genre: 'R&B', duration: 309 },
  { id: 17, title: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape', genre: 'Rock', duration: 250 },
  { id: 18, title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', genre: 'Indie', duration: 229 },
  { id: 19, title: 'N95', artist: 'Kendrick Lamar', album: 'Mr. Morale & the Big Steppers', genre: 'Hip-Hop', duration: 234 },
  { id: 20, title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction', genre: 'Rock', duration: 356 },
  { id: 21, title: 'Where Is My Mind?', artist: 'Pixies', album: 'Surfer Rosa', genre: 'Alternative', duration: 229 },
  { id: 22, title: 'Feel Good Inc.', artist: 'Gorillaz', album: 'Demon Days', genre: 'Alternative', duration: 222 },
  { id: 23, title: 'Superstition', artist: 'Stevie Wonder', album: 'Talking Book', genre: 'Funk', duration: 245 },
  { id: 24, title: 'Midnight City', artist: 'M83', album: "Hurry Up, We're Dreaming", genre: 'Electronic', duration: 244 },
  { id: 25, title: 'Are You Bored Yet?', artist: 'Wallows ft. Clairo', album: 'Nothing Happens', genre: 'Indie', duration: 189 },
  { id: 26, title: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', genre: 'Indie Rock', duration: 253 },
  { id: 27, title: 'Return of the Mack', artist: 'Mark Morrison', album: 'Return of the Mack', genre: 'R&B', duration: 224 },
  { id: 28, title: 'Take On Me', artist: 'a-ha', album: 'Hunting High and Low', genre: 'Synth-pop', duration: 225 },
  { id: 29, title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', genre: 'Rock', duration: 222 },
  { id: 30, title: 'Alright', artist: 'Kendrick Lamar', album: 'To Pimp a Butterfly', genre: 'Hip-Hop', duration: 219 },
  { id: 31, title: 'Da Funk', artist: 'Daft Punk', album: 'Homework', genre: 'Electronic', duration: 335 },
  { id: 32, title: 'Circles', artist: 'Post Malone', album: "Hollywood's Bleeding", genre: 'Pop', duration: 215 },
  { id: 33, title: 'Windowlicker', artist: 'Aphex Twin', album: 'Windowlicker EP', genre: 'Electronic', duration: 359 },
  { id: 34, title: "Ain't No Sunshine", artist: 'Bill Withers', album: 'Just As I Am', genre: 'Soul', duration: 125 },
  { id: 35, title: 'Because I\u2019m Me', artist: 'The Avalanches', album: 'Wildflower', genre: 'Electronic', duration: 165 },
  { id: 36, title: 'Time', artist: 'Pink Floyd', album: 'The Dark Side of the Moon', genre: 'Rock', duration: 413 },
];

const GRADIENTS = [
  ['#FF6B4A', '#3A1F3D'], ['#E8B769', '#2A1F3D'], ['#7B6EF6', '#1A1330'],
  ['#4ADEC0', '#1B2A3D'], ['#F4547E', '#2A1330'], ['#5B8AC7', '#151E30'],
];
const AUDIO_EXT = /\.(mp3|m4a|wav|ogg|oga|flac|aac|opus|webm)$/i;

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function gradientFor(seed) { return GRADIENTS[hashStr(seed) % GRADIENTS.length]; }
function formatTime(sec) { const s = Math.max(0, Math.floor(sec || 0)); const m = Math.floor(s / 60); const r = s % 60; return `${m}:${r.toString().padStart(2, '0')}`; }
function parseFileName(name) {
  const base = name.replace(/\.[^/.]+$/, '');
  const parts = base.split(' - ');
  if (parts.length >= 2) return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
  return { artist: 'Artista desconocido', title: base };
}

async function storageGet(key, fallback) {
  try { const res = await window.storage.get(key, false); return res ? JSON.parse(res.value) : fallback; }
  catch (e) { return fallback; }
}
async function storageSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value), false); }
  catch (e) { console.error('No se pudo guardar', key, e); }
}

function AlbumArt({ seed, size = 44, radius = 6, playing = false }) {
  const [a, b] = gradientFor(seed);
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, background: `linear-gradient(135deg, ${a}, ${b})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <Music2 size={Math.round(size * 0.4)} color="rgba(255,255,255,0.55)" strokeWidth={1.6} />
      {playing && <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,14,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EqBars size={size} /></div>}
    </div>
  );
}
function EqBars({ size = 44 }) {
  const h = Math.max(10, Math.round(size * 0.3));
  return <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: h }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 3, background: '#FF6B4A', borderRadius: 1, animation: `eqbar 0.9s ease-in-out ${i * 0.15}s infinite` }} />)}</div>;
}
function IconBtn({ children, onClick, active, label, size = 36 }) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
      style={{ width: size, height: size, borderRadius: '50%', border: 'none', background: active ? 'rgba(255,107,74,0.16)' : 'transparent', color: active ? '#FF6B4A' : '#9C93AC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'color .15s, background .15s, transform .1s' }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#F2EEF7'; }} onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#9C93AC'; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }} onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
      {children}
    </button>
  );
}
function TrackMenu({ onAddNext, onGoToArtist, onAddToPlaylist, onRemoveFromPlaylist, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    function onDocClick(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [onClose]);
  const itemStyle = { display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: 13, background: 'none', border: 'none', color: '#F2EEF7', cursor: 'pointer', borderRadius: 6, fontFamily: 'Manrope, sans-serif' };
  const hov = (e, on) => (e.currentTarget.style.background = on ? '#332A42' : 'none');
  return (
    <div ref={ref} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: '#241E30', borderRadius: 10, padding: 4, minWidth: 200, zIndex: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} onMouseDown={(e) => e.stopPropagation()}>
      <button style={itemStyle} onMouseEnter={(e) => hov(e, 1)} onMouseLeave={(e) => hov(e, 0)} onClick={onAddNext}>Reproducir a continuación</button>
      <button style={itemStyle} onMouseEnter={(e) => hov(e, 1)} onMouseLeave={(e) => hov(e, 0)} onClick={onAddToPlaylist}>Añadir a playlist</button>
      <button style={itemStyle} onMouseEnter={(e) => hov(e, 1)} onMouseLeave={(e) => hov(e, 0)} onClick={onGoToArtist}>Ir al artista</button>
      {onRemoveFromPlaylist && <button style={{ ...itemStyle, color: '#FF6B4A' }} onMouseEnter={(e) => hov(e, 1)} onMouseLeave={(e) => hov(e, 0)} onClick={onRemoveFromPlaylist}>Quitar de esta playlist</button>}
    </div>
  );
}
function TrackRow({ track, index, isActive, isPlaying, liked, onPlay, onToggleLike, onAddNext, onGoToArtist, onAddToPlaylist, onRemoveFromPlaylist, showAlbum = true }) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onDoubleClick={onPlay}
      style={{ display: 'grid', gridTemplateColumns: showAlbum ? '28px 1fr minmax(0,200px) 70px 28px 24px' : '28px 1fr 70px 28px 24px', alignItems: 'center', gap: 12, padding: '8px 10px', borderRadius: 6, background: hover ? 'rgba(255,255,255,0.045)' : 'transparent', cursor: 'default', transition: 'background .12s', contentVisibility: 'auto', containIntrinsicSize: '0 54px' }}>
      <div style={{ fontSize: 13, color: isActive ? '#FF6B4A' : '#6B6278', fontFamily: 'Manrope, sans-serif', display: 'flex', justifyContent: 'center' }}>
        {hover || isActive ? (
          <button onClick={onPlay} aria-label={isActive && isPlaying ? 'Pausar' : 'Reproducir'} style={{ background: 'none', border: 'none', color: isActive ? '#FF6B4A' : '#F2EEF7', cursor: 'pointer', display: 'flex' }}>
            {isActive && isPlaying ? <EqBars size={20} /> : <Play size={13} fill="currentColor" />}
          </button>
        ) : (index + 1)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <AlbumArt seed={track.title + track.artist} size={38} playing={isActive && isPlaying} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, color: isActive ? '#FF6B4A' : '#F2EEF7', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
          <button onClick={onGoToArtist} style={{ fontSize: 12.5, color: '#9C93AC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>{track.artist}</button>
        </div>
      </div>
      {showAlbum && <div style={{ fontSize: 13, color: '#9C93AC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.album}</div>}
      <div style={{ fontSize: 12.5, color: '#6B6278', fontFamily: 'Manrope, sans-serif', textAlign: 'right' }}>{formatTime(track.duration)}</div>
      <button onClick={onToggleLike} aria-label={liked ? 'Quitar de tus me gusta' : 'Añadir a tus me gusta'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#FF6B4A' : (hover ? '#9C93AC' : 'transparent'), display: 'flex' }}>
        <Heart size={15} fill={liked ? '#FF6B4A' : 'none'} />
      </button>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen((m) => !m)} aria-label="Más opciones" style={{ background: 'none', border: 'none', cursor: 'pointer', color: hover || menuOpen ? '#9C93AC' : 'transparent', display: 'flex' }}><MoreHorizontal size={16} /></button>
        {menuOpen && (
          <TrackMenu
            onAddNext={() => { onAddNext(); setMenuOpen(false); }}
            onGoToArtist={() => { onGoToArtist(); setMenuOpen(false); }}
            onAddToPlaylist={() => { onAddToPlaylist(); setMenuOpen(false); }}
            onRemoveFromPlaylist={onRemoveFromPlaylist ? () => { onRemoveFromPlaylist(); setMenuOpen(false); } : null}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
function Sidebar({ view, setView, likedCount, onImportClick, playlists, activePlaylistId, onOpenPlaylist, onNewPlaylist }) {
  const items = [{ id: 'home', label: 'Inicio', icon: Home }, { id: 'search', label: 'Buscar', icon: Search }, { id: 'library', label: 'Tu biblioteca', icon: Library }];
  return (
    <aside style={{ width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 12px', borderRight: '1px solid #211C2B' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px', marginBottom: 22 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#FF6B4A,#E8B769)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music2 size={16} color="#0E0B14" strokeWidth={2.2} /></div>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, color: '#F2EEF7', fontWeight: 600 }}>Sonora</span>
      </div>
      <button onClick={onImportClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 7, border: '1px dashed #332A42', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: 12.5, fontWeight: 500, color: '#B8AFC7', fontFamily: 'Manrope, sans-serif', marginBottom: 18 }}>
        <FolderOpen size={16} />Importar música
      </button>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 22 }}>
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setView(id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13.5, fontWeight: 500, fontFamily: 'Manrope, sans-serif', transition: 'background .15s, color .15s', background: view === id ? 'rgba(255,255,255,0.06)' : 'transparent', color: view === id ? '#F2EEF7' : '#9C93AC' }}>
            <Icon size={17} />{label}
          </button>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#6B6278' }}>PLAYLISTS</span>
        <button onClick={onNewPlaylist} aria-label="Nueva playlist" style={{ background: 'none', border: 'none', color: '#6B6278', cursor: 'pointer', display: 'flex' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#F2EEF7')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6278')}><Plus size={14} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        <button onClick={() => setView('library')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'Manrope, sans-serif' }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#F4547E,#2A1330)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Heart size={13} color="#fff" fill="#fff" /></div>
          <div><div style={{ fontSize: 13, color: '#F2EEF7', fontWeight: 500 }}>Tus me gusta</div><div style={{ fontSize: 11.5, color: '#6B6278' }}>{likedCount} canciones</div></div>
        </button>
        {playlists.length === 0 && <div style={{ fontSize: 12, color: '#6B6278', padding: '8px 10px', lineHeight: 1.5 }}>Todavía no tienes playlists. Pulsa + para crear una.</div>}
        {playlists.map((p) => (
          <button key={p.id} onClick={() => onOpenPlaylist(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, border: 'none', background: activePlaylistId === p.id ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'Manrope, sans-serif' }}>
            <AlbumArt seed={p.name} size={30} radius={6} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: activePlaylistId === p.id ? '#F2EEF7' : '#B8AFC7', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#6B6278' }}>{p.trackIds.length} canciones</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
function Shelf({ title, tracks, onPlayTrack }) {
  if (!tracks.length) return null;
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, color: '#F2EEF7', marginBottom: 12, fontWeight: 600 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
        {tracks.map((t) => (
          <button key={t.id} onClick={() => onPlayTrack(t)} style={{ background: '#17131F', border: 'none', borderRadius: 10, padding: 12, textAlign: 'left', cursor: 'pointer', transition: 'background .15s, transform .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1E1929'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#17131F'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.35)', borderRadius: 6 }}><AlbumArt seed={t.title + t.artist} size={116} radius={6} /></div>
            <div style={{ fontSize: 13.5, color: '#F2EEF7', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
            <div style={{ fontSize: 12, color: '#9C93AC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{t.artist}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
function QueuePanel({ queue, currentIndex, likedIds, onPlayIndex, onToggleLike, onClose }) {
  const current = currentIndex !== null ? queue[currentIndex] : null;
  const upcoming = currentIndex !== null ? queue.slice(currentIndex + 1) : [];
  return (
    <aside style={{ width: 300, flexShrink: 0, borderLeft: '1px solid #211C2B', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 12px' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: '#F2EEF7', fontWeight: 600 }}>Cola</span>
        <button onClick={onClose} aria-label="Cerrar cola" style={{ background: 'none', border: 'none', color: '#9C93AC', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
        {current && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#6B6278', padding: '0 6px', marginBottom: 6 }}>REPRODUCIENDO AHORA</div>
            <TrackRow track={current} index={0} isActive isPlaying liked={likedIds.has(current.id)} onPlay={() => {}} onToggleLike={() => onToggleLike(current.id)} onAddNext={() => {}} onGoToArtist={() => {}} onAddToPlaylist={() => {}} showAlbum={false} />
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#6B6278', padding: '0 6px', marginBottom: 6 }}>A CONTINUACIÓN</div>
        {upcoming.length === 0 && <div style={{ fontSize: 12.5, color: '#6B6278', padding: '4px 6px' }}>No hay más canciones en la cola.</div>}
        {upcoming.map((t, i) => (
          <button key={`${t.id}-${i}`} onClick={() => onPlayIndex(currentIndex + 1 + i)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
            <AlbumArt seed={t.title + t.artist} size={34} />
            <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, color: '#F2EEF7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div><div style={{ fontSize: 11.5, color: '#9C93AC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.artist}</div></div>
          </button>
        ))}
      </div>
    </aside>
  );
}
function ImportModal({ onClose, onLocalFiles, onCloudLoad, cloudLoading, cloudError, defaultUrl }) {
  const [tab, setTab] = useState('cloud');
  const [baseUrl, setBaseUrl] = useState(defaultUrl || '');
  const fileInputRef = useRef(null);
  const tabBtn = (id, label, Icon) => (
    <button onClick={() => setTab(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, background: tab === id ? '#2A2338' : 'transparent', color: tab === id ? '#F2EEF7' : '#6B6278' }}>
      <Icon size={15} />{label}
    </button>
  );
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(8,6,12,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 440, background: '#17131F', borderRadius: 16, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 17, color: '#F2EEF7', fontWeight: 600 }}>Importar música</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9C93AC', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#0E0B14', borderRadius: 10, padding: 4, marginBottom: 18 }}>{tabBtn('cloud', 'Desde la nube', Cloud)}{tabBtn('local', 'Este ordenador', HardDrive)}</div>
        {tab === 'cloud' ? (
          <div>
            <div style={{ fontSize: 12.5, color: '#9C93AC', marginBottom: 10, lineHeight: 1.5 }}>URL pública de tu bucket de R2. Se recuerda para la próxima vez.</div>
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://pub-xxxxxxxx.r2.dev" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #262032', background: '#0E0B14', color: '#F2EEF7', fontSize: 13, fontFamily: 'monospace', marginBottom: 10 }} />
            {cloudError && <div style={{ fontSize: 12, color: '#FF6B4A', marginBottom: 10 }}>{cloudError}</div>}
            <button onClick={() => onCloudLoad(baseUrl.trim().replace(/\/$/, ''))} disabled={!baseUrl.trim() || cloudLoading}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: '#FF6B4A', color: '#0E0B14', fontWeight: 600, fontSize: 13.5, cursor: baseUrl.trim() ? 'pointer' : 'default', opacity: !baseUrl.trim() || cloudLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {cloudLoading ? <><Loader2 size={15} className="spin" />Cargando…</> : 'Cargar biblioteca'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12.5, color: '#9C93AC', marginBottom: 14, lineHeight: 1.5 }}>Elige una carpeta de tu ordenador. Solo dura esta sesión — no se guarda.</div>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ width: '100%', padding: '11px', borderRadius: 8, border: '1px dashed #332A42', background: 'transparent', color: '#B8AFC7', fontWeight: 500, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><FolderOpen size={16} />Elegir carpeta</button>
            <input ref={fileInputRef} type="file" multiple webkitdirectory="" accept="audio/*" style={{ display: 'none' }} onChange={(e) => onLocalFiles(e.target.files)} />
          </div>
        )}
      </div>
    </div>
  );
}
function PlaylistPickerModal({ track, playlists, onToggle, onCreate, onClose }) {
  const [newName, setNewName] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(8,6,12,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 360, background: '#17131F', borderRadius: 16, padding: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, color: '#F2EEF7', fontWeight: 600 }}>Añadir a playlist</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9C93AC', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ fontSize: 12, color: '#6B6278', marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track?.title}</div>
        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 10 }}>
          {playlists.length === 0 && <div style={{ fontSize: 12.5, color: '#6B6278', padding: '6px 2px' }}>Aún no tienes playlists.</div>}
          {playlists.map((p) => {
            const has = p.trackIds.includes(track?.id);
            return (
              <button key={p.id} onClick={() => onToggle(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 6px', borderRadius: 7, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                <div style={{ width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${has ? '#FF6B4A' : '#332A42'}`, background: has ? '#FF6B4A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{has && <Check size={13} color="#0E0B14" />}</div>
                <span style={{ fontSize: 13.5, color: '#F2EEF7' }}>{p.name}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #211C2B', paddingTop: 10 }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nueva playlist…" onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) { onCreate(newName.trim()); setNewName(''); } }}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 7, border: '1px solid #262032', background: '#0E0B14', color: '#F2EEF7', fontSize: 12.5, fontFamily: 'Manrope, sans-serif' }} />
          <button onClick={() => { if (newName.trim()) { onCreate(newName.trim()); setNewName(''); } }} style={{ padding: '0 12px', borderRadius: 7, border: 'none', background: '#2A2338', color: '#F2EEF7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function ExpandedPlayer({ track, isPlaying, progress, progressPct, onClose, onPlayPause, onNext, onPrev, onSeek, liked, onToggleLike, shuffle, onShuffle, repeatOne, onRepeat }) {
  const [a, b] = gradientFor(track.title + track.artist);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: `linear-gradient(180deg, ${a}22, #0E0B14 65%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 40px' }} className="view-fade">
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={onClose} aria-label="Minimizar" style={{ background: 'none', border: 'none', color: '#B8AFC7', cursor: 'pointer', display: 'flex' }}><ChevronDown size={26} /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 420 }}>
        <div style={{ width: '100%', aspectRatio: '1', borderRadius: 16, marginBottom: 34, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', background: `linear-gradient(135deg, ${a}, ${b})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPlaying ? <EqBars size={90} /> : <Music2 size={90} color="rgba(255,255,255,0.5)" strokeWidth={1.4} />}
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 26 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#F2EEF7', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
            <div style={{ fontSize: 15, color: '#B8AFC7', marginTop: 4 }}>{track.artist}</div>
          </div>
          <button onClick={onToggleLike} aria-label="Me gusta" style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#FF6B4A' : '#6B6278', flexShrink: 0, marginTop: 6 }}><Heart size={22} fill={liked ? '#FF6B4A' : 'none'} /></button>
        </div>
        <div style={{ width: '100%', marginBottom: 10 }}>
          <input type="range" min={0} max={track.duration || 0} value={Math.min(progress, track.duration || 0)} onChange={(e) => onSeek(Number(e.target.value))}
            style={{ width: '100%', height: 4, borderRadius: 2, background: `linear-gradient(to right, #FF6B4A ${progressPct}%, #262032 ${progressPct}%)` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B6278', marginTop: 6 }}><span>{formatTime(progress)}</span><span>{formatTime(track.duration)}</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 12 }}>
          <IconBtn onClick={onShuffle} active={shuffle} label="Aleatorio" size={34}><Shuffle size={18} /></IconBtn>
          <IconBtn onClick={onPrev} label="Anterior" size={40}><SkipBack size={22} fill="currentColor" /></IconBtn>
          <button onClick={onPlayPause} aria-label={isPlaying ? 'Pausar' : 'Reproducir'} style={{ width: 62, height: 62, borderRadius: '50%', border: 'none', background: '#F2EEF7', color: '#0E0B14', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" style={{ marginLeft: 3 }} />}
          </button>
          <IconBtn onClick={onNext} label="Siguiente" size={40}><SkipForward size={22} fill="currentColor" /></IconBtn>
          <IconBtn onClick={onRepeat} active={repeatOne} label="Repetir" size={34}><Repeat size={18} /></IconBtn>
        </div>
      </div>
    </div>
  );
}

function AudiocastPickerModal({ devices, scanning, onRescan, onConnect, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(8,6,12,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 380, background: '#17131F', borderRadius: 16, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 16, color: '#F2EEF7', fontWeight: 600 }}>Enviar a un dispositivo</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9C93AC', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <div style={{ fontSize: 12, color: '#6B6278', marginBottom: 14 }}>Dispositivos DLNA/UPnP en tu red local (altavoces AudioCast, Smart TVs, etc.)</div>
        <div style={{ minHeight: 60, maxHeight: 260, overflowY: 'auto', marginBottom: 14 }}>
          {scanning && <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9C93AC', fontSize: 13, padding: '10px 2px' }}><Loader2 size={15} className="spin" />Buscando en la red…</div>}
          {!scanning && devices.length === 0 && <div style={{ fontSize: 12.5, color: '#6B6278', padding: '6px 2px' }}>Nada por aquí todavía. Comprueba que el dispositivo esté encendido y en la misma WiFi que este ordenador.</div>}
          {devices.map((d) => (
            <button key={d.location} onClick={() => onConnect(d)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 8px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2A2338', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Radio size={15} color="#FF6B4A" /></div>
              <span style={{ fontSize: 13.5, color: '#F2EEF7' }}>{d.name}</span>
            </button>
          ))}
        </div>
        <button onClick={onRescan} disabled={scanning} style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1px dashed #332A42', background: 'transparent', color: '#B8AFC7', fontSize: 12.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <RefreshCw size={13} />Buscar de nuevo
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tracks, setTracks] = useState(DEMO_TRACKS);
  const [isDemo, setIsDemo] = useState(true);
  const [view, setView] = useState('home');
  const [queue, setQueue] = useState(DEMO_TRACKS);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [prevVolume, setPrevVolume] = useState(70);
  const [likedIds, setLikedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffle, setShuffle] = useState(false);
  const [repeatOne, setRepeatOne] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [librarySort, setLibrarySort] = useState('default');
  const [libraryGenre, setLibraryGenre] = useState('all');
  const [libraryArtist, setLibraryArtist] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [playlistPickerTrack, setPlaylistPickerTrack] = useState(null);
  const [savedBaseUrl, setSavedBaseUrl] = useState('');
  const [ready, setReady] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState(false);
  const [castAvailable, setCastAvailable] = useState(false);
  const [casting, setCasting] = useState(false);
  const castContextRef = useRef(null);
  const [audiocastSupported] = useState(!!window.audiocast);
  const [audiocastDevices, setAudiocastDevices] = useState([]);
  const [audiocastScanning, setAudiocastScanning] = useState(false);
  const [audiocastDevice, setAudiocastDevice] = useState(null);
  const [showAudiocastPicker, setShowAudiocastPicker] = useState(false);
  const audioRef = useRef(null);

  // -- carga inicial desde el almacenamiento persistente del artifact --
  useEffect(() => {
    let alive = true;
    (async () => {
      const [source, likedArr, storedPlaylists] = await Promise.all([
        storageGet('library-source', null),
        storageGet('liked-ids', []),
        storageGet('playlists', []),
      ]);
      if (!alive) return;
      setLikedIds(new Set(likedArr));
      setPlaylists(storedPlaylists);
      if (source && source.type === 'cloud' && source.baseUrl) {
        setSavedBaseUrl(source.baseUrl);
        await loadFromCloud(source.baseUrl, true);
      }
      setReady(true);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (ready) storageSet('liked-ids', Array.from(likedIds)); }, [likedIds, ready]);
  useEffect(() => { if (ready) storageSet('playlists', playlists); }, [playlists, ready]);

  const currentTrack = currentIndex !== null ? queue[currentIndex] : null;
  const isRealAudio = !!currentTrack?.src;
  const isAudiocasting = !!audiocastDevice;

  useEffect(() => {
    if (!isPlaying || !currentTrack || (isRealAudio && !isAudiocasting)) return undefined;
    const id = setInterval(() => {
      setProgress((p) => { if (p + 1 >= currentTrack.duration) { if (repeatOne) return 0; goNext(); return 0; } return p + 1; });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentTrack, repeatOne, isRealAudio, isAudiocasting]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isRealAudio) return;
    if (isAudiocasting) { audio.pause(); return; }
    if (isPlaying) audio.play().catch(() => {}); else audio.pause();
  }, [isPlaying, isRealAudio, currentTrack, isAudiocasting]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    function onTime() { setProgress(audio.currentTime); }
    function onLoaded() {
      if (currentTrack && (!currentTrack.duration || currentTrack.duration === 0)) {
        const dur = audio.duration;
        setTracks((ts) => ts.map((t) => (t.id === currentTrack.id ? { ...t, duration: dur } : t)));
        setQueue((qs) => qs.map((t) => (t.id === currentTrack.id ? { ...t, duration: dur } : t)));
      }
    }
    function onEnded() { if (repeatOne) { audio.currentTime = 0; audio.play().catch(() => {}); } else { goNext(); } }
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onLoaded); audio.removeEventListener('ended', onEnded); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, repeatOne]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume]);

  // -- Chromecast: carga el SDK oficial de Google y prepara el contexto de casting.
  // Solo funciona con pistas con URL real (nube), no con archivos locales (blob:),
  // ya que el receptor de Chromecast necesita poder descargar el audio el mismo.
  useEffect(() => {
    if (window.chrome && window.chrome.cast && window.cast) { setupCastContext(); return; }
    window.__onGCastApiAvailable = (isAvailable) => { if (isAvailable) setupCastContext(); };
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    script.async = true;
    document.head.appendChild(script);
    function setupCastContext() {
      try {
        const ctx = window.cast.framework.CastContext.getInstance();
        ctx.setOptions({ receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID, autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED });
        castContextRef.current = ctx;
        setCastAvailable(true);
        ctx.addEventListener(window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (e) => {
          setCasting(e.sessionState === window.cast.framework.SessionState.SESSION_STARTED || e.sessionState === window.cast.framework.SessionState.SESSION_RESUMED);
        });
      } catch (e) {
        console.error('No se pudo inicializar Chromecast:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleCast() {
    const ctx = castContextRef.current;
    if (!ctx) return;
    const session = ctx.getCurrentSession();
    if (session) { ctx.endCurrentSession(true); return; }
    if (currentTrack && !isRemoteUrl(currentTrack.src)) {
      setToast('Solo se puede enviar a Chromecast música cargada desde la nube, no archivos locales.');
      setTimeout(() => setToast(null), 3500);
      return;
    }
    try {
      await ctx.requestSession();
      castCurrentTrack();
    } catch (e) {
      if (e !== 'cancel') setToast('No se pudo conectar con el dispositivo Chromecast.');
      setTimeout(() => setToast(null), 3000);
    }
  }
  function castCurrentTrack() {
    const ctx = castContextRef.current;
    const session = ctx && ctx.getCurrentSession();
    if (!session || !currentTrack || !isRemoteUrl(currentTrack.src)) return;
    const mediaInfo = new window.chrome.cast.media.MediaInfo(currentTrack.src, 'audio/mpeg');
    mediaInfo.metadata = new window.chrome.cast.media.MusicTrackMediaMetadata();
    mediaInfo.metadata.title = currentTrack.title;
    mediaInfo.metadata.artist = currentTrack.artist;
    const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = isPlaying;
    request.currentTime = progress;
    session.loadMedia(request).catch(() => { setToast('El Chromecast no pudo cargar esta canción.'); setTimeout(() => setToast(null), 3000); });
  }
  useEffect(() => { if (casting) castCurrentTrack(); }, [currentTrack?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  function isRemoteUrl(src) { return typeof src === 'string' && /^https?:\/\//.test(src); }

  // -- AudioCast / DLNA (solo disponible dentro de la app de escritorio Electron) --

  async function scanAudiocast() {
    if (!window.audiocast) return;
    setAudiocastScanning(true);
    try {
      const devices = await window.audiocast.discover();
      setAudiocastDevices(devices);
      if (devices.length === 0) { setToast('No se ha encontrado ningún dispositivo en la red. Comprueba que esté encendido y en la misma WiFi.'); setTimeout(() => setToast(null), 4000); }
    } catch (e) {
      setToast('Error buscando dispositivos: ' + e.message); setTimeout(() => setToast(null), 4000);
    } finally {
      setAudiocastScanning(false);
    }
  }
  function openAudiocastPicker() { setShowAudiocastPicker(true); scanAudiocast(); }
  async function connectAudiocast(device) {
    await window.audiocast.connect(device);
    setAudiocastDevice(device);
    setShowAudiocastPicker(false);
    setToast(`Conectado a ${device.name}.`); setTimeout(() => setToast(null), 3000);
  }
  async function disconnectAudiocast() {
    await window.audiocast.disconnect();
    setAudiocastDevice(null);
  }
  function sendCurrentTrackToAudiocast() {
    if (!audiocastDevice || !currentTrack) return;
    window.audiocast
      .play({ remoteUrl: isRemoteUrl(currentTrack.src) ? currentTrack.src : null, filePath: currentTrack.filePath || null, title: currentTrack.title, artist: currentTrack.artist })
      .catch((e) => { setToast('No se pudo enviar la canción: ' + e.message); setTimeout(() => setToast(null), 4000); });
  }
  useEffect(() => { if (audiocastDevice) sendCurrentTrackToAudiocast(); }, [currentTrack?.id, audiocastDevice]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!audiocastDevice) return;
    if (isPlaying) window.audiocast.resume().catch(() => {});
    else window.audiocast.pause().catch(() => {});
  }, [isPlaying, audiocastDevice]);

  useEffect(() => {
    function handleKey(e) {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying((p) => (currentIndex === null ? p : !p)); }
      else if (e.code === 'ArrowRight') { seekTo(currentTrack ? Math.min(currentTrack.duration, progress + 5) : progress); }
      else if (e.code === 'ArrowLeft') { seekTo(Math.max(0, progress - 5)); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, progress, currentTrack]);

  function seekTo(value) { if (isRealAudio && audioRef.current) audioRef.current.currentTime = value; setProgress(value); }
  const playFrom = useCallback((list, index) => { setQueue(list); setCurrentIndex(index); setProgress(0); setIsPlaying(true); }, []);
  const playTrack = useCallback((track, list) => { const srcList = list || queue; const idx = srcList.findIndex((t) => t.id === track.id); playFrom(srcList, idx === -1 ? 0 : idx); }, [queue, playFrom]);

  function togglePlayPause() { if (!currentTrack) { playFrom(tracks, 0); return; } setIsPlaying((p) => !p); }
  function goNext() {
    if (currentIndex === null) return;
    if (shuffle) { setCurrentIndex(Math.floor(Math.random() * queue.length)); setProgress(0); setIsPlaying(true); return; }
    setCurrentIndex(currentIndex + 1 >= queue.length ? 0 : currentIndex + 1); setProgress(0); setIsPlaying(true);
  }
  function goPrev() {
    if (currentIndex === null) return;
    if (progress > 3) { seekTo(0); return; }
    setCurrentIndex(currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1); setProgress(0); setIsPlaying(true);
  }
  function toggleLike(id) { setLikedIds((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }
  function addNext(track) { setQueue((q) => { const nq = [...q]; nq.splice((currentIndex === null ? 0 : currentIndex + 1), 0, track); return nq; }); }
  function goToArtist(artist) { setLibraryArtist(artist); setLibraryGenre('all'); setActivePlaylistId(null); setView('library'); }
  function handleVolumeToggle() { if (volume > 0) { setPrevVolume(volume); setVolume(0); } else { setVolume(prevVolume || 70); } }

  function createPlaylist(name, seedTrackId) {
    const id = `pl-${Date.now()}`;
    setPlaylists((ps) => [...ps, { id, name, trackIds: seedTrackId ? [seedTrackId] : [] }]);
    return id;
  }
  function togglePlaylistTrack(playlistId, trackId) {
    setPlaylists((ps) => ps.map((p) => {
      if (p.id !== playlistId) return p;
      const has = p.trackIds.includes(trackId);
      return { ...p, trackIds: has ? p.trackIds.filter((id) => id !== trackId) : [...p.trackIds, trackId] };
    }));
  }
  function removeFromActivePlaylist(trackId) { if (activePlaylistId) togglePlaylistTrack(activePlaylistId, trackId); }
  function deletePlaylist(id) { setPlaylists((ps) => ps.filter((p) => p.id !== id)); if (activePlaylistId === id) { setActivePlaylistId(null); setView('home'); } }

  function replaceLibrary(newTracks, label) {
    setTracks(newTracks); setQueue(newTracks); setIsDemo(false); setCurrentIndex(null); setIsPlaying(false);
    setLibraryArtist(null); setLibraryGenre('all'); setShowImport(false);
    if (label) { setToast(label); setTimeout(() => setToast(null), 3500); }
  }

  function importLocalFiles(fileList) {
    const files = Array.from(fileList).filter((f) => (f.type && f.type.startsWith('audio/')) || AUDIO_EXT.test(f.name));
    if (files.length === 0) { setToast('No se encontraron archivos de audio en lo seleccionado.'); setTimeout(() => setToast(null), 3000); return; }
    const imported = files.map((file, i) => {
      const { artist, title } = parseFileName(file.name);
      const filePath = window.audiocast ? (() => { try { return window.audiocast.getPathForFile(file); } catch (e) { return null; } })() : null;
      return { id: `local-${Date.now()}-${i}`, title, artist, album: 'Tu música', genre: 'Importado', duration: 0, src: URL.createObjectURL(file), filePath };
    });
    replaceLibrary(imported, `${imported.length} canciones importadas desde tu ordenador.`);
  }

  async function loadFromCloud(baseUrl, silent) {
    if (!baseUrl) return;
    setCloudLoading(true); setCloudError(null);
    try {
      const res = await fetch(`${baseUrl}/manifest.json`);
      if (!res.ok) throw new Error(`No se pudo leer manifest.json (HTTP ${res.status}). Comprueba la URL y que el bucket sea público.`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('manifest.json está vacío o no tiene el formato esperado.');
      const cloudTracks = data.map((t, i) => ({
        id: t.id ?? `cloud-${i}`, title: t.title || 'Sin título', artist: t.artist || 'Desconocido',
        album: t.album || '', genre: t.genre || 'Sin clasificar', duration: t.duration || 0, src: `${baseUrl}/${t.file}`,
      }));
      replaceLibrary(cloudTracks, silent ? null : `${cloudTracks.length} canciones cargadas desde la nube.`);
      setSavedBaseUrl(baseUrl);
      await storageSet('library-source', { type: 'cloud', baseUrl });
    } catch (err) {
      setCloudError(err.message);
      if (silent) { setToast('No se pudo recargar tu biblioteca guardada automáticamente.'); setTimeout(() => setToast(null), 4000); }
    } finally {
      setCloudLoading(false);
    }
  }

  function handleDrop(e) { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files && e.dataTransfer.files.length) importLocalFiles(e.dataTransfer.files); }

  const greeting = useMemo(() => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'; }, []);
  const recentTracks = useMemo(() => tracks.slice(0, 8), [tracks]);
  const topGenres = useMemo(() => {
    const counts = {}; tracks.forEach((t) => { counts[t.genre] = (counts[t.genre] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g);
  }, [tracks]);
  const genreShelf = useCallback((genre) => tracks.filter((t) => t.genre === genre).slice(0, 8), [tracks]);
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return tracks.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q));
  }, [searchQuery, tracks]);
  const likedTracks = useMemo(() => tracks.filter((t) => likedIds.has(t.id)), [likedIds, tracks]);
  const genres = useMemo(() => ['all', ...Array.from(new Set(tracks.map((t) => t.genre)))], [tracks]);
  const libraryTracks = useMemo(() => {
    let list = tracks;
    if (libraryArtist) list = list.filter((t) => t.artist === libraryArtist);
    else if (libraryGenre !== 'all') list = list.filter((t) => t.genre === libraryGenre);
    if (librarySort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (librarySort === 'artist') list = [...list].sort((a, b) => a.artist.localeCompare(b.artist));
    if (librarySort === 'duration') list = [...list].sort((a, b) => a.duration - b.duration);
    return list;
  }, [librarySort, libraryGenre, libraryArtist, tracks]);
  const activePlaylist = useMemo(() => playlists.find((p) => p.id === activePlaylistId) || null, [playlists, activePlaylistId]);
  const activePlaylistTracks = useMemo(() => (activePlaylist ? activePlaylist.trackIds.map((id) => tracks.find((t) => t.id === id)).filter(Boolean) : []), [activePlaylist, tracks]);

  const progressPct = currentTrack ? Math.min(100, (progress / (currentTrack.duration || 1)) * 100) : 0;
  const VolIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const [ambientA] = currentTrack ? gradientFor(currentTrack.title + currentTrack.artist) : ['#0E0B14'];

  const listHeader = (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr minmax(0,200px) 70px 28px 24px', gap: 12, padding: '0 10px 8px', borderBottom: '1px solid #211C2B', marginBottom: 4 }}>
      <div style={{ fontSize: 11.5, color: '#6B6278', fontWeight: 600 }}>#</div>
      <div style={{ fontSize: 11.5, color: '#6B6278', fontWeight: 600, letterSpacing: '0.04em' }}>TÍTULO</div>
      <div style={{ fontSize: 11.5, color: '#6B6278', fontWeight: 600, letterSpacing: '0.04em' }}>ÁLBUM</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Clock size={13} color="#6B6278" /></div>
      <div /><div />
    </div>
  );

  function trackRowProps(t, i, list) {
    return {
      key: t.id, track: t, index: i, isActive: currentTrack?.id === t.id, isPlaying, liked: likedIds.has(t.id),
      onPlay: () => (currentTrack?.id === t.id ? togglePlayPause() : playTrack(t, list)),
      onToggleLike: () => toggleLike(t.id), onAddNext: () => addNext(t), onGoToArtist: () => goToArtist(t.artist),
      onAddToPlaylist: () => setPlaylistPickerTrack(t),
    };
  }

  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
      style={{ background: '#0E0B14', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Manrope, sans-serif', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        @keyframes eqbar { 0%,100% { height: 4px; } 50% { height: 16px; } }
        @keyframes toastin { from { opacity:0; transform: translate(-50%,8px);} to { opacity:1; transform: translate(-50%,0);} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideup { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .view-fade { animation: fadein 0.22s ease; }
        .spin { animation: spin 0.8s linear infinite; }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #F2EEF7; margin-top: -4px; cursor: pointer; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #262032; border-radius: 8px; }
        .chip { transition: background .15s, color .15s; }
      `}</style>

      <audio ref={audioRef} src={currentTrack?.src || undefined} />
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(60% 100% at 20% 0%, ${ambientA}33, transparent 70%)`, transition: 'background 1.1s ease' }} />

      {dragOver && <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(14,11,20,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px dashed #FF6B4A' }}><div style={{ textAlign: 'center', color: '#F2EEF7', fontFamily: 'Fraunces, serif', fontSize: 22 }}><FolderOpen size={40} style={{ marginBottom: 10 }} /><div>Suelta tus canciones aquí</div></div></div>}
      {toast && <div style={{ position: 'fixed', bottom: 104, left: '50%', transform: 'translateX(-50%)', background: '#241E30', color: '#F2EEF7', padding: '10px 18px', borderRadius: 24, fontSize: 13, zIndex: 60, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'toastin .25s ease' }}><Check size={15} color="#FF6B4A" />{toast}</div>}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onLocalFiles={importLocalFiles} onCloudLoad={loadFromCloud} cloudLoading={cloudLoading} cloudError={cloudError} defaultUrl={savedBaseUrl} />}
      {playlistPickerTrack && (
        <PlaylistPickerModal track={playlistPickerTrack} playlists={playlists} onClose={() => setPlaylistPickerTrack(null)}
          onToggle={(pid) => togglePlaylistTrack(pid, playlistPickerTrack.id)}
          onCreate={(name) => createPlaylist(name, playlistPickerTrack.id)} />
      )}
      {showAudiocastPicker && (
        <AudiocastPickerModal devices={audiocastDevices} scanning={audiocastScanning} onRescan={scanAudiocast} onConnect={connectAudiocast} onClose={() => setShowAudiocastPicker(false)} />
      )}
      {expandedPlayer && currentTrack && (
        <ExpandedPlayer track={currentTrack} isPlaying={isPlaying} progress={progress} progressPct={progressPct} onClose={() => setExpandedPlayer(false)}
          onPlayPause={togglePlayPause} onNext={goNext} onPrev={goPrev} onSeek={seekTo}
          liked={likedIds.has(currentTrack.id)} onToggleLike={() => toggleLike(currentTrack.id)}
          shuffle={shuffle} onShuffle={() => setShuffle((s) => !s)} repeatOne={repeatOne} onRepeat={() => setRepeatOne((r) => !r)} />
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
        <Sidebar view={view} setView={(v) => { setActivePlaylistId(null); setView(v); }} likedCount={likedTracks.length} onImportClick={() => { setCloudError(null); setShowImport(true); }}
          playlists={playlists} activePlaylistId={activePlaylistId}
          onOpenPlaylist={(id) => { setActivePlaylistId(id); setView('playlist'); }}
          onNewPlaylist={() => { const id = createPlaylist('Nueva playlist'); setActivePlaylistId(id); setView('playlist'); }} />

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '28px 32px 40px', height: '100vh' }}>
          {isDemo && ready && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#17131F', border: '1px solid #262032', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12.5, color: '#9C93AC' }}>
              <FolderOpen size={15} color="#FF6B4A" style={{ flexShrink: 0 }} />
              Ves 36 canciones de muestra. Pulsa "Importar música" para cargar las tuyas — se recuerda para la próxima vez.
            </div>
          )}

          <div key={view + (activePlaylistId || '')} className="view-fade">
          {view === 'home' && (
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 27, color: '#F2EEF7', fontWeight: 600, marginBottom: 24 }}>{greeting}</div>
              <Shelf title="Escuchado recientemente" tracks={recentTracks} onPlayTrack={(t) => playTrack(t, tracks)} />
              {topGenres.map((g) => <Shelf key={g} title={g} tracks={genreShelf(g)} onPlayTrack={(t) => playTrack(t, tracks)} />)}
            </div>
          )}

          {view === 'search' && (
            <div>
              <div style={{ position: 'relative', maxWidth: 420, marginBottom: 26 }}>
                <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6B6278' }} />
                <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Canciones, artistas o álbumes" style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 24, border: 'none', background: '#1E1929', color: '#F2EEF7', fontSize: 14, fontFamily: 'Manrope, sans-serif' }} />
                {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B6278', cursor: 'pointer', display: 'flex' }}><X size={15} /></button>}
              </div>
              {searchQuery.trim() === '' ? <div style={{ color: '#6B6278', fontSize: 14 }}>Escribe para buscar. Espacio para pausar, ←/→ para avanzar 5s.</div>
                : searchResults.length === 0 ? <div style={{ color: '#6B6278', fontSize: 14 }}>Sin resultados para "{searchQuery}".</div>
                  : <div>{listHeader}{searchResults.map((t, i) => <TrackRow {...trackRowProps(t, i, searchResults)} />)}</div>}
            </div>
          )}

          {view === 'library' && (
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#F2EEF7', fontWeight: 600, marginBottom: 4 }}>{libraryArtist ? libraryArtist : 'Tu biblioteca'}</div>
              <div style={{ fontSize: 13.5, color: '#9C93AC', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{libraryTracks.length} canciones</span>
                {libraryArtist && <button onClick={() => setLibraryArtist(null)} style={{ fontSize: 12.5, color: '#FF6B4A', background: 'rgba(255,107,74,0.12)', border: 'none', borderRadius: 20, padding: '3px 10px', cursor: 'pointer' }}>Quitar filtro de artista ✕</button>}
              </div>
              {!libraryArtist && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {genres.map((g) => <button key={g} className="chip" onClick={() => setLibraryGenre(g)} style={{ padding: '6px 13px', borderRadius: 20, border: 'none', fontSize: 12.5, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', background: libraryGenre === g ? '#FF6B4A' : '#1E1929', color: libraryGenre === g ? '#0E0B14' : '#9C93AC', fontWeight: libraryGenre === g ? 600 : 500 }}>{g === 'all' ? 'Todos' : g}</button>)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <ArrowUpDown size={13} color="#6B6278" />
                {[['default', 'Predeterminado'], ['title', 'Título'], ['artist', 'Artista'], ['duration', 'Duración']].map(([key, label]) => (
                  <button key={key} onClick={() => setLibrarySort(key)} style={{ fontSize: 12, padding: '4px 9px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', background: librarySort === key ? 'rgba(255,107,74,0.14)' : 'transparent', color: librarySort === key ? '#FF6B4A' : '#6B6278' }}>{label}</button>
                ))}
              </div>
              {listHeader}
              {libraryTracks.map((t, i) => <TrackRow {...trackRowProps(t, i, libraryTracks)} />)}
            </div>
          )}

          {view === 'playlist' && activePlaylist && (
            <div>
              <button onClick={() => setView('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#9C93AC', cursor: 'pointer', fontSize: 12.5, marginBottom: 14, fontFamily: 'Manrope, sans-serif' }}><ArrowLeft size={14} />Volver</button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#F2EEF7', fontWeight: 600 }}>{activePlaylist.name}</div>
                <button onClick={() => deletePlaylist(activePlaylist.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#6B6278', cursor: 'pointer', fontSize: 12 }} onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B4A')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6278')}><Trash2 size={13} />Eliminar playlist</button>
              </div>
              <div style={{ fontSize: 13.5, color: '#9C93AC', marginBottom: 20 }}>{activePlaylistTracks.length} canciones</div>
              {activePlaylistTracks.length === 0 ? (
                <div style={{ color: '#6B6278', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8 }}><ListPlus size={16} />Añade canciones desde el menú "···" de cualquier canción.</div>
              ) : (
                <>{listHeader}{activePlaylistTracks.map((t, i) => <TrackRow {...trackRowProps(t, i, activePlaylistTracks)} onRemoveFromPlaylist={() => removeFromActivePlaylist(t.id)} />)}</>
              )}
            </div>
          )}
          </div>
        </main>
        {showQueue && <QueuePanel queue={queue} currentIndex={currentIndex} likedIds={likedIds} onPlayIndex={(i) => { setCurrentIndex(i); setProgress(0); setIsPlaying(true); }} onToggleLike={toggleLike} onClose={() => setShowQueue(false)} />}
      </div>

      <div style={{ height: 88, borderTop: '1px solid #211C2B', background: '#120E1A', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', padding: '0 18px', gap: 12, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {currentTrack ? (
            <>
              <button onClick={() => setExpandedPlayer(true)} aria-label="Ampliar reproductor" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                <AlbumArt seed={currentTrack.title + currentTrack.artist} size={54} radius={6} playing={isPlaying} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: '#F2EEF7', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.title}</div>
                  <div style={{ fontSize: 12, color: '#9C93AC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTrack.artist}</div>
                </div>
              </button>
              <button onClick={() => toggleLike(currentTrack.id)} aria-label="Me gusta" style={{ background: 'none', border: 'none', cursor: 'pointer', color: likedIds.has(currentTrack.id) ? '#FF6B4A' : '#6B6278', flexShrink: 0 }}><Heart size={15} fill={likedIds.has(currentTrack.id) ? '#FF6B4A' : 'none'} /></button>
            </>
          ) : <div style={{ fontSize: 13, color: '#6B6278' }}>Elige una canción para empezar</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconBtn onClick={() => setShuffle((s) => !s)} active={shuffle} label="Aleatorio" size={30}><Shuffle size={15} /></IconBtn>
            <IconBtn onClick={goPrev} label="Anterior" size={32}><SkipBack size={17} fill="currentColor" /></IconBtn>
            <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pausar' : 'Reproducir'} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#F2EEF7', color: '#0E0B14', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" style={{ marginLeft: 2 }} />}
            </button>
            <IconBtn onClick={goNext} label="Siguiente" size={32}><SkipForward size={17} fill="currentColor" /></IconBtn>
            <IconBtn onClick={() => setRepeatOne((r) => !r)} active={repeatOne} label="Repetir" size={30}><Repeat size={15} /></IconBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 480 }}>
            <span style={{ fontSize: 11, color: '#6B6278', minWidth: 32, textAlign: 'right' }}>{formatTime(progress)}</span>
            <input type="range" min={0} max={currentTrack ? (currentTrack.duration || 0) : 100} value={Math.min(progress, currentTrack ? (currentTrack.duration || 0) : 100)} onChange={(e) => seekTo(Number(e.target.value))} disabled={!currentTrack}
              style={{ flex: 1, height: 4, borderRadius: 2, background: `linear-gradient(to right, #FF6B4A ${progressPct}%, #262032 ${progressPct}%)` }} />
            <span style={{ fontSize: 11, color: '#6B6278', minWidth: 32 }}>{formatTime(currentTrack?.duration)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          {audiocastSupported && (
            <IconBtn onClick={isAudiocasting ? disconnectAudiocast : openAudiocastPicker} active={isAudiocasting} label={isAudiocasting ? `Conectado a ${audiocastDevice.name}` : 'Enviar a AudioCast (DLNA)'} size={30}>
              <Radio size={16} />
            </IconBtn>
          )}
          {castAvailable && (
            <IconBtn onClick={toggleCast} active={casting} label={casting ? 'Desconectar Chromecast' : 'Enviar a Chromecast'} size={30}>
              <Cast size={16} />
            </IconBtn>
          )}
          <IconBtn onClick={() => setShowQueue((s) => !s)} active={showQueue} label="Cola de reproducción" size={30}><ListMusic size={16} /></IconBtn>
          <IconBtn onClick={handleVolumeToggle} label="Silenciar" size={30}><VolIcon size={16} /></IconBtn>
          <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ width: 100, height: 4, borderRadius: 2, background: `linear-gradient(to right, #F2EEF7 ${volume}%, #262032 ${volume}%)` }} />
        </div>
      </div>
    </div>
  );
}
