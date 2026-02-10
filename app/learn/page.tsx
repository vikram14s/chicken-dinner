import { getCurriculum } from "@/lib/content";
import { CurriculumMapClient } from "@/components/CurriculumMapClient";

export default async function LearnPage() {
  const curriculum = await getCurriculum();

  return <CurriculumMapClient curriculum={curriculum} />;
}
