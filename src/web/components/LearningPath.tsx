import { useEffect } from 'react';
import { Icon } from './icons';
import type { ProgressLessonItem } from '../api';

/**
 * مسار تعلّم بصري على شكل عقد مترابطة.
 * الحالات كلها مشتقّة من بيانات الخادم: completed / current / locked / available.
 * لا يوجد فتح محلي للدروس المقفلة — القرار للخادم.
 */
export function LearningPath({
  lessons,
  nextSlug,
  onOpen,
}: {
  lessons: ProgressLessonItem[];
  nextSlug?: string | null;
  onOpen: (slug: string) => void;
}) {
  useEffect(() => {
    if (nextSlug) {
      const activeEl = document.querySelector('.path-node.current');
      if (typeof activeEl?.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [nextSlug]);

  if (lessons.length === 0) {
    return (
      <p className="muted small" style={{ padding: 'var(--s-3) 0' }}>
        لا توجد دروس في هذا القسم حاليًا.
      </p>
    );
  }

  const visible = lessons;

  return (
    <div className="path-scroll">
      <div className="path-track" role="list" aria-label="عقد مسار التعلم">
        {visible.map((lesson, i) => {
          const done = lesson.progress_status === 'completed';
          const locked = lesson.is_unlocked === false;
          const current = !done && !locked && lesson.slug === nextSlug;
          const cls = ['path-node', done ? 'done' : '', current ? 'current' : '', locked ? 'locked' : ''].filter(Boolean).join(' ');
          const lockReason = locked
            ? `مقفل — يتطلب أولًا: ${(lesson.missing_prerequisites ?? []).join('، ') || 'إتمام الدرس السابق'}`
            : lesson.title_ar;
          return (
            <button
              key={lesson.slug}
              type="button"
              role="listitem"
              className={cls}
              disabled={locked}
              title={lockReason}
              aria-label={`الدرس ${i + 1}: ${lockReason}`}
              aria-current={current ? 'true' : undefined}
              onClick={() => !locked && onOpen(lesson.slug)}
            >
              <span className="node-circle">
                {done ? (
                  <Icon name="check" size={24} />
                ) : locked ? (
                  <Icon name="lock" size={21} />
                ) : current ? (
                  <Icon name="play" size={22} />
                ) : (
                  <span className="num">{i + 1}</span>
                )}
              </span>
              <span className="node-label">
                {`الدرس ${i + 1}`}
                <span className="node-sub" style={{ display: 'block' }}>{lesson.level_code ?? ''}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
