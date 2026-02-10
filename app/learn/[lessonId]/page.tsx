import { notFound } from "next/navigation";
import { getLessonById, getScenariosForLesson } from "@/lib/content";
import { LessonFlow } from "@/components/LessonFlow";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const scenarios = await getScenariosForLesson(lesson);

  return <LessonFlow lesson={lesson} scenarios={scenarios} />;
}
