/**
 * Site content.
 *
 * All real. No fabricated entries remain.
 *
 * Nothing in this file is read directly by a page. Pages go through
 * src/lib/content.ts. See design.md D3 for why that matters.
 */

import type {
  BlogPost,
  HackathonWin,
  OpenSourceContribution,
  Package,
  PersonalProject,
  Profile,
  Publication,
  ReadingNote,
  Talk,
  WorkProject,
} from "./types";

export const profile: Profile = {
  name: "Nandhakumar Saravanan",
  positioning:
    "Research engineer applying AI/ML in clinical trials — taking techniques from evaluation through to production.",
  /**
   * Paragraphs are separated by a blank line and split on render, so this
   * stays one editable string rather than an array the type would have to
   * model. Four short paragraphs: who I am, what the work actually is, the
   * domain question, and what I build outside it.
   */
  bio: [
    "I'm Nandhakumar, a research engineer, and I've spent over three years building AI/ML applications for clinical trials.",
    "The research is the applied kind. I start from a problem, survey what exists or has just been published, test what holds up against real data, and ship what survives. The research and the engineering aren't separate jobs; the second is what the first is for.",
    "Life sciences is where I work, not the limit of what I can work on. I didn't know the domain when I started — I learned its standards and constraints because the problems required it. That's the part that carries.",
    "Outside of work I write, contribute to open source, give talks, enter hackathons and build my own projects.",
  ].join("\n\n"),
  /**
   * See the note on Profile.heroIntro — this is NOT a slice of `bio`.
   * One paragraph today; it still splits on a blank line if a second is added.
   */
  heroIntro:
    "A research engineer applying AI/ML in clinical trials domain. I start from a problem, survey what exists or has just been published, test what holds up against real data, and ship what survives.",
  // Ordered as the work happens: problem in, specification, production, then
  // the judgement about whether it should continue at all.
  capabilities: [
    "Turn a business problem into a proof of concept that answers the real question",
    "Close the gap between what the business means and what a system can execute",
    "Turn a proof of concept into production code",
    "Recognise when something shouldn't go forward",
  ],
  email: "suriyank532002@gmail.com",
  /**
   * The generated PDF in public/, not the /cv route — the header button is a
   * download, not a navigation. Regenerate the file with `npm run cv` after
   * changing anything this CV renders, or the download goes stale while /cv
   * silently stays correct.
   */
  cvUrl: "/cv.pdf",
  phone: "+91 93440 02342",
  // Live on GitHub Pages. Update this (and nowhere else — the CV reads from
  // here) if a custom domain is ever attached; Pages will redirect the old
  // address automatically, but the CV's printed text won't update itself.
  siteUrl: "nandha-kumar-s.github.io",
  cvSummary:
    "A research engineer with over three years building AI/ML applications for clinical trials. The research is the applied kind: I start from a problem, survey what exists or has just been published, test what holds up against real data, and ship what survives. Life sciences is where I work, not the limit of what I can work on.",
  /**
   * Four rows, each internally consistent in abstraction. Deliberately NOT a
   * dump of everything touched: a specific GPU model, a single niche library
   * or a technique used inside one project reads as padding next to a named
   * tool a reviewer is actually screening for.
   */
  skills: [
    {
      label: "Languages & tooling",
      items: ["Python", "SQL", "pandas", "NumPy", "Git", "pytest"],
    },
    {
      label: "LLMs & agents",
      items: [
        "Fine-tuning (LoRA, QLoRA)",
        "Quantization-aware training",
        "vLLM",
        "DSPy",
        "LangGraph",
        "Vector databases",
      ],
    },
    {
      label: "Machine learning",
      items: ["XGBoost", "scikit-learn", "Synthetic data generation"],
    },
    {
      label: "Domain",
      items: ["Clinical trial data (EDC)", "CDISC USDM"],
    },
  ],
  profiles: [
    { label: "GitHub", url: "https://github.com/Nandha-kumar-S" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/nandhakumar-s-12a415212/",
    },
    { label: "Medium", url: "https://medium.com/@suriyank532002" },
  ],
  /**
   * Newest first. Both roles are at the same employer, listed separately
   * because the title changed — an intern converting to a full-time research
   * role is a progression, and collapsing them into one entry hides it.
   */
  experience: [
    {
      company: "Saama",
      role: "Research Engineer",
      period: "Sep 2024 — Present",
      summary:
        "Applied R&D on AI/ML for life-science products: evaluating new and existing techniques against a real problem, then validating what holds up and taking it into production.",
      // Newest first, matching workProjects' own order.
      projectSlugs: ["agentic-qad", "query-anomaly-detection"],
    },
    {
      company: "Saama",
      role: "Machine Learning Engineer, Internship",
      period: "Feb 2023 — Sep 2024",
      summary:
        "Worked on Smart Data Quality (SDQ): machine learning models that automatically identify discrepancies in clinical trial data.",
      projectSlugs: ["subcat-classifier-model"],
    },
  ],
  education: [
    {
      institution: "Kumaraguru College of Technology",
      qualification: "B.Tech, Information Technology",
      period: "2021 — 2024",
      detail: "CGPA 8.7",
    },
  ],
};

