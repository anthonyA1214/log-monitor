import { addSlotSchema, type AddSlot } from "@/lib/schemas/dashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface SlotEditorProps {
  currentTitle?: string;
  availableTitles?: string[];
  onSave: () => void;
  onCancel: () => void;
}

export default function SlotEditor({
  currentTitle,
  availableTitles,
  onSave,
  onCancel,
}: SlotEditorProps) {
  const {

  } = useForm<AddSlot>({
    resolver: zodResolver(addSlotSchema(availableTitles || [])),
  })

  return (
    <>
      <>
      </>
    </>
  )
}
