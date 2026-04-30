import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button';
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/Card';
import { Textarea } from '@/shared/ui/Textarea';
import { specInputSchema, type SpecInputValues } from '../model/schema';

interface SpecInputPanelProps {
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
  onLoadExample: () => void;
  isExampleLoading: boolean;
  exampleText?: string;
  templateError?: string | null;
}

const MAX_CHARS = 50_000;

export const SpecInputPanel = ({
  onSubmit,
  isSubmitting,
  onLoadExample,
  isExampleLoading,
  exampleText,
  templateError,
}: SpecInputPanelProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SpecInputValues>({
    resolver: zodResolver(specInputSchema),
    defaultValues: { text: '' },
    mode: 'onSubmit',
  });

  const currentText = useWatch({ control, name: 'text' }) ?? '';
  const charCount = currentText.length;

  useEffect(() => {
    if (exampleText) {
      setValue('text', exampleText, { shouldDirty: true, shouldValidate: false });
    }
  }, [exampleText, setValue]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Ваше ТЗ</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Вставьте текст технического задания для AI-экспертизы
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={onLoadExample}
            isLoading={isExampleLoading}
            disabled={isSubmitting}
          >
            Загрузить пример
          </Button>
        </div>
      </CardHeader>

      <form
        className="flex flex-1 flex-col"
        onSubmit={handleSubmit((values) => onSubmit(values.text))}
        noValidate
      >
        <CardBody className="flex flex-1 flex-col gap-3">
          <Textarea
            {...register('text')}
            placeholder="Опишите цели, контекст, функциональные и нефункциональные требования, сценарии, критерии приёмки..."
            rows={18}
            maxLength={MAX_CHARS}
            hasError={Boolean(errors.text)}
            disabled={isSubmitting}
            className="min-h-[320px] flex-1 font-mono text-[13px]"
          />
          <div className="flex items-center justify-between text-xs">
            <span
              className={
                errors.text
                  ? 'text-rose-600'
                  : charCount > MAX_CHARS * 0.9
                    ? 'text-amber-600'
                    : 'text-slate-500'
              }
            >
              {errors.text?.message ?? `${charCount.toLocaleString('ru-RU')} / ${MAX_CHARS.toLocaleString('ru-RU')} символов`}
            </span>
            {templateError && <span className="text-rose-600">{templateError}</span>}
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between gap-3 bg-slate-50/60">
          <Button
            variant="ghost"
            onClick={() => reset({ text: '' })}
            disabled={isSubmitting || charCount === 0}
          >
            Очистить
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Анализируем…' : 'Проверить ТЗ'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