/**
 * REAL DATA — sanitized: technique and problem class only. No client names,
 * no business or commercial impact figures. Product names ARE kept (Nandha's
 * call); model performance numbers are kept too, since those measure the work
 * rather than the employer's revenue.
 *
 * These three entries are one product's evolution, not three unrelated jobs.
 * Each was made possible by a shift in what the technology could do, and each
 * one's limitation is the next one's starting problem — so every `outcome`
 * ends by naming the constraint that led onward. Read bottom-up for the
 * chronology.
 *
 * Array order IS display order (getWorkProjects doesn't sort). Newest first.
 */
export const workProjects: WorkProject[] = [
  {
    slug: "agentic-qad",
    title: "Agentic QAD",
    associatedWith: "Saama",
    // Ongoing — the only open-ended entry of the three; the others closed
    // when the next generation started.
    period: "2026 — Present",
    summary:
      "A multi-agent pipeline turns an SME's plain-language clinical data quality check description into a verified validation script. This reduced the time to add a new scenario from days to a few hours.",
    problem:
      "QAD's production harness worked because every scenario ran as deterministic code, but that reliability came at a cost: each new scenario needed a developer, a requirements discussion with the SME who owns the business logic, and then a few days of iterating on the script until it behaved correctly. SMEs describe scenarios in loose clinical language and can't write the code themselves. Agentic QAD, a multi-agent system that turns an SME's plain-language description into a verified Python validation script.",
    approach:
      "Built a multi-agent system, it starts by Data Profiling Module which understands the context, parses study protocols for candidate checks and profile the study data. With these contents, Standardization Agent hold clarification rounds with the Data Managers via chat mode for data quality check scenario generation, using memory so no question is asked twice, until the scenario becomes a structured, code-ready specification. Before any code is written, a data contract and constrained pseudocode pin down exactly which columns exist, so agents can't invent them. The Code Generation Agent reuses helper functions from a closed set of known auxiliary cases, including one that calls an LLM for clinical judgment.\n\nVerification is where the design matters most. A Testing Agent writes 10 strategic tests without ever seeing the code, everything runs in a sandbox after security checks, and a specialist 'Swarm Agent' repairs the script in case of failures. Scripts that fail more than 20% of tests are killed, not patched endlessly, and the time to add one scenario has dropped from days to a few hours. Simple and medium scenarios pass on the first attempt; complex ones still struggle, which is pushing us toward iterative code generation with Data Managers.\n\nWhat i learnt: Code generation was quarter of the effort; Standardization: turning vague clinical text into a precise spec was major part of the effort. Every decision an agent has to guess becomes a bug, so the real work is closing those gaps before the first line of code is written.",
    outcome:
      "When an LLM writes code instead of making decisions, its output becomes something you can test before it touches data. But agents can only verify code against a spec. Only a human can confirm the spec is right.",
    tech: [
      "LangGraph",
      "LLM routing",
      "Vector DB",
      "pytest",
    ],
    highlight: "Time to add one scenario: days to a few hours",
  },
  {
    slug: "query-anomaly-detection",
    title: "Query Anomaly Detection - QAD",
    associatedWith: "Saama",
    period: "2024 — 2025",
    summary:
      "An LLM system that detects anomalies across a patient's full trial history, explains each flag with clinical reasoning, and drafts the query sent to sites. Over five versions, it went from fine-tuned open models to a hybrid harness that reached 97.5% accuracy, 96% precision and 95% recall in production.",
    problem:
      "The Subcat Classifier Model caught structural and simple clinical errors, but couldn't reason through complex clinical logic on real data, it reached only about 50% precision.",
    approach:
      "Generated training, validation data at scale with LLMs and refined by SMEs to mimic production data.\n\nv1.0 · Llama 3 8B + LoRA: Passed each subject's chunked data as structured JSON so the model could see cross-domain anomalies. Date and value comparisons stayed unreliable on large inputs, even after more fine-tuning since it is 8B model.\n\nv2.0 · DeepSeek-R1-Distill-Llama-70B + QLoRA: Scaled to a larger reasoning model for stronger clinical reasoning. Serving 70B at full precision needed far more GPU than the deployment could justify, so inference ran quantized in FP8. Fine-tuning and serving therefore happened at different numeric precisions, and accuracy collapsed in the served model.\n\nv3.0 · Added chain-of-thought data: Trained the model to reason before each verdict. Accuracy improved, but the quantization drop remained.\n\nv4.0 · Quantization-aware training + concise reasoning: Fixed the quantization drop, cut reasoning tokens by about 40%, and went to production. Math errors returned on large contexts, with high latency and cost on a single self-hosted GPU.\n\nv5.0 · LLM harness: Python runs every deterministic check first, and an enterprise frontier model handles only clinical reasoning. Data managers approve, hold or reject each drafted query.\n\nWhat i learnt: Fine-tuning, chain-of-thought and quantization work made the model better, not reliable at exact logic over large clinical contexts, the fix was architectural: compute everything computable in code, and leave the LLM only the judgment calls.",
    outcome:
      "The final hybrid system reached 97.5% accuracy, 96% precision and 95% recall in production. The best way to use a probabilistic model in production is to make the system around it as deterministic as possible.",
    tech: [
      "Open source LLMs",
      "LLM fine tuning",
      "vLLM",
      "LLM quantisation",
      "GPUs",
    ],
    highlight: "97.5% accuracy, 96% precision, 95% recall — in production",
    featured: true,
  },
  {
    slug: "subcat-classifier-model",
    title: "Subcat Classifier Model",
    associatedWith: "Saama",
    period: "2023 — 2024",
    summary:
      "An ML engine to flag discrepancies in clinical trial EDC systems, trained entirely on synthetic data: 93% precision and 97% recall in validation, then about 50% precision once it met real data. The failure analysis is what shaped the LLM-based successor that followed.",
    problem:
      "Clinical data managers reviewed trial data by hand to catch discrepancies across domains such as Adverse Events, Concomitant Medications and Labs etc. Built-in EDC edit checks handled simple rules well enough, but not the complex, cross-domain logic a real discrepancy usually involves.",
    approach:
      "Built a synthetic data generator around 65 SME-defined discrepancy patterns since no labeled patient data was available due to PHI restrictions. Data generator was seeded with real value lists, producing 65,000 labeled samples that SMEs then reviewed. Each clinical domain got its own classifier, returning the specific pattern it found violated. I compared an MLP against XGBoost; XGBoost won on accuracy, stability across seeds, and explainability. Thresholds were tuned to favor recall, since a missed discrepancy costs far more than a false flag.\n\nWhat i learnt: Strong offline metrics on synthetic data don't guarantee production performance.",
    outcome:
      "Validated at 93% precision and 97% recall on held-out synthetic data, but it failed at the proof-of-concept stage on real data: free text, abbreviations, partial dates and error types the generator had never produced dropped precision to about 50%.",
    tech: ["XGBoost", "MLP", "Synthetic Data Generation"],
    highlight: "93% precision in testing; ~50% once it met real data",
    featured: true,
  },
];

