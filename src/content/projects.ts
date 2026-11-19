export type Track = 'ai' | 'backend' | 'games' | 'tools' | 'data' | 'apps';

export const tracks: { id: Track; label: string; blurb: string }[] = [
  { id: 'ai', label: 'Applied AI', blurb: 'Models evaluated the honest way — leak-free splits, baselines, calibration.' },
  { id: 'backend', label: 'Backend Systems', blurb: 'APIs that stay correct under concurrent load, proven by race tests.' },
  { id: 'games', label: 'Games & 3D', blurb: 'Playable worlds in Three.js, Rapier, Phaser and Kotlin.' },
  { id: 'tools', label: 'Desktop & Dev Tools', blurb: 'Local-first utilities for Windows, Android and Claude Code.' },
  { id: 'data', label: 'Data & Analytics', blurb: 'Warehouses, governed metrics and decision-grade analysis.' },
  { id: 'apps', label: 'Full-Stack Products', blurb: 'End-to-end products with auth, roles, dashboards and APIs.' },
];

export type Project = {
  slug: string;
  name: string;
  track: Track;
  summary: string;
  proof: string;
  stack: string[];
  repo?: string;
  featured?: boolean;
};

const gh = (r: string) => `https://github.com/qasimrazamalik-coder/${r}`;

