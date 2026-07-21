export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  /** 생성 시각(ms). 생성일순 정렬의 키로 사용 */
  createdAt: number;
  /** "YYYY-MM-DD" 형식. 지정하지 않으면 마감일 없음 */
  dueDate?: string;
  category: Category;
}

export const DEFAULT_PRIORITY: Priority = "medium";

export interface PriorityMeta {
  value: Priority;
  label: string;
  /** 목록 뱃지에 적용할 Tailwind 색상 클래스 */
  badgeClass: string;
}

// 우선순위 목록(높음 → 낮음 순). 선택 UI와 뱃지가 공유한다.
export const PRIORITIES: PriorityMeta[] = [
  {
    value: "high",
    label: "높음",
    badgeClass: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  {
    value: "medium",
    label: "보통",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-500",
  },
  {
    value: "low",
    label: "낮음",
    badgeClass: "border-border bg-muted text-muted-foreground",
  },
];

export const PRIORITY_META: Record<Priority, PriorityMeta> = Object.fromEntries(
  PRIORITIES.map((meta) => [meta.value, meta])
) as Record<Priority, PriorityMeta>;

// 목록 표시 필터. URL/localStorage에 저장하지 않는 화면 표시용 상태.
export type TodoFilter = "all" | "active" | "completed";

export const TODO_FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "completed", label: "완료" },
];

// 목록 정렬 기준. 화면 표시용 상태로, 원본 데이터는 바꾸지 않는다.
export type SortBy = "created" | "name" | "dueDate";

export const DEFAULT_SORT: SortBy = "created";

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "created", label: "생성일순" },
  { value: "name", label: "이름순" },
  { value: "dueDate", label: "마감일순" },
];

export type Category = "work" | "personal" | "shopping";

export const DEFAULT_CATEGORY: Category = "work";

export interface CategoryMeta {
  value: Category;
  label: string;
  /** 목록 뱃지에 적용할 Tailwind 색상 클래스 */
  badgeClass: string;
}

// 카테고리 목록. 선택 UI와 뱃지가 공유한다.
export const CATEGORIES: CategoryMeta[] = [
  {
    value: "work",
    label: "업무",
    badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-500",
  },
  {
    value: "personal",
    label: "개인",
    badgeClass:
      "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-500",
  },
  {
    value: "shopping",
    label: "쇼핑",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  },
];

export const CATEGORY_META: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((meta) => [meta.value, meta])
) as Record<Category, CategoryMeta>;