/**
 * REAL DATA — placeholders removed.
 *
 * Array order IS display order: `getPersonalProjects()` doesn't sort, because
 * `period` is a free-form string ("2023", "2024 – 2025") rather than an ISO
 * date. Keep newest first by hand.
 */
export const personalProjects: PersonalProject[] = [
  {
    slug: "dspy-prompt-optimisation",
    title: "Programmatic Prompt Optimisation with DSPy",
    period: "2024",
    summary:
      "Compiling prompts automatically with DSPy instead of hand-tuning them. A 3B model, optimised, outscored an un-optimised 8B model on the same task.",
    problem:
      "A small local model does badly on specialist domains zero-shot, and the usual fix is hand-tuning the prompt: reword the instruction, add an example, try again. Prompting is fluid enough that there are always more avenues to refine, which makes it slow, unrepeatable, and impossible to attribute. Without a measured baseline there's no way to know whether a reworded instruction helped or not.",
    approach:
      "Used DSPy to treat prompting as a compilation problem: declared a class-based input/output signature instead of a prompt string, wrapped it in a ChainOfThought module so the model reasons before answering, and scored everything with an exact-match metric. Served the models locally with vLLM on a single GPU through an OpenAI-compatible endpoint, which made running a local model fast enough to iterate on without an API subscription.\n\nMeasured a zero-shot baseline first, so any gain was attributable, then compiled with BootstrapFewShotWithRandomSearch, it runs the model over the training set, keeps the traces where it answered correctly, and random-searches combinations of those as few-shot demonstrations, scoring each candidate against the metric. Ran the identical pipeline over Llama-3.2-3B-Instruct and Llama-3.1-8B-Instruct to separate the effect of optimisation from the effect of model size.",
    outcome:
      "Optimisation lifted the 3B model from 41.7% to 58.57% and the 8B model from 55% to 70%. The number that matters is across the two: the optimised 3B scored 58.57% against the un-optimised 8B's 55%, so compiling the prompt was worth more than the extra 5B parameters.",
    tech: [
      "Python",
      "DSPy",
      "vLLM",
      "Llama 3.2 3B",
      "Llama 3.1 8B",
      "pandas",
      "scikit-learn",
    ],
    repoUrl: "https://github.com/Nandha-kumar-S/Dspy-LM",
    featured: true,
  },
  {
    slug: "automated-form-data-extractor",
    title: "Automated Form Data Extractor",
    period: "2022",
    summary:
      "Turning scanned, handwritten application forms into structured data, by routing each kind of field to the OCR engine that reads it most reliably.",
    problem:
      "Paper application forms get typed into a system by hand which is slow, repetitive, and a quiet source of transcription errors. The same gap applies to digitising archives: an organisation holding years of paper records can't search or report on any of it until each form becomes a database row. OCR alone doesn't solve it: handwriting is unreliable to read, since one misread value makes it useless.",
    approach:
      "Exploited the fact that the form template is fixed, so field positions are known in advance and no layout detection is needed. Rendered the PDF, normalised each page to a known size, cropped the eight fields by coordinate, then routed each to the engine that handled it best. Pytesseract for handwritten text, EasyOCR for the digit fields, and a pixel-difference check for the checkbox.",
    outcome:
      "Extracts a filled-in form into structured values and writes them straight to the database, so a scan becomes a queryable record. The field positions are a template rather than special-cased logic, so supporting a new form means adding its template once instead of changing the pipeline making it scalable.",
    tech: ["Python", "OpenCV", "pytesseract", "EasyOCR", "pdf2image"],
    repoUrl:
      "https://github.com/Nandha-kumar-S/Automated-form-data-extractor",
  },
  {
    slug: "audio-emotion-classification",
    title: "Audio Emotion Classification from Spectral Features",
    period: "2022",
    summary:
      "Classifying short audio clips by emotion using MFCC features and an SVM. A hands-on pass at turning raw waveforms into something a classifier can use.",
    problem:
      "A raw waveform is just amplitude over time, two clips carrying the same emotion can have completely different sample values. The work is reducing each clip to a fixed-length vector that preserves both its frequency and time characteristics.",
    approach:
      "Extracted MFCCs per clip with librosa and mean-pooled them across time frames, making clips of different lengths directly comparable. Label-encoded the classes and trained a linear-kernel SVM on an 80/20 split. Also explored spectral centroid and zero-crossing rate as alternative features.",
    outcome:
      "The result is a working end-to-end pipeline from waveform to predicted class. It demonstrates the method rather than validating it, a first hands-on pass at audio feature engineering.",
    tech: ["Python", "librosa", "scikit-learn", "pandas", "NumPy"],
    repoUrl:
      "https://github.com/Nandha-kumar-S/Human-emotion-detection-using-audio",
  },
];