export const projects: Project[] = [
  // Applied AI
  { slug: 'qlora-text2sql', name: 'QLoRA Text-to-SQL', track: 'ai', featured: true, summary: 'QLoRA fine-tune of a small LLM for text-to-SQL.', proof: 'Base-vs-adapter benchmark on exact match and execution accuracy, plus a cost table.', stack: ['Python', 'PEFT', 'QLoRA'], repo: gh('qlora-text2sql') },
  { slug: 'governed-ai-analyst-benchmark', name: 'Governed AI Analyst Benchmark', track: 'ai', featured: true, summary: 'Does an LLM answer business questions more reliably through a governed metric layer than with raw SQL?', proof: '40-question benchmark on a dbt / DuckDB warehouse.', stack: ['dbt', 'DuckDB', 'LLM', 'Text-to-SQL'], repo: gh('governed-ai-analyst-benchmark') },
  { slug: 'xray-gradcam', name: 'X-ray Grad-CAM', track: 'ai', summary: 'Chest X-ray pneumonia classifier (ResNet-50 / EfficientNet-B0).', proof: 'From-scratch Grad-CAM and a calibration-aware evaluation.', stack: ['PyTorch', 'Computer Vision'], repo: gh('xray-gradcam') },
  { slug: 'ai-text-detector', name: 'AI Text Detector', track: 'ai', summary: 'Human-vs-AI text detectors.', proof: 'Leave-one-generator-out evaluation: does it work on a generator it never saw?', stack: ['Python', 'NLP'], repo: gh('ai-text-detector') },
  { slug: 'rag-eval-lab', name: 'RAG Eval Lab', track: 'ai', summary: 'PDF question answering.', proof: 'Retrieval evaluation comparing three chunking strategies.', stack: ['RAG', 'Embeddings'], repo: gh('rag-eval-lab') },
  { slug: 'urdu-sentiment-xlmr', name: 'Urdu Sentiment (XLM-R)', track: 'ai', summary: 'Urdu and Roman Urdu sentiment classification.', proof: 'Fine-tuned XLM-RoBERTa vs a TF-IDF baseline, with per-script error analysis.', stack: ['Transformers', 'Urdu NLP'], repo: gh('urdu-sentiment-xlmr') },
  { slug: 'clip-image-search', name: 'CLIP Image Search', track: 'ai', summary: 'Local text and image-by-example photo search.', proof: 'Zero-shot evaluation and a measured FAISS index comparison.', stack: ['CLIP', 'FAISS'], repo: gh('clip-image-search') },
  { slug: 'yolo-helmet-detect', name: 'YOLO Helmet Detect', track: 'ai', summary: 'Fine-tune a YOLO detector on any YOLO-format dataset.', proof: 'Dataset checker, mAP evaluation and an honest CPU-vs-GPU latency benchmark.', stack: ['YOLO', 'Computer Vision'], repo: gh('yolo-helmet-detect') },
  { slug: 'forecast-bench', name: 'Forecast Bench', track: 'ai', summary: 'Time-series forecasting comparison.', proof: 'Rolling-origin backtest: seasonal naive, ARIMA, LSTM and N-BEATS.', stack: ['Forecasting', 'Deep Learning'], repo: gh('forecast-bench') },
  { slug: 'recsys-compare', name: 'RecSys Compare', track: 'ai', summary: 'Recommenders on MovieLens.', proof: 'Leak-free comparison of popularity, item-kNN, MF and a two-tower model, with cold-start analysis.', stack: ['Recommenders', 'PyTorch'], repo: gh('recsys-compare') },
  { slug: 'fraud-anomaly', name: 'Fraud Anomaly', track: 'ai', summary: 'Autoencoder and Isolation Forest for card fraud.', proof: 'Time-split benchmark scored with PR-AUC and alert-budget metrics.', stack: ['Anomaly Detection'], repo: gh('fraud-anomaly') },
  { slug: 'voice-cloner', name: 'Voice Cloner', track: 'ai', featured: true, summary: 'Free, open-source Urdu + English voice cloning.', proof: 'Studio, real-time streaming, speech-to-speech and LoRA fine-tuning — runs free on Colab.', stack: ['TTS', 'LoRA', 'Python'], repo: gh('voice-cloner') },
  { slug: 'local-ai-background-remover-editor', name: 'Local AI Background Remover', track: 'ai', summary: 'Local-first background remover and image editor.', proof: 'Next.js + Konva editor on a FastAPI U2-Net ONNX backend — no paid APIs.', stack: ['Next.js', 'ONNX', 'FastAPI'], repo: gh('local-ai-background-remover-editor') },
  { slug: 'ai-support-agent-rag', name: 'AI Support Agent (RAG)', track: 'ai', summary: 'Customer-support agent over PDF, DOCX, TXT and Markdown.', proof: 'Answers with source citations; JWT roles and a React UI.', stack: ['FastAPI', 'ChromaDB', 'React'], repo: gh('AI-Support-Agent-RAG') },
  { slug: 'saif-ai-command-center', name: 'AI Command Center', track: 'ai', summary: 'Stateful multi-agent project execution platform.', proof: 'Orchestrator delegates to specialist agents with durable state and human-approval gates.', stack: ['FastAPI', 'SQLAlchemy', 'Agents'], repo: gh('saif-ai-command-center') },

  // Backend
  { slug: 'encore-seat-booking-api', name: 'Encore Seat Booking API', track: 'backend', featured: true, summary: 'Event seat-booking API that never double-sells.', proof: 'Expiring holds, all-or-nothing seat locking and idempotent checkout — proven by race tests.', stack: ['Node.js', 'Express 5', 'PostgreSQL'], repo: gh('encore-seat-booking-api') },
  { slug: 'shelfmark-library-api', name: 'Shelfmark Library API', track: 'backend', summary: 'Library circulation REST API.', proof: 'Loans, renewals, hold queues and fines that stay correct under concurrent requests.', stack: ['Node.js', 'PostgreSQL', 'OpenAPI'], repo: gh('shelfmark-library-api') },
  { slug: 'platform-task-tracker-api', name: 'Platform Task Tracker API', track: 'backend', summary: 'Project and task tracker API.', proof: 'Per-project roles, four-eyes review, WIP limits, dependency-cycle checks and flow metrics.', stack: ['Node.js', 'PostgreSQL'], repo: gh('platform-task-tracker-api') },
  { slug: 'ticker-url-shortener', name: 'Ticker URL Shortener', track: 'backend', summary: 'URL shortener with analytics.', proof: 'Feistel short codes, cached redirects, batched click logging, cookie-free unique visitors.', stack: ['Node.js', 'PostgreSQL', 'Caching'], repo: gh('ticker-url-shortener') },
  { slug: 'ledger-processor-bigint', name: 'Ledger Processor', track: 'backend', summary: 'High-precision ledger processor.', proof: 'BigInt accounting — no floating-point rounding errors.', stack: ['TypeScript', 'Fintech'], repo: gh('Ledger-Processor-BigInt') },
  { slug: 'fastapi-movie-database-api', name: 'FastAPI Movie API', track: 'backend', summary: 'Movie search API.', proof: 'JWT auth, indexed filters and Redis query caching.', stack: ['FastAPI', 'Redis'], repo: gh('FastAPI-Movie-Database-API') },
  { slug: 'flask-jwt-auth-system', name: 'Flask JWT Auth', track: 'backend', summary: 'Secure authentication REST API.', proof: 'Activation, password reset, MFA, RBAC, bcrypt and tests.', stack: ['Flask', 'Security'], repo: gh('Flask-JWT-Auth-System') },
  { slug: 'rust-universal-scraper', name: 'Rust Universal Scraper', track: 'backend', summary: 'Config-driven Rust web scraper.', proof: 'robots.txt, sitemap discovery, resumable crawls, CSV/JSONL/SQLite output.', stack: ['Rust'], repo: gh('Rust-Universal-Scraper') },

  // Games
  { slug: 'chain-reaction', name: 'Chain Reaction', track: 'games', featured: true, summary: 'Browser 3D physics puzzle workshop.', proof: 'Eight challenges, a creative sandbox and deterministic Rapier simulation.', stack: ['React', 'Three.js', 'Rapier'], repo: gh('chain-reaction') },
  { slug: 'red-thread-detective', name: 'Red Thread: The Stillwater Case', track: 'games', summary: 'Original 3D browser detective game.', proof: 'Built with TypeScript, Vite and Three.js.', stack: ['Three.js', 'TypeScript'], repo: gh('red-thread-detective') },
  { slug: 'chrono-heist', name: 'Chrono Heist', track: 'games', summary: 'Neon-noir 60-second time-loop stealth puzzle.', proof: 'TypeScript, Vite and Phaser 3.', stack: ['Phaser 3', 'TypeScript'], repo: gh('chrono-heist') },
  { slug: 'blockflux', name: 'BlockFlux', track: 'games', summary: 'Endless block puzzle for Android.', proof: 'Deterministic Kotlin core, custom Canvas renderer, 45-level journey and replay verification.', stack: ['Kotlin', 'Android'], repo: gh('blockflux') },
  { slug: 'jujutsu-kaisen', name: 'Cursed Technique Visualizer', track: 'games', summary: 'Hand-tracking visual effects in the browser (fan project).', proof: 'React, Three.js and MediaPipe running live on webcam input.', stack: ['MediaPipe', 'Three.js'], repo: gh('Jujutsu-Kaisen') },
  { slug: 'airsketch-ai-pro', name: 'AirSketch AI Pro', track: 'games', summary: 'Gesture-controlled whiteboard.', proof: 'OpenCV, MediaPipe Hands, optional YOLO and voice commands.', stack: ['OpenCV', 'MediaPipe'], repo: gh('AirSketch-AI-Pro') },

  // Tools
  { slug: 'guardian-x', name: 'Guardian X', track: 'tools', featured: true, summary: 'Battery coach for HP OMEN gaming laptops.', proof: 'Real health, wear speed, Windows battery history, charging coach and NVIDIA GPU watch — local-first.', stack: ['C#', 'Windows'], repo: gh('guardian-x') },
  { slug: 'drivemind', name: 'DriveMind', track: 'tools', featured: true, summary: 'AI drive guardian for Windows.', proof: 'Organise files, clear caches with Yes/Ask/No control, disk health, RAG assistant, MCP server.', stack: ['Python', 'RAG', 'MCP'], repo: gh('drivemind') },
  { slug: 'dual-earbuds', name: 'Dual Earbuds', track: 'tools', summary: 'One sound on two or more pairs of earbuds at once.', proof: 'Windows laptop, Android phones and browser — free, open source, no cloud.', stack: ['C#', 'Kotlin', 'WASAPI'], repo: gh('dual-earbuds') },
  { slug: 'motion-forge', name: 'Motion Forge', track: 'tools', summary: 'AI motion graphics that check their own frames.', proof: 'Claude Code skill: kinetic type, promos, captions, VFX and NLE hand-off.', stack: ['Three.js', 'GSAP', 'FFmpeg'], repo: gh('motion-forge') },
  { slug: 'offline-voice-assistant', name: 'Offline Voice Assistant', track: 'tools', summary: 'Offline Windows voice assistant.', proof: 'Vosk recognition, optional Whisper for Urdu, offline TTS.', stack: ['Python', 'Whisper'], repo: gh('offline-voice-assistant') },
  { slug: 'punjab-electric', name: 'Punjab Electric POS', track: 'tools', summary: 'Windows POS for electrical shops.', proof: 'Multi-tab billing, low-stock alerts, PDF receipts, autosave and crash recovery.', stack: ['Python', 'Desktop'], repo: gh('Punjab-Electric') },

  // Data
  { slug: 'cx-journey-warehouse', name: 'CX Journey Warehouse', track: 'data', featured: true, summary: 'Unified customer-journey warehouse for telesales + support.', proof: 'dbt on DuckDB, identity resolution, governed metrics and a go-live calibration report.', stack: ['dbt', 'DuckDB', 'SQL'], repo: gh('cx-journey-warehouse') },
  { slug: 'ai-agent-outcome-audit', name: 'AI Agent Outcome Audit', track: 'data', summary: 'Does the support bot actually resolve problems?', proof: 'Containment vs true resolution by intent, cost per true resolution and a routing recommendation.', stack: ['Python', 'Analytics'], repo: gh('ai-agent-outcome-audit') },
  { slug: 'ab-testing-analytics', name: 'A/B Testing Analytics', track: 'data', summary: 'A/B test analysis with a ship/hold decision rule.', proof: 'SRM check, Holm correction and a bootstrap guardrail.', stack: ['Statistics'], repo: gh('ab-testing-analytics') },
  { slug: 'olist-customer-360', name: 'Olist Customer 360', track: 'data', summary: 'Marketplace customer 360.', proof: 'Cohorts, forecast, sentiment and a leakage-guarded churn model.', stack: ['Python', 'SQL'], repo: gh('olist-customer-360') },
  { slug: 'fraud-analytics', name: 'Fraud Analytics', track: 'data', summary: 'Payment fraud on a PaySim-layout table.', proof: 'Point-in-time features, delayed-label split, cost-based alert threshold.', stack: ['Python'], repo: gh('fraud-analytics') },

  // Apps
  { slug: 'ai-trading-platform', name: 'Quant OS', track: 'apps', featured: true, summary: 'Self-hosted multi-asset quant research and paper-execution platform.', proof: 'Deterministic core with strategy / risk / execution separation.', stack: ['Python', 'Backtesting'], repo: gh('ai-trading-platform') },
  { slug: 'his', name: 'Hospital Information System', track: 'apps', summary: 'Full HIS with an ML risk service.', proof: 'Express API, React UI, Prisma/PostgreSQL, WebSocket alerts, RBAC, audit logging, encrypted fields.', stack: ['TypeScript', 'Prisma', 'Socket.IO'], repo: gh('HIS') },
  { slug: 'apex-school-os', name: 'Apex School OS', track: 'apps', summary: 'Full-stack school management system.', proof: 'Django REST Framework API with a Next.js front end.', stack: ['Django', 'Next.js'], repo: gh('apex-school-os') },
  { slug: 'speech-to-speech-translation', name: 'Speech-to-Speech Translation', track: 'apps', summary: 'Offline-first translation for English, Urdu and more.', proof: 'FastAPI STT → translation → TTS with realtime WebSocket conversation.', stack: ['FastAPI', 'React', 'WebSocket'], repo: gh('Speech-to-Speech-Translation-System') },
  { slug: 'pdf-editor', name: 'PDF Editor', track: 'apps', summary: 'Free in-browser PDF editor.', proof: 'TypeScript + React, live on Vercel.', stack: ['React', 'TypeScript'], repo: gh('PDF-Editor') },
  { slug: 'chrome-extension-demo', name: 'AI Job Application Copilot', track: 'apps', summary: 'Chrome extension that tailors resumes, cover letters and recruiter messages.', proof: 'React + Vite extension UI working against any job post.', stack: ['Chrome Extension', 'React'], repo: gh('Chrome-Extension-Demo') },
];

export const featured = projects.filter((p) => p.featured);
