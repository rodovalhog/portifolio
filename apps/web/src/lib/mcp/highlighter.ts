/**
 * Highlights a resource in the active DOM when targeted by the WebMCP agent.
 * Applies a pulsating emerald glow, smooth scroll into view, and a floating indicator badge.
 */
export function highlightMCPResource(resourceId: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const cleanId = resourceId.trim().replace(/^#/, "");

  // Priority selectors to match DOM nodes
  const selectors = [
    `[data-mcp-id="${cleanId}"]`,
    `[data-mcp-resource="${cleanId}"]`,
    `#mcp-${cleanId}`,
    `#${cleanId}`,
    `[data-mcp-section="${cleanId}"]`,
  ];

  let targetElement: HTMLElement | null = null;
  for (const selector of selectors) {
    try {
      const match = document.querySelector<HTMLElement>(selector);
      if (match) {
        targetElement = match;
        break;
      }
    } catch {
      // ignore selector syntax errors
    }
  }

  if (!targetElement) {
    return false;
  }

  // Smoothly center the element in view
  targetElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });

  // Remove previous highlights
  document.querySelectorAll(".mcp-highlight-pulse").forEach((el) => {
    el.classList.remove("mcp-highlight-pulse");
  });
  document.querySelectorAll(".mcp-highlight-badge").forEach((el) => {
    el.remove();
  });

  // Add highlighting class
  targetElement.classList.add("mcp-highlight-pulse");

  // Create temporary floating badge
  const badge = document.createElement("div");
  badge.className = "mcp-highlight-badge";
  badge.innerHTML = `
    <span class="mcp-badge-icon">✦</span>
    <span>Recurso WebMCP identificado</span>
  `;

  const originalPosition = window.getComputedStyle(targetElement).position;
  if (originalPosition === "static") {
    targetElement.style.position = "relative";
  }
  targetElement.appendChild(badge);

  // Auto-remove after 4.5 seconds
  setTimeout(() => {
    targetElement?.classList.remove("mcp-highlight-pulse");
    badge.remove();
    if (originalPosition === "static") {
      targetElement.style.position = "";
    }
  }, 4500);

  return true;
}