/** REAL DATA — placeholders removed. */
export const openSourceContributions: OpenSourceContribution[] = [
  {
    slug: "mesa-examples-color-patches",
    project: "mesa/mesa-examples",
    title: "Fix color_patches SolaraViz portrayal + update README",
    description:
      "Restored a Mesa example that had silently broken under 3.x — supported SolaraViz portrayal keys plus corrected run instructions — merged after review by two maintainers.",
    // The CV's one-line form; the full description is for the site.
    highlight: "Merged fix restoring an example broken under Mesa 3.x",
    prUrl: "https://github.com/mesa/mesa-examples/pull/346",
    mergedOn: "2026-03-16",
    featured: true,
  },
  {
    slug: "mesa-contributor-infrastructure",
    project: "mesa/mesa-examples",
    title: "Contributor infrastructure prototype",
    description:
      "Prototyped contributor infrastructure for Mesa's community model gallery — per-model isolated CI, a PR greeter bot, a metadata-driven gallery generator and CODEOWNERS review routing — while preparing a GSoC 2026 proposal.",
    highlight:
      "Prototyped contributor infrastructure — isolated CI, gallery generator, CODEOWNERS — for a GSoC 2026 proposal",
    repoUrl: "https://github.com/Nandha-kumar-S/GSoC-learning-space",
    // No merge to date from — this is the "built it, it lives in its own
    // repo" shape, so `date` rather than `mergedOn`.
    date: "2026-02-01",
  },
];

