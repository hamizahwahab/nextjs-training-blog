"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormData } from "@/lib/schemas";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  buttonText: string;
  isSubmitting?: boolean;
}

export default function PostForm({
  defaultValues,
  onSubmit,
  buttonText,
  isSubmitting = false,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        placeholder="Post Title"
        error={errors.title?.message}
      />

      <Textarea
        {...register("content")}
        placeholder="Write your content here..."
        rows={6}
        error={errors.content?.message}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
      >
        {buttonText}
      </Button>
    </form>
  );
}
