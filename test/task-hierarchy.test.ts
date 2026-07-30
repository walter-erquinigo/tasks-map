import { App } from "obsidian";
import { TaskFactory } from "../src/lib/task-factory";
import {
  addImplicitNestingDependencies,
  ParsedTaskEntry,
} from "../src/lib/task-hierarchy";
import { getAllDataviewTasks } from "../src/lib/utils";
import { RawTask } from "../src/types/task";

function makeEntry(
  text: string,
  line: number,
  parent?: number,
  path = "tasks.md"
): ParsedTaskEntry {
  const rawTask: RawTask = {
    status: " ",
    text,
    link: { path },
    line,
    parent,
  };

  return {
    rawTask,
    task: new TaskFactory().parse(rawTask),
  };
}

describe("addImplicitNestingDependencies", () => {
  it("makes a nested task depend on its direct parent task", () => {
    const parent = makeEntry("Parent 🆔 parent", 4);
    const child = makeEntry("Child 🆔 child", 5, 4);

    addImplicitNestingDependencies([parent, child]);

    expect(child.task.incomingLinks).toEqual(["parent"]);
  });

  it("uses the nearest parent for multiple nesting levels", () => {
    const parent = makeEntry("Parent 🆔 parent", 4);
    const child = makeEntry("Child 🆔 child", 5, 4);
    const grandchild = makeEntry("Grandchild 🆔 grandchild", 6, 5);

    addImplicitNestingDependencies([parent, child, grandchild]);

    expect(child.task.incomingLinks).toEqual(["parent"]);
    expect(grandchild.task.incomingLinks).toEqual(["child"]);
  });

  it("preserves explicit dependencies and deduplicates the parent", () => {
    const parent = makeEntry("Parent 🆔 parent", 4);
    const child = makeEntry("Child 🆔 child ⛔ explicit ⛔ parent", 5, 4);

    addImplicitNestingDependencies([parent, child]);

    expect(child.task.incomingLinks).toEqual(["explicit", "parent"]);
  });

  it("does not connect tasks from different files with matching line numbers", () => {
    const parent = makeEntry("Parent 🆔 parent", 4, undefined, "one.md");
    const child = makeEntry("Child 🆔 child", 5, 4, "two.md");

    addImplicitNestingDependencies([parent, child]);

    expect(child.task.incomingLinks).toEqual([]);
  });

  it("ignores a parent list item that is not present as a task", () => {
    const child = makeEntry("Child 🆔 child", 5, 4);

    addImplicitNestingDependencies([child]);

    expect(child.task.incomingLinks).toEqual([]);
  });

  it("supports a parent task on the first source line", () => {
    const parent = makeEntry("Parent 🆔 parent", 0);
    const child = makeEntry("Child 🆔 child", 1, 0);

    addImplicitNestingDependencies([parent, child]);

    expect(child.task.incomingLinks).toEqual(["parent"]);
  });

  it("uses a virtual Jira ID for an inferred nesting dependency", () => {
    const parent = makeEntry("JIRA:TILE-1234", 4);
    const child = makeEntry("Nested child", 5, 4);

    addImplicitNestingDependencies([parent, child]);

    expect(parent.task.id).toBe("TILE-1234");
    expect(parent.task.idOrigin).toBe("jira");
    expect(child.task.incomingLinks).toEqual(["TILE-1234"]);
  });
});

describe("getAllDataviewTasks", () => {
  it("adds nesting dependencies from Dataview task metadata", () => {
    const parent = makeEntry("Parent 🆔 parent", 4);
    const child = makeEntry("Child 🆔 child", 5, 4);
    const app = {
      plugins: {
        plugins: {
          dataview: {
            api: {
              pages: () => [
                {
                  file: {
                    tasks: {
                      values: [parent.rawTask, child.rawTask],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    } as unknown as App;

    const tasks = getAllDataviewTasks(app);

    expect(tasks.find((task) => task.id === "child")?.incomingLinks).toEqual([
      "parent",
    ]);
  });
});