export const packages: Package[] = [
  {
    slug: "clinparser",
    name: "ClinParser",
    registry: "PyPI",
    description:
      "Parses a clinical protocol PDF into a JSON tree mirroring the document's own section hierarchy, with each section's text, tables and images attached. It anchors on the section numbering authors maintain for regulatory reasons rather than inferring heading levels from layout, so the structure is read rather than guessed. No LLM anywhere in the pipeline, so it runs fully offline on documents carrying PHI or sponsor IP.",
    url: "https://pypi.org/project/clinparser/",
    repoUrl: "https://github.com/Nandha-kumar-S/clinparser",
    publishedOn: "2026-08-10",
    featured: true,
    highlight: "Structure-aware protocol parsing, fully offline",
  },
];

/**
 * REAL DATA — placeholders removed.
 *
 * Order here is newest first for readability only; `getBlogPosts()` sorts by
 * `publishedOn`, so a back-dated post added at the end still lands correctly.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "agentic-models-without-ai",
    title: "Beyond the Hype: Building Agentic Models Without AI",
    publishedOn: "2026-06-11",
    summary:
      "Agent-based modelling gets genuinely complex behaviour out of agents following hard-coded rules — no neural network anywhere. Builds a highway traffic simulation in Mesa where a binary move-or-wait decision per car is enough to produce phantom jams and gridlock on its own, and looks at where that still beats a learned model.",
    url: "https://medium.com/@suriyank532002/beyond-the-hype-building-agentic-models-without-ai-32f94aeb7152",
  },
  {
    slug: "protocol-digitalization",
    title:
      "The End of Unstructured Protocol PDFs: AI-Driven Protocol Digitalization",
    publishedOn: "2025-11-25",
    summary:
      "A clinical trial protocol is a hundred pages of prose that every downstream system has to re-read by hand. Walks through a pipeline that turns one into CDISC USDM v4 — layout-aware parsing, LLM section mapping against curated dictionaries, then schema graph linking — with an expert review gate in the middle. Extraction drops from about 40 hours to 2.",
    url: "https://medium.com/ai-in-plain-english/the-end-of-unstructured-protocol-pdfs-ai-driven-protocol-digitalization-0daa7ea5134b",
    publication: "AI in Plain English",
    featured: true,
  },
  {
    slug: "small-models-outperform-with-dspy",
    title: "How a 3B Language Model Surpasses an 8B Counterpart with DSPy?",
    publishedOn: "2024-12-29",
    summary:
      "A 3B model beating an 8B one isn't a story about model size, it's a story about prompting. Programs Llama-3.2-3B with DSPy signatures, chain-of-thought and automatic few-shot selection to reach 58.57% on astronautics Q&A — against 55% for an unoptimised 8B, at a fraction of the compute.",
    url: "https://medium.com/@suriyank532002/how-to-make-small-language-models-outperform-large-language-models-using-dspy-306576d53f2e",
    featured: true,
  },
  {
    slug: "synthetic-datasets-for-clinical-llms",
    title:
      "AI in Life Sciences: Enhancing Data Quality Through Synthetic Dataset Generation Using LLMs",
    publishedOn: "2024-11-28",
    summary:
      "Clinical data can't leave the building, which is exactly what makes it hard to fine-tune a model on. Proposes MASDO, a four-agent pipeline that generates, manipulates, labels and validates tabular clinical records between them — so a team can train on realistic data without a real patient record ever being involved.",
    url: "https://medium.com/@suriyank532002/ai-in-life-sciences-enhancing-data-quality-through-synthetic-dataset-generation-using-llms-d819215a3249",
  },
];

/**
 * Empty on purpose — the paper isn't published yet and shouldn't appear in the
 * UI until it is. An empty array renders nothing: /building/publications falls
 * back to the packages alone, and the homepage's Featured Publication quadrant
 * picks the package instead. Nothing needs changing to switch it back on.
 *
 * When it's out, fill in the real values and uncomment:
 *
 * {
 *   slug: "",
 *   title: "",
 *   venue: "",            // journal or conference
 *   year: "",
 *   description: "",      // research question, method, headline finding
 *   url: "",              // DOI or publisher link
 *   status: "published",  // "published" | "under-review" | "in-progress"
 *   featured: true,
 * }
 */
