import { BaseTask } from "src/types/base-task";
import { RawTask } from "src/types/task";

export interface ParsedTaskEntry {
  rawTask: RawTask;
  task: BaseTask;
}

function sourcePositionKey(path: string, line: number): string {
  return `${path}\0${line}`;
}

/**
 * Treat a task nested directly under another task as blocked by that parent.
 * The dependency is graph-only; no metadata is written back to the note.
 */
export function addImplicitNestingDependencies(
  entries: ParsedTaskEntry[]
): void {
  const tasksBySourcePosition = new Map<string, BaseTask>();

  for (const { rawTask, task } of entries) {
    if (typeof rawTask.line !== "number") continue;

    tasksBySourcePosition.set(
      sourcePositionKey(rawTask.link.path, rawTask.line),
      task
    );
  }

  for (const { rawTask, task } of entries) {
    if (typeof rawTask.parent !== "number") continue;

    const parentTask = tasksBySourcePosition.get(
      sourcePositionKey(rawTask.link.path, rawTask.parent)
    );
    if (!parentTask || parentTask.id === task.id) continue;

    task.incomingLinks = [...new Set([...task.incomingLinks, parentTask.id])];
  }
}
