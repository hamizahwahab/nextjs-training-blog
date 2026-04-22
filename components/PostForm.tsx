"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostFormData } from "@/lib/schemas";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RichTextEditor from "@/components/RichTextEditor";

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
  const [content, setContent] = useState(defaultValues?.content || "");
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      ...defaultValues,
      content: defaultValues?.content || "",
    },
  });

  // Update form value when content changes
  useEffect(() => {
    setValue("content", content);
  }, [content, setValue]);

  const onFormSubmit = async (data: PostFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        placeholder="Post Title"
        error={errors.title?.message}
      />

      <div>
        <RichTextEditor
          content={content || defaultValues?.content || ""}
          onChange={setContent}
          placeholder="Write your amazing content here..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {errors.content.message}
          </p>
        )}
      </div>

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