export const publications: Publication[] = [];

/** REAL DATA — placeholders removed. A second talk is upcoming. */
export const talks: Talk[] = [
  {
    slug: "kumaraguru-ai-web-healthcare",
    title: "How AI Contribute to the Healthcare Domain",
    venue: "Kumaraguru Institutions",
    // Day-level precision isn't known and isn't shown — formatDate renders
    // month and year only, so this displays as "June 2025".
    date: "2025-06-01",
    summary:
      "I went back to my own college a year after graduating and presented on how AI actually gets used in production inside healthcare and life-science software products — what ships and then has to be maintained, rather than what demos well.",
    audience: "Students at the Social Internship event",
    link: { label: "LinkedIn post", url: "https://lnkd.in/p/gBCseWzf" },
    // The one-line form. `summary` is first-person and too long for a CV row.
    highlight:
      "How AI is used in production in healthcare and life-science software",
  },
];

export const hackathonWins: HackathonWin[] = [
  {
    slug: "cdisc-ai-innovation-challenge-2026",
    event: "CDISC AI Innovation Challenge 2026",
    // Challenge entries compete per problem statement rather than in one
    // overall ranking, so the placement is scoped to the statement entered.
    placement: "1st place",
    date: "2026-08-01",
    summary:
      "A team-of-four entry at CDISC's open challenge, built for Saama Technologies: a platform that carries a clinical trial protocol PDF through to a Statistical Analysis Plan and the R and SAS code that executes it, with statistician sign-off at every stage.",
    problem:
      "A Statistical Analysis Plan is written by hand from the protocol, and the analysis code is then written by hand from the SAP. Each hop is a fresh human interpretation, so statistical intent drifts from study design and the code drifts from both, with nothing in the chain a machine can check. The standards that would prevent it exist (CDISC USDM for the study, SADM for the analysis), but as long as the artifacts in between are prose, nothing connects them.",
    approach:
      "Built the chain as a sequence of governed models instead of documents: protocol to USDM v4.0 to SADM v6.0 to SAP to R/SAS scripts, with SADM as the custom computable blueprint tying protocol requirements to planned analyses to generated code. The extraction pipeline routes each SAP section to the SADM classes it populates and keeps every model call scoped to that section — roughly 25–35 bounded calls per protocol rather than full-document passes — then resolves cross-references deterministically against an ID table and validates cardinality straight from the schema. A React workspace gates each stage behind review, so a statistician approves or corrects the output before it feeds the next one.",
    outcome:
      "Won 1st place. The bet behind the design was that traceability has to be structural rather than documented after the fact: because every artifact is generated from SADM, the link from a protocol endpoint to the analysis that tests it survives into the generated code, instead of living in a spreadsheet someone maintains by hand.",
    repoUrl: "https://github.com/Nandha-kumar-S/SmartClinSAP",
    link: { label: "LinkedIn post", url: "https://lnkd.in/p/gbZa9j_8" },
    featured: true,
    highlight: "Protocol PDF to executable SAS and R, end to end",
  },
  {
    slug: "saama-ai-catalyst-2025",
    event: "Saama AI CATALYST 2025",
    placement: "Best Technical Implementation Award",
    // Day-level precision isn't known and isn't shown — formatDate renders
    // month and year only, so this displays as "April 2025".
    date: "2025-04-01",
    summary:
      "An internal hackathon build, four people over 36 hours: a pipeline that reads an unstructured clinical trial protocol PDF and emits it as CDISC USDM, the industry's machine-readable study definition standard.",
    problem:
      "A clinical trial protocol arrives as a hundred-page prose document, so every downstream system that needs it — study build, data collection, registry submission — re-keys the same facts by hand. CDISC USDM exists as the machine-readable standard for exactly this, but nothing turns a written protocol into one.",
    approach:
      "Built an LLM pipeline that parses the PDF into structure, maps each protocol section to the USDM schemas it populates, extracts content against those schemas, then connects the fragments into a single linked USDM graph. Put a React dashboard on top with human-in-the-loop review, so a domain expert approves or corrects each extracted field — the part that makes the output usable somewhere regulated rather than merely impressive in a demo.",
    outcome:
      "Won the Best Technical Implementation Award. The call that shaped the build was targeting CDISC USDM instead of inventing a bespoke schema: committing to a standard we didn't control made the output interoperable by construction, at the cost of having to satisfy a specification with thousands of defined attributes.",
    repoUrl: "https://github.com/Nandha-kumar-S/protocol-library",
    link: {
      label: "LinkedIn post",
      url: "https://www.linkedin.com/posts/nandhakumar-s-12a415212_technicalexcellence-teamwork-innovation-activity-7426226780111323136-ow02",
    },
    // Not featured: the homepage quadrant shows one hackathon, and the CDISC
    // entry above is the stronger claim — an external competition, placed
    // first. This stays a full entry on /building/hackathons.
    highlight: "Protocol PDF to CDISC USDM in one pipeline",
  },
];

