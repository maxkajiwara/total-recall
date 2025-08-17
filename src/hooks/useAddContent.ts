"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface UseAddContentProps {
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  content: string;
  isUrl: boolean;
}

export function useAddContent({ onSuccess }: UseAddContentProps = {}) {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    content: "",
    isUrl: false,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    content?: string;
    general?: string;
  }>({});

  const createContextMutation = api.context.create.useMutation({
    onSuccess: () => {
      setFormState({ name: "", content: "", isUrl: false });
      setErrors({});
      onSuccess?.();
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  // Auto-detect if content is URL
  const detectContentType = (content: string) => {
    const urlPattern = /^https?:\/\//i;
    return urlPattern.test(content.trim());
  };

  // Generate name suggestion from URL or text
  const generateNameSuggestion = (content: string, isUrl: boolean) => {
    if (isUrl) {
      try {
        const url = new URL(content);
        const hostname = url.hostname.replace('www.', '');
        const pathname = url.pathname.replace(/\/$/, '');
        const lastSegment = pathname.split('/').pop();
        
        if (lastSegment && lastSegment !== '') {
          return `${hostname} - ${lastSegment}`;
        }
        return hostname;
      } catch {
        return "Website Content";
      }
    } else {
      // For text, use first 30 characters
      const words = content.trim().split(/\s+/);
      const firstWords = words.slice(0, 5).join(' ');
      return firstWords.length > 30 
        ? firstWords.substring(0, 30) + '...'
        : firstWords;
    }
  };

  const updateContent = (content: string) => {
    const isUrl = detectContentType(content);
    const suggestedName = content.trim() 
      ? generateNameSuggestion(content, isUrl)
      : "";

    setFormState(prev => ({
      ...prev,
      content,
      isUrl,
      name: prev.name === "" ? suggestedName : prev.name,
    }));

    // Clear content errors when typing
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const updateName = (name: string) => {
    setFormState(prev => ({ ...prev, name }));
    
    // Clear name errors when typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Name is optional - if empty, we'll use auto-generated name
    if (formState.name.length > 256) {
      newErrors.name = "Name is too long (max 256 characters)";
    }

    if (!formState.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formState.isUrl) {
      try {
        new URL(formState.content);
      } catch {
        newErrors.content = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = () => {
    if (!validateForm()) {
      return;
    }

    // Use provided name or auto-generated suggestion
    const finalName = formState.name.trim() || generateNameSuggestion(formState.content, formState.isUrl);

    const input = {
      name: finalName,
      ...(formState.isUrl 
        ? { url: formState.content.trim() }
        : { text: formState.content.trim() }
      ),
    };

    createContextMutation.mutate(input);
  };

  const reset = () => {
    setFormState({ name: "", content: "", isUrl: false });
    setErrors({});
  };

  return {
    formState,
    errors,
    isLoading: createContextMutation.isPending,
    isSuccess: createContextMutation.isSuccess,
    updateContent,
    updateName,
    submitForm,
    reset,
  };
}