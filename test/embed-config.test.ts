import { DEFAULT_EMBED_CONFIG } from "../src/types/embed-config";

describe("DEFAULT_EMBED_CONFIG", () => {
  it("shows standalone tasks on the graph by default", () => {
    expect(DEFAULT_EMBED_CONFIG.hideUnlinkedTasks).toBe(false);
  });
});
