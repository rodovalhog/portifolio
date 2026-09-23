import { ApplicationStatus, JobApplicationRecord } from "@portfolio/domain";

const STORAGE_KEY = "portfolio_job_applications_v1";

const INITIAL_SEED: JobApplicationRecord[] = [
  {
    id: "app-seed-xfarm-01",
    company: "xFarm Technologies SA",
    role: "Brazil Senior Front End Developer",
    jobUrl: "https://xfarm.factorialhr.com/apply/brazil-senior-front-end-developer-309222?utm_source=linkedin.com",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    resumeUsed: "Guilherme_Rodovalho_CV_en.pdf",
    status: "submitted",
    atsType: "factorial",
    coverLetterSnippet: "Dear xFarm Hiring Team, I am writing to express my strong interest in the Senior Front End Developer role...",
    notes: "Candidatura enviada com sucesso após revisão humana de respostas.",
  },
];

type HistoryListener = (records: JobApplicationRecord[]) => void;

class JobApplicationHistoryStore {
  private listeners: Set<HistoryListener> = new Set();
  private memoryRecords: JobApplicationRecord[] = [...INITIAL_SEED];

  public getApplications(): JobApplicationRecord[] {
    if (typeof window === "undefined") {
      return [...this.memoryRecords];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED));
        return [...this.memoryRecords];
      }
      const parsed = JSON.parse(raw);
      this.memoryRecords = parsed;
      return parsed;
    } catch {
      return [...this.memoryRecords];
    }
  }

  public getApplicationById(id: string): JobApplicationRecord | undefined {
    return this.getApplications().find((r) => r.id === id);
  }

  public saveApplication(record: JobApplicationRecord): void {
    const records = this.getApplications();
    const existingIndex = records.findIndex((r) => r.id === record.id);

    let updated: JobApplicationRecord[];
    if (existingIndex >= 0) {
      updated = [...records];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...records];
    }

    this.persist(updated);
  }

  public updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string
  ): void {
    const records = this.getApplications();
    const updated = records.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(notes ? { notes } : {}),
        };
      }
      return r;
    });

    this.persist(updated);
  }

  public deleteApplication(id: string): void {
    const records = this.getApplications();
    const updated = records.filter((r) => r.id !== id);
    this.persist(updated);
  }

  public subscribe(listener: HistoryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private persist(records: JobApplicationRecord[]): void {
    this.memoryRecords = records;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch (err) {
        console.error("Failed to persist job applications to localStorage", err);
      }
    }
    this.notify(records);
  }

  private notify(records: JobApplicationRecord[]): void {
    this.listeners.forEach((l) => l(records));
  }
}

export const applicationHistoryStore = new JobApplicationHistoryStore();
