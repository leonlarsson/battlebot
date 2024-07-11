import { type APIActionRowComponent, type APIButtonComponent, ButtonStyle, ComponentType } from "discord.js";

export const buildLinkButton = (label: string, url: string): APIButtonComponent => ({
  type: ComponentType.Button,
  style: ButtonStyle.Link,
  label: label,
  url: url,
});

export const buildDangerButton = (label: string, custom_id: string): APIButtonComponent => ({
  type: ComponentType.Button,
  style: ButtonStyle.Danger,
  label: label,
  custom_id,
});

export const buildSuccessButton = (label: string, custom_id: string): APIButtonComponent => ({
  type: ComponentType.Button,
  style: ButtonStyle.Success,
  label: label,
  custom_id,
});
