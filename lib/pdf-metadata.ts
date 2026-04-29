/**
 * Simple PDF metadata extraction
 * Extracts page count by parsing PDF structure
 */

export async function extractPDFMetadata(file: Blob): Promise<{
  pages: number;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const pages = extractPageCount(buffer);
    return { pages };
  } catch (error) {
    console.warn('Failed to extract PDF metadata:', error);
    return { pages: 0 };
  }
}

function extractPageCount(buffer: ArrayBuffer): number {
  const uint8Array = new Uint8Array(buffer);
  const text = new TextDecoder().decode(uint8Array);

  // Try to find /Type /Pages and /Count
  const pagesMatch = text.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s*(\d+)/);
  if (pagesMatch && pagesMatch[1]) {
    return parseInt(pagesMatch[1], 10);
  }

  // Fallback: count /Page objects (less reliable but works for simple PDFs)
  const pageMatches = text.match(/\/Type\s*\/Page[\s\S]*?(?=\/Type|\nendobj|$)/g);
  if (pageMatches) {
    return pageMatches.length;
  }

  // Fallback: estimate based on file size (rough average of 5KB per page)
  const estimatedPages = Math.max(1, Math.round(buffer.byteLength / 5000));
  return estimatedPages;
}