/**
 * REAL DATA — `problem` and `solution` are Nandha's own words, transcribed
 * VERBATIM from reading_notes.docx. Do not rewrite them: these are his
 * reading of each paper, not a neutral abstract, and that is the point of
 * publishing them. Only the tag strings were normalised.
 *
 * Both fields together ARE the takeaway, which is why the detail page puts
 * one "My takeaway" heading over the pair rather than labelling a third
 * field. The type's `takeaway` is consequently unused.
 *
 * Deliberately NOT in date order — the data-access layer sorts these.
 * That proves ordering comes from `dateRead`, not from array position.
 */
export const readingNotes: ReadingNote[] = [
  {
    slug: "programbench",
    dateRead: "2026-05-15",
    paperTitle: "ProgramBench: Can Language Models Rebuild Programs From Scratch?",
    paperUrl: "https://arxiv.org/pdf/2605.03546",
    problem:
      "It's a benchmarking dataset for models to challenge not just its coding a single functionality of or a single module, instead it tests models on creating a whole project codebase on its own without HITL.",
    solution:
      "Now that the llms write code in any programming language it has been trained on, it can only write a single functionality or maybe a simple module without human interpretation. So this dataset extracts  around 200+ code based mostly written on a standalone compiling language - c, c++, rust. From these project repos a task, requirement is generated using LLM. The evaluation models are prompted with this task and requirement files and the llm must generate the whole code base with any programming language on its own , the one which is good at. Results are surprising only claude opus has 95% completion on 3% of 200+ tasks. The success rate is defined by “input-output behaviour”. This tells us the llms have not yet reached the level where it takes architectural decisions on its own to code a large scale project. But this is actually challenging as I saw a project with max size is 2 lakh lines of code and 5000  project files.",
    tags: ["benchmark", "dataset"],
  },
  {
    slug: "self-distillation-continual-learning",
    dateRead: "2026-06-18",
    paperTitle: "Self distillation leads to continual learning",
    paperUrl: "https://arxiv.org/pdf/2601.19897",
    problem:
      "Finetuning using native SFT on static dataset leads to knowledge forgetting on which a model previously excels at. This is due to changing models weights while fine-tuning with static demonstration of data.",
    solution:
      "Instead of using static data for training, they use a teacher-student role within the same model approach whereas the teacher role gets both question, answer, reasoning and student is prompted with only the question. While inference on the student role, the teacher role (which knows the outcome) will correct the probability of the next token to be predicted from the student role. Initially student roles are allowed to predict wrong answers in order to learn from its own mistakes. This method of fine tuning is called SDFT. This is evaluated on two metrics: 1) if model is trained on new skill is it capable of performing good at new skill while not forgetting the old skills\n\n2) If the model is trained on new knowledge, is it capable of performing good at knowledge retrieval of new knowledge tasks while also performing good at existing knowledge retrieval tasks.\n\nI have not looked at the technical implementation of SDFT yet.",
    tags: ["finetuning", "llms"],
  },
  {
    slug: "sciknoweval",
    dateRead: "2026-07-18",
    paperTitle: "SciKnowEval",
    paperUrl: "https://arxiv.org/pdf/2406.09098",
    problem:
      "Scientific benchmark dataset",
    solution:
      "This paper contains knowledge memory, comprehension, reasoning, safety, application - 5 categories which include knowledge application, but our paper only has application level QA, which is the most challenging. This paper has 4 domains with balanced QA distribution, whereas our paper has 9+ domains with imbalanced QA distribution. Here QA are curated using i) Direct QA scraping like we did but from other OS benchmark datasets ii) Literature from text books to QA generation using LLM iii) scientific DBs to QA generation using LLM. QA types mcqa, generation QAs, true/false QAs. not images. 20 models evaluated - open source, closed source, scientific domain-specific open sourced models. Insights from Evaluation metrics are very simple - just accuracy and f1 score, but ours has more insights.",
    tags: ["benchmark", "dataset"],
  },
  {
    slug: "sapai-protocol-to-analysis-plan",
    dateRead: "2026-09-06",
    paperTitle: "From Protocol to Analysis Plan: SAPAI",
    paperUrl: "https://www.medrxiv.org/node/1179577.external-links.html",
    problem:
      "Manual writing of Statistical Analysis Plan for clinical trial study",
    solution:
      "This paper introduces a LLM pipeline to successfully generate a SAP from protocol document with 78-81% of accuracy. They predominantly did a prompt engineering technique by generating each section from protocol. Important thing is their Validation and scoring framework to validate claude, gpt, gemini against their pilot SAPs. It involves 0-4 scoring technique whereas each rank’s requirement varies. For example ‘0’ indicates when a section is not extracted at all to ‘1’ indicates when a section is extracted with major inaccuracy and so on.",
    tags: ["clinical-trials", "sap"],
  },
  {
    slug: "agentic-context-management",
    dateRead: "2026-09-25",
    paperTitle: "Agentic Context Management",
    paperUrl: "https://arxiv.org/pdf/2607.21503",
    problem:
      "These days AI Agents fail in their performance less often because of reasoning, it’s scarce knowledge but more often because of its non-optimal context management system.",
    solution:
      "This paper introduces a Agent Context Management (ACM) lifecycle. They say ACM is no more ‘nice-to-have’ thing, it's a basic need for AI Agents to perform better with optimised context. Memory is not just a store which is used to do CRUDe operations, this lifecycle they proposed has 5 blocks: architecting → ingesting → scoping → anticipating → compacting & consolidation. Architecting: this involves defining the shape of memory, basically the datatype of each module’s module-specific memory to have, but currently the system uses shared data type for modules. Ingesting: this involves ingesting the context into memory in a structured way with information rich data, not just appending all the information. Scoping: this involves defining a boundary for each user level to avoid user A’s context being passed onto user B. anticipating: this defines (just like its literal meaning) to prepare context even before an explicit request arrives by another agent. Compacting & Consolidation: this defines compacting the whole context (to reduce token cost and improve retrieval accurate, faster) without removing/modifying the crucial information based on context. Also they made few evaluations on these blocks which we can see in the results section.",
    tags: ["AgentMemory", "LLMMemory", "ContextManagement"],
  },
  {
    slug: "jev-system-one-model",
    dateRead: "2026-10-14",
    paperTitle: "Evaluating and Benchmarking the System One Model JEV",
    paperUrl: "https://arxiv.org/pdf/2609.37647",
    problem:
      "Jev is a recently released ‘system one’ model, evaluating it on ‘informed decision’ tasks.",
    solution:
      "This paper introduces evaluation insights on 37 publicly benchmark datasets on QWEN 27B (OS), GEMMA 4B (OS), JEV (proprietary). Whereas JEV outperforms around 22 on QWEN and all 37 on GEMMA. Firstly, the Jev token generation mechanism is different from typical LLMs. The mechanism is bypassing generation entirely by reading the model's next-token logits directly in a single forward pass. Which is also implemented in base models for fair comparison. The mechanism is below,\n\nSingle-Token Option Codes: They assigned each option a code that maps to a single token in the model's vocabulary (e.g., A, B, Yes, No, or single digits for scores).\n\nPrompt Construction: They rendered the input state as JSON alongside the question and instructed the model to respond using only the option code.\n\nSingle Forward Pass: Token generation and thinking/reasoning steps were disabled. They ran a single forward pass to obtain the raw next-token probability distribution.\n\nLogit Filtering & Renormalization: They restricted the next-token distribution strictly to the tokens representing the valid option codes, then renormalized those values so they summed to 1.\n\nThis forces the model's confidence scores to be distributed entirely among the valid choices without generating any text.\n\nWhile JEV outperforms most of the models, JEV’s model param size has not been disclosed since it is a proprietary model. So I doubt if it is a valid comparison.",
    tags: ["jev", "benchmark", "SystemOneModel"],
  },
];
