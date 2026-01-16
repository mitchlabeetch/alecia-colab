import { SlideEditor } from '@/components/presentations/SlideEditor';
import type { Id } from '@/convex/_generated/dataModel';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PresentationEditorPage({ params }: PageProps) {
  return <SlideEditor presentationId={params.id as Id<"colab_presentations">} />;
}
