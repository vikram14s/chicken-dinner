import { getLectureConcepts } from "@/lib/content";

export default async function LibraryPage() {
  const concepts = await getLectureConcepts();

  const grouped = concepts.reduce<Record<string, typeof concepts>>((acc, concept) => {
    if (!acc[concept.lectureId]) {
      acc[concept.lectureId] = [];
    }
    acc[concept.lectureId].push(concept);
    return acc;
  }, {});

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {Object.entries(grouped).map(([lectureId, lectureConcepts]) => (
        <section className="panel" key={lectureId}>
          <p className="kv">{lectureId}</p>
          <div style={{ display: "grid", gap: "0.8rem" }}>
            {lectureConcepts.map((concept) => (
              <article className="panel panel-strong" key={concept.id}>
                <h3 style={{ margin: "0 0 0.4rem 0" }}>{concept.title}</h3>
                <p className="subtle">{concept.summary}</p>
                <div className="split">
                  {concept.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="subtle code">{concept.sourceRefs.join(" | ")}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
