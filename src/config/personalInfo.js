// Single source of truth for all portfolio content.
// Components must never hardcode facts; they read from here.

const personalInfo = {
  name: "Anay Sinhal",
  title: "Clinical AI Researcher & Software Engineer",
  email: "sinhal.anay@ufl.edu",
  orcid: "0009-0008-8328-2336",

  github: "https://github.com/anayy09",
  linkedin: "https://linkedin.com/in/anaysinhal",
  cv: "/cv",
  repo: "https://github.com/anayy09/Cosmic-Portfolio",

  description:
    "Clinical AI researcher and software engineer building health data infrastructure at the University of Florida. My work spans EHR time-series modeling, multimodal clinical representation learning, and reproducible biomedical pipelines on HPC. Eight peer-reviewed publications, three patents, and a Gold Medal in CS.",

  hero: {
    typewriter: [
      "Clinical AI Researcher",
      "Software Engineer",
      "Health Data Engineer",
      "Geography Nerd",
    ],
    coordinates: "29.6516° N · 82.3248° W · GAINESVILLE FL",
    station: "UF IC3 / PRISMAP LAB",
    status: "Open to full-time roles · Dec 2026",
    stats: [
      { value: 8, label: "publications" },
      { value: 3, label: "patents" },
      { value: 6, suffix: "+", label: "institutions" },
      { value: 30, suffix: "+", label: "technologies" },
    ],
  },

  about: {
    intro:
      "I work at the intersection of clinical informatics, machine learning, and systems engineering. At UF's PRISMAp Lab, I build the infrastructure that connects social determinants of health with clinical outcomes: pipelines that run on HiPerGator, models that explain their reasoning, systems that hold up under the pressure of real hospital data.",
    pillars: [
      {
        id: "clinical-ai",
        index: "01",
        title: "Clinical AI & Health Data",
        description:
          "EHR time-series modeling, AKI phenotyping, SDoH linkage pipelines (SVI, ADI, SDI, EJI, AHRQ), pathology slide de-identification, explainable AI with SHAP and Grad-CAM. Built to run at HPC scale.",
        accent: "teal",
      },
      {
        id: "systems",
        index: "02",
        title: "Systems & Infrastructure",
        description:
          "Full-stack systems from FastAPI microservices to React dashboards, containerized with Docker, scheduled on SLURM. PostgreSQL, Redis, Azure, HiPerGator. Correctness before speed.",
        accent: "blue",
      },
      {
        id: "research",
        index: "03",
        title: "Research & Publications",
        description:
          "Eight peer-reviewed papers across Scientific Reports, IEEE, Springer, and the Journal of Carcinogenesis, including a first-author Nature-portfolio publication. Three patents, one granted.",
        accent: "lavender",
      },
    ],
  },

  skillCategories: [
    {
      id: "languages",
      index: "A",
      title: "Languages",
      skills: [
        { name: "Python", icon: "SiPython", context: "daily" },
        { name: "TypeScript", icon: "SiTypescript", context: "production" },
        { name: "JavaScript", icon: "SiJavascript", context: "production" },
        { name: "Go", icon: "SiGo", context: "systems" },
        { name: "Java", icon: "FaJava", context: "production" },
        { name: "C/C++", icon: "SiCplusplus", context: "research" },
        { name: "SQL", icon: "SiPostgresql", context: "daily" },
        { name: "Bash", icon: "SiGnubash", context: "daily" },
      ],
    },
    {
      id: "ml-web",
      index: "B",
      title: "ML & Application",
      skills: [
        { name: "PyTorch", icon: "SiPytorch", context: "research" },
        { name: "TensorFlow", icon: "SiTensorflow", context: "research" },
        { name: "Hugging Face", icon: "SiHuggingface", context: "research" },
        { name: "scikit-learn", icon: "SiScikitlearn", context: "daily" },
        { name: "FastAPI", icon: "SiFastapi", context: "production" },
        { name: "Django", icon: "SiDjango", context: "production" },
        { name: "React", icon: "SiReact", context: "daily" },
        { name: "Next.js", icon: "SiNextdotjs", context: "production" },
        { name: "Node.js", icon: "SiNodedotjs", context: "production" },
        { name: "Spring Boot", icon: "SiSpringboot", context: "production" },
      ],
    },
    {
      id: "infra",
      index: "C",
      title: "Infrastructure & Data",
      skills: [
        { name: "PostgreSQL", icon: "SiPostgresql", context: "production" },
        { name: "Docker", icon: "SiDocker", context: "daily" },
        { name: "SLURM / HiPerGator", icon: "SiLinux", context: "research" },
        { name: "Azure", icon: "FiCloud", context: "production" },
        { name: "AWS", icon: "SiAmazonwebservices", context: "production" },
        { name: "Redis", icon: "SiRedis", context: "production" },
        { name: "MongoDB", icon: "SiMongodb", context: "production" },
        { name: "Git / CI-CD", icon: "SiGit", context: "daily" },
        { name: "Figma", icon: "SiFigma", context: "design" },
      ],
    },
  ],

  education: [
    {
      title: "M.S. Computer & Information Science",
      organization: "University of Florida",
      logoUrl: "/logos/uf.png",
      description:
        "Graduate research in clinical AI and health informatics; began graduate coursework in the CISE Senior Certificate Program, Spring 2025. Coursework: Distributed OS Principles, Analysis of Algorithms, Advanced Data Structures, Networks, ML Engineering, Trust in AI.",
      startDate: "Jan 2025",
      endDate: "Dec 2026",
      skills: ["Distributed Systems", "Algorithms", "ML Engineering", "Trust in AI"],
    },
    {
      title: "Semester Exchange",
      organization: "IIT Kanpur",
      logoUrl: "/logos/iitk.png",
      description: "Sixth-semester exchange. Coursework in Big Data systems.",
      startDate: "Jan 2024",
      endDate: "May 2024",
      skills: ["Big Data", "Brand Management"],
    },
    {
      title: "Semester Exchange",
      organization: "IIT Gandhinagar",
      logoUrl: "/logos/iitgn.png",
      description: "Third-semester exchange across CS theory and humanities.",
      startDate: "Aug 2022",
      endDate: "Dec 2022",
      skills: ["Theory of Computation", "Data Structures", "Philosophy"],
    },
    {
      title: "B.Tech Computer Science & Engineering",
      organization: "JK Lakshmipat University",
      logoUrl: "/logos/jklu.png",
      description:
        "Gold Medal: Dr. Kavita Choudhary Award for Best Outgoing Student in B.Tech CSE, 2025.",
      startDate: "Aug 2021",
      endDate: "May 2025",
      skills: ["Algorithms", "Operating Systems", "Machine Learning"],
      award: "Gold Medal · Best Outgoing Student",
    },
  ],

  experience: [
    {
      title: "Graduate Student Assistant",
      organization: "PRISMAp Lab, UF IC3",
      logoUrl: "/logos/ic3.png",
      description:
        "SDoH linkage pipeline integrating multi-year indices (SVI, ADI, SDI, EJI, AHRQ) with hierarchical geocoding for a clinical data consortium. Pathology slide de-identification with ResNet/MobileNet text detection and PaddleOCR, batch-automated on HiPerGator via SLURM. AKI phenotyping, clinical notes embeddings, and Dockerized preprocessing standards across the lab.",
      startDate: "Sep 2025",
      endDate: "Present",
      location: "Gainesville, FL",
      skills: ["Python", "SLURM", "Azure", "PyTorch", "FastAPI", "PostgreSQL"],
    },
    {
      title: "Research Assistant",
      organization: "SBILab, IIIT Delhi",
      logoUrl: "/logos/iiitd.png",
      description:
        "Full-stack research infrastructure (Next.js, Node.js, PostgreSQL) backing AI-based ECG and cancer diagnostic models, with SHAP-style feature attribution tooling for interpretability and CI/CD pipelines for reproducible iteration.",
      startDate: "Sep 2024",
      endDate: "Oct 2024",
      location: "New Delhi",
      skills: ["Next.js", "Node.js", "PostgreSQL", "SHAP", "CI/CD"],
    },
    {
      title: "SDE Intern",
      organization: "GeeksforGeeks",
      logoUrl: "/logos/gfg.png",
      description:
        "Rebuilt core content pages (Articles, Videos, Quizzes) in Next.js over legacy PHP views; structured data and server-side rendering improved search visibility on high-traffic pages.",
      startDate: "May 2024",
      endDate: "Sep 2024",
      location: "Noida",
      skills: ["Next.js", "React", "SEO", "PHP"],
    },
    {
      title: "Research Intern",
      organization: "SVNIT Surat",
      logoUrl: "/logos/svnit.png",
      description:
        "Contrastive learning + BERT pipeline for depression detection on DepressionEmo (F1 0.81, roughly 10% over baseline BERT). Published at IEEE InC4 2025.",
      startDate: "May 2024",
      endDate: "Jul 2024",
      location: "Remote",
      skills: ["Contrastive Learning", "NLP", "PyTorch"],
    },
    {
      title: "Research Intern",
      organization: "IIT Jammu",
      logoUrl: "/logos/iitjmu.png",
      description:
        "Stacking ensemble (Random Forest, XGBoost, MLP) for stress detection on 11.5M wearable sensor records: 93.7% macro F1 at 14.5 ms inference, minority-class recall up 37% via SMOTE-Tomek. Published in Springer LNNS.",
      startDate: "Dec 2023",
      endDate: "Jan 2024",
      location: "Remote",
      skills: ["Ensemble ML", "XGBoost", "Imbalanced Learning"],
    },
    {
      title: "SDE Intern",
      organization: "Dexpert Systems",
      logoUrl: "/logos/dexpert.png",
      description:
        "React front-end integrated with Spring Boot and Laravel services for Zoho CRM workflows, cutting lead assignment latency from minutes to near-real-time. JWT-authenticated REST APIs and Docker Compose delivery.",
      startDate: "Jun 2023",
      endDate: "Jul 2023",
      location: "Pune",
      skills: ["React", "Spring Boot", "Docker", "REST"],
    },
  ],

  projects: [
    {
      id: "ehr-timeline-triage",
      name: "EHR Timeline Triage",
      date: "Nov 2025",
      description:
        "Bins longitudinal EHR events into 4-hour windows and trains Logistic Regression, GRU, and Transformer models for 30-day readmission and 48-hour ICU mortality. FastAPI inference service, interactive timeline UI, feature attribution tied to clinical time windows, synthetic cohort generator.",
      url: "https://github.com/anayy09/EHR-Timeline-Triage",
      language: "Python",
      domain: "health",
      metrics: [
        { label: "models", value: "LR · GRU · Transformer" },
        { label: "eval", value: "AUROC · AUPRC · Brier" },
        { label: "window", value: "4h bins" },
      ],
      imageUrl: "/projects/ehr.png",
    },
    {
      id: "wardops",
      name: "WardOps Digital Twin",
      date: "Jan 2026",
      description:
        "Hospital operations digital twin: discrete-event simulation of patient flow and capacity, an LLM copilot with function calling for natural-language what-if scenarios, Sankey flow diagrams and bottleneck heatmaps for operational experimentation.",
      url: "https://github.com/anayy09/WardOps",
      language: "Python",
      domain: "health",
      metrics: [
        { label: "engine", value: "DES" },
        { label: "copilot", value: "LLM fn-calling" },
        { label: "viz", value: "Sankey · heatmaps" },
      ],
    },
    {
      id: "radiology-copilot",
      name: "Radiology Copilot",
      date: "Nov 2025",
      description:
        "CLIP-style multimodal chest X-ray system: ViT image encoder + ClinicalBERT text encoder detecting 14 findings with calibrated uncertainty, Grad-CAM saliency overlays, AI-drafted reports, and full study lifecycle behind a Next.js dashboard.",
      url: "https://github.com/anayy09/Radiology-Copilot",
      language: "Python",
      domain: "health",
      metrics: [
        { label: "findings", value: "14" },
        { label: "saliency", value: "Grad-CAM" },
      ],
      imageUrl: "/projects/radiology.png",
    },
    {
      id: "medlyze",
      name: "Medlyze",
      date: "Oct 2025",
      description:
        "Diagnostic support platform with AES-256 encrypted report intake, regex de-identification, and role-based access for patients and clinicians. Multimodal LLM analysis over PDFs and images with longitudinal biomarker tracking.",
      url: "https://github.com/anayy09/Medlyze",
      language: "TypeScript",
      domain: "health",
      metrics: [
        { label: "crypto", value: "AES-256" },
        { label: "access", value: "RBAC" },
      ],
      imageUrl: "/projects/medlyze.png",
    },
    {
      id: "sepsis-sentinel",
      name: "Sepsis Sentinel",
      date: "Jul 2025",
      description:
        "Early sepsis detection from EHR data with XGBoost and LightGBM, SHAP attributions for clinical interpretability, and a React dashboard simulating up to 4-hour earlier alerts than standard windows.",
      url: "https://github.com/anayy09/Sepsis-Sentinel",
      language: "Python",
      domain: "health",
      metrics: [
        { label: "AUROC", value: "0.89" },
        { label: "lead", value: "4h earlier" },
      ],
      imageUrl: "/projects/sepsis.png",
    },
    {
      id: "finmate",
      name: "FinMate",
      date: "Jun 2025",
      description:
        "Personal finance manager: Plaid ingestion, Random Forest forecasting, Isolation Forest anomaly detection, D3/Plotly dashboards with budget alerts.",
      url: "https://github.com/anayy09/Finmate",
      language: "Python",
      domain: "systems",
      metrics: [
        { label: "forecast", value: "Random Forest" },
        { label: "anomaly", value: "Isolation Forest" },
      ],
      imageUrl: "/projects/finmate.png",
    },
    {
      id: "local-news-analytics",
      name: "Local News Analytics",
      date: "Apr 2025",
      description:
        "NLP pipeline clustering 2k+ news items daily with spaCy, BERTopic, and BART; flags emerging events at F1 0.83 behind a scheduled Flask dashboard.",
      url: "https://github.com/anayy09/Local-News-Analytics",
      language: "Python",
      domain: "nlp",
      metrics: [
        { label: "F1", value: "0.83" },
        { label: "volume", value: "2k/day" },
      ],
      imageUrl: "/projects/news.png",
    },
  ],

  publications: [
    {
      id: "pub-fcl",
      featured: true,
      firstAuthor: true,
      title:
        "Federated continual learning for privacy-preserving chest radiograph classification",
      authors: ["Anay Sinhal", "Amit Sinhal", "Arpana Sinhal"],
      venue: "Scientific Reports",
      venueNote: "Nature Portfolio",
      year: "Jun 2026",
      description:
        "Proposes DP-FedEPC: elastic weight consolidation, prototype-based rehearsal, and client-side DP-SGD inside FedAvg, enabling multi-site chest radiograph classification without raw image sharing or catastrophic forgetting. Trained on CheXpert, validated externally on MIMIC-CXR.",
      type: "Journal",
      domain: "Clinical AI",
      doi: "10.1038/s41598-026-55211-7",
      url: "https://doi.org/10.1038/s41598-026-55211-7",
    },
    {
      id: "pub-stress",
      title:
        "Stress Monitoring in Healthcare: An Ensemble Machine Learning Framework Using Wearable Sensor Data",
      authors: ["Amit Sinhal", "Arpana Sinhal", "Anay Sinhal"],
      venue: "Lecture Notes in Networks and Systems, Springer · ICICV 2026",
      year: "Apr 2026",
      description:
        "Ensemble framework over multimodal wearable sensor signals with SMOTE-Tomek class balancing for proactive stress monitoring in clinical settings.",
      type: "Conference",
      domain: "Clinical AI",
      doi: "10.1007/978-3-032-14757-8_12",
      url: "https://doi.org/10.1007/978-3-032-14757-8_12",
    },
    {
      id: "pub-quantum",
      title:
        "High-Performance and Quantum Computing in Cancer Modeling: A Review and Hybrid HPC-Quantum Approach",
      authors: [
        "Vaibhav Banga",
        "Anay Sinhal",
        "Amit Hirawat",
        "Amit Sinhal",
        "Aruna Senger",
        "Arpana Sinhal",
      ],
      venue: "International Journal of Advances in Signal and Image Sciences (IJASIS), vol. 12",
      year: "Feb 2026",
      description:
        "Reviews HPC and quantum methods for cancer modeling and proposes a hybrid HPC-quantum computational approach.",
      type: "Journal",
      domain: "Clinical AI",
      doi: "10.29284/bfq8ev64",
      url: "https://doi.org/10.29284/bfq8ev64",
    },
    {
      id: "pub-facial",
      title:
        "Artificial Intelligence-Integrated Facial Recognition Model for Efficient Attendance Automation",
      authors: ["Inderjeet Singh Devra", "Mukul Singh Jadoun", "Arpana Sinhal", "Anay Sinhal"],
      venue: "2025 Modern Electronics Devices and Intelligent Communication Systems (MEDCOM)",
      year: "Dec 2025",
      description:
        "AI-integrated facial recognition system for automated attendance in institutional settings.",
      type: "Conference",
      domain: "Systems",
      doi: "10.1109/medcom67532.2025.11404934",
      url: "https://doi.org/10.1109/medcom67532.2025.11404934",
    },
    {
      id: "pub-depression",
      title:
        "Contrastive Learning and Large Language Models for Depression Detection from Social Media",
      authors: ["Arpana Sinhal", "Anay Sinhal", "Amit Sinhal"],
      venue: "2025 IEEE International Conference on Contemporary Computing and Communications (InC4)",
      year: "Dec 2025",
      description:
        "Contrastive pretraining over BERT representations lifts depression-detection F1 by roughly 10% over baseline on the DepressionEmo dataset.",
      type: "Conference",
      domain: "NLP",
      doi: "10.1109/InC465408.2025.11256322",
      url: "https://doi.org/10.1109/InC465408.2025.11256322",
    },
    {
      id: "pub-p2p",
      title: "Battery-aware super-peer and fountain coding in Java P2P systems",
      authors: ["Arpana Sinhal", "Anay Sinhal", "Amit Sinhal"],
      venue: "Discover Internet of Things, Springer Nature, vol. 5",
      year: "Nov 2025",
      description:
        "Extends BitTorrent-style swarms with battery-aware super-peer election and fountain coding for resilience in degraded networks.",
      type: "Journal",
      domain: "Systems",
      doi: "10.1007/s43926-025-00240-3",
      url: "https://doi.org/10.1007/s43926-025-00240-3",
    },
    {
      id: "pub-diagnostic",
      title: "Optimizing Diagnostic Accuracy in Healthcare by Using Deep Learning",
      authors: ["Arpana Sinhal", "Nitin Sahu", "Anay Sinhal"],
      venue: "2025 IEEE 4th World Conference on Applied Intelligence and Computing (AIC)",
      year: "Nov 2025",
      description:
        "Deep learning and NLP integrated for disease detection and medical report analysis.",
      type: "Conference",
      domain: "Clinical AI",
      doi: "10.1109/AIC66080.2025.11211920",
      url: "https://doi.org/10.1109/AIC66080.2025.11211920",
    },
    {
      id: "pub-polyp",
      title:
        "LoRA-Tuned Segment Anything Model for Few-Shot Polyp Segmentation in Colonoscopy Images",
      authors: [
        "Arpana Sinhal",
        "Anay Sinhal",
        "Amit Sinhal",
        "Rekha Jain",
        "Arpit Kumar Sharma",
      ],
      venue: "Journal of Carcinogenesis, vol. 24",
      year: "Sep 2025",
      description:
        "Adapts SAM with LoRA fine-tuning for polyp segmentation under few-shot supervision.",
      type: "Journal",
      domain: "Clinical AI",
      doi: "10.64149/J.Carcinog.24.3.372-386",
      url: "https://doi.org/10.64149/J.Carcinog.24.3.372-386",
    },
  ],

  patents: [
    {
      id: "patent-offloading",
      title:
        "Bio-Inspired Adaptive Task Offloading System for Energy-Efficient IoT-Edge-Cloud Healthcare Continuum",
      grants: [
        { label: "German Utility Model", number: "DE 20 2026 101 701 U1", status: "Granted", date: "Apr 2026" },
        { label: "Indian Application", number: "202611027418", status: "Published", date: "May 2026" },
      ],
      domain: "Clinical AI",
      granted: true,
    },
    {
      id: "patent-dissemination",
      title:
        "A Method for Disaster-Resilient Digital File Dissemination via Fountain-Coded Broadcast with Super-Peer Election and Sparse Acknowledgement",
      grants: [
        { label: "Indian Application", number: "202511063465", status: "Published", date: "Jul 2025" },
      ],
      domain: "Systems",
    },
    {
      id: "patent-stress",
      title:
        "A Stress Monitoring System Using Wearable Sensor Data Integrated with an Ensemble Machine-Learning Model",
      grants: [
        { label: "Indian Application", number: "202511044124", status: "Published", date: "May 2025" },
      ],
      domain: "Clinical AI",
    },
  ],

  awards: [
    { title: "Gold Medal · Best Outgoing Student, B.Tech CSE", org: "JK Lakshmipat University", year: "2025" },
    { title: "Best Innovator Award", org: "Manipal University Jaipur", year: "2025" },
    { title: "Runner-Up · National Startup Day Exhibition", org: "AIC-JKLU", year: "2022" },
  ],

  // Ordered career waypoints, animated as great-circle arcs on the globe.
  // placeId references visitedPlaces entries.
  itinerary: [
    { placeId: "place-2", year: "2003", label: "Origin" },
    { placeId: "place-1", year: "2021", label: "B.Tech · JK Lakshmipat University" },
    { placeId: "place-7", year: "2022", label: "Exchange · IIT Gandhinagar" },
    { placeId: "place-6", year: "2023", label: "SDE Intern · Dexpert Systems" },
    { placeId: "place-33", year: "2023", label: "Research Intern · IIT Jammu" },
    { placeId: "place-26", year: "2024", label: "Exchange · IIT Kanpur" },
    { placeId: "place-8", year: "2024", label: "Research Intern · SVNIT Surat" },
    { placeId: "place-29", year: "2024", label: "SDE Intern · GeeksforGeeks" },
    { placeId: "place-5", year: "2024", label: "RA · SBILab, IIIT Delhi" },
    { placeId: "place-50", year: "2025", label: "MS CS · University of Florida", current: true },
  ],

  visitedPlaces: [
    { id: "place-1", name: "Jaipur, India", coordinates: [75.7873, 26.9124], story: "Home base", significance: "Home" },
    { id: "place-2", name: "Bhopal, India", coordinates: [77.401989, 23.2584857], story: "Birthplace" },
    { id: "place-4", name: "Udaipur, India", coordinates: [73.6862571, 24.578721], significance: "City of Lakes" },
    { id: "place-5", name: "New Delhi, India", coordinates: [77.2090057, 28.6138954], story: "Internship at IIIT Delhi" },
    { id: "place-6", name: "Pune, India", coordinates: [73.8544541, 18.521428], story: "Internship at Dexpert Systems" },
    { id: "place-7", name: "Ahmedabad, India", coordinates: [72.5797068, 23.0216238], story: "Exchange at IIT Gandhinagar" },
    { id: "place-8", name: "Surat, India", coordinates: [72.8317058, 21.2094892], story: "Research internship at SVNIT" },
    { id: "place-9", name: "Daman, India", coordinates: [72.833173, 20.4169701], story: "Family vacation" },
    { id: "place-10", name: "Mumbai, India", coordinates: [72.8692035, 19.054999], story: "Visited during internship" },
    { id: "place-11", name: "Lonavala, India", coordinates: [73.4016729, 18.7548563], story: "Weekend escape" },
    { id: "place-12", name: "Panaji, India", coordinates: [73.8282141, 15.4989946], story: "Family vacation" },
    { id: "place-14", name: "Munnar, India", coordinates: [77.0600915, 10.0869959], story: "Family vacation" },
    { id: "place-19", name: "Indore, India", coordinates: [75.8681996, 22.7203616], significance: "Relative's place" },
    { id: "place-22", name: "Gangtok, India", coordinates: [88.6122673, 27.329046], story: "Family vacation" },
    { id: "place-23", name: "Darjeeling, India", coordinates: [88.263176, 27.0377554], story: "Family vacation" },
    { id: "place-24", name: "Varanasi, India", coordinates: [83.0076292, 25.3356491], story: "Visited during exchange at IIT Kanpur" },
    { id: "place-25", name: "Ayodhya, India", coordinates: [82.2052321, 26.7990707], story: "Visited during exchange at IIT Kanpur" },
    { id: "place-26", name: "Kanpur, India", coordinates: [80.3217588, 26.4609135], story: "Semester exchange at IIT Kanpur" },
    { id: "place-29", name: "Noida, India", coordinates: [77.3271074, 28.5707841], story: "Internship at GeeksforGeeks" },
    { id: "place-31", name: "Chandigarh, India", coordinates: [76.7797143, 30.7334421], story: "School trip" },
    { id: "place-32", name: "Amritsar, India", coordinates: [74.8736788, 31.6343083], story: "School trip" },
    { id: "place-33", name: "Jammu, India", coordinates: [74.8580917, 32.7185614], story: "Research internship at IIT Jammu" },
    { id: "place-34", name: "Srinagar, India", coordinates: [74.8204443, 34.0747444], story: "Family vacation" },
    { id: "place-37", name: "Shimla, India", coordinates: [77.1709729, 31.1041526], story: "Family vacation" },
    { id: "place-38", name: "Manali, India", coordinates: [77.1872926, 32.2454608], story: "College trip" },
    { id: "place-39", name: "Dalhousie, India", coordinates: [75.9797487, 32.5360472], story: "School trip" },
    { id: "place-41", name: "Rishikesh, India", coordinates: [78.2916193, 30.1086537], story: "College trip" },
    { id: "place-42", name: "Nainital, India", coordinates: [79.455569, 29.3917821], story: "Family vacation" },
    { id: "place-45", name: "Kuala Lumpur, Malaysia", coordinates: [101.6942371, 3.1516964], story: "Family vacation" },
    { id: "place-49", name: "Orlando, USA", coordinates: [-81.3790304, 28.5421109], story: "Visited during travel" },
    { id: "place-50", name: "Gainesville, USA", coordinates: [-82.3249846, 29.6519684], story: "University of Florida", significance: "Current station" },
    { id: "place-55", name: "Atlanta, USA", coordinates: [-84.3902644, 33.7489924], story: "Visited during travel" },
  ],

  apis: {
    emailjs: {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    },
  },
};

export default personalInfo;
