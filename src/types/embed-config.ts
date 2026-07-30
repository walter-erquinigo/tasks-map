export interface EmbedConfig {
  height: number;
  showMinimap: boolean;
  showFilterPanel: boolean;
  showPresetsPanel: boolean;
  showUnlinkedPanel: boolean;
  hideUnlinkedTasks: boolean;
  showStatusCounts: boolean;
  showViewPanel: boolean;
  hideTagsOnNodes: boolean;
}

export const DEFAULT_EMBED_CONFIG: EmbedConfig = {
  height: 400,
  showMinimap: true,
  showFilterPanel: true,
  showPresetsPanel: true,
  showUnlinkedPanel: true,
  hideUnlinkedTasks: false,
  showStatusCounts: true,
  showViewPanel: true,
  hideTagsOnNodes: false,
};
