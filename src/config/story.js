// Original narrative and presentation copy. Career facts stay in personalInfo.js.
export const projectStories = {
  'ehr-timeline-triage': {
    subtitle: 'Making a patient’s history tell a clearer story.',
    summary:
      'Turning fragmented clinical events into a timeline for interpretable risk modeling.',
    tags: ['Clinical AI', 'Transformers', 'FastAPI'],
    visual: 'timeline',
    question:
      'How can a model make sense of a patient’s changing condition over time?',
  },
  'radiology-copilot': {
    subtitle: 'Connecting what we see with what we understand.',
    summary:
      'Bringing medical images and clinical language into one multimodal representation.',
    tags: ['Multimodal AI', 'ViT', 'ClinicalBERT'],
    visual: 'imaging',
    question:
      'What becomes possible when imaging and clinical language share a representation?',
  },
  'sepsis-sentinel': {
    subtitle: 'Finding the signal before the alarm.',
    summary:
      'Exploring earlier sepsis alerts with interpretable models and physiological signals.',
    tags: ['Early detection', 'XGBoost', 'SHAP'],
    visual: 'signals',
    question:
      'Can subtle changes in clinical data help surface a risk earlier?',
  },
  wardops: {
    summary:
      'Exploring patient flow, hospital capacity, and the consequences of “what if”.',
    tags: ['Digital twin', 'Simulation', 'LLM'],
    visual: 'systems',
  },
  medlyze: {
    summary:
      'Connecting medical reports and biomarker histories in a diagnostic support platform.',
    tags: ['Health data', 'TypeScript', 'Multimodal'],
    visual: 'imaging',
  },
  finmate: {
    summary:
      'Making financial patterns easier to understand through forecasting and anomaly detection.',
    tags: ['Forecasting', 'Data systems'],
    visual: 'signals',
  },
  'local-news-analytics': {
    summary:
      'Finding emerging stories in a continuous stream of unstructured news.',
    tags: ['NLP', 'BERTopic', 'BART'],
    visual: 'systems',
  },
};

export const featuredProjectIds = [
  'ehr-timeline-triage',
  'radiology-copilot',
  'sepsis-sentinel',
];

export const researchLenses = [
  {
    id: 'privacy',
    label: 'Privacy',
    title: 'Knowledge can travel. Patient data shouldn’t have to.',
    description:
      'Federated learning connects institutions through model updates. The question is how to keep learning as clinical data changes, while preserving privacy and previous knowledge.',
    terms: ['Federated learning', 'Differential privacy', 'Continual learning'],
    publicationId: 'pub-fcl',
  },
  {
    id: 'perception',
    label: 'Perception',
    title: 'A different way to see the same image.',
    description:
      'Foundation models offer a starting point for medical imaging. Adapting them under scarce labels means thinking carefully about efficiency, uncertainty, and the details a model can miss.',
    terms: ['Medical imaging', 'Foundation models', 'Few-shot adaptation'],
    publicationId: 'pub-polyp',
  },
  {
    id: 'computation',
    label: 'Computation',
    title: 'Bigger questions need new computational tools.',
    description:
      'Cancer modeling brings together complex biology and demanding computation. Exploring high-performance and quantum approaches opens a conversation about which tools fit which scientific questions.',
    terms: [
      'High-performance computing',
      'Cancer modeling',
      'Hybrid approaches',
    ],
    publicationId: 'pub-quantum',
  },
];
