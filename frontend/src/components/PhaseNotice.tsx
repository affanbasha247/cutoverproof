interface PhaseNoticeProps {
  phase: string;
  title: string;
  description: string;
  points: string[];
  tone?: "info" | "verify" | "warning";
}

const TONE_CLASSES = {
  info: "tag--info",
  verify: "tag--verify",
  warning: "tag--warning",
} as const;

export default function PhaseNotice({
  phase,
  title,
  description,
  points,
  tone = "info",
}: PhaseNoticeProps) {
  return (
    <aside className="phase-note" data-tone={tone}>
      <h2>{title}</h2>
      <p className="mt-2">
        <span className={`tag ${TONE_CLASSES[tone]}`}>{phase}</span>
      </p>
      <p>{description}</p>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </aside>
  );
}
