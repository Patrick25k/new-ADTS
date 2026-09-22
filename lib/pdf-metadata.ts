/**
 * Simple PDF metadata extraction
 * Extracts page count by scanning the raw PDF bytes for the page tree.
 *
 * This intentionally avoids decoding the whole file to a JS string and
 * avoids regex with unbounded lazy quantifiers (`[\s\S]*?`) over that
 * string: on large PDFs (tens/hundreds of MB) that combination can trigger
 * catastrophic backtracking and block Node's single event loop for a very
 * long time, which looks like a hung upload with no error to the user.
 * Buffer.indexOf is a native, linear-time search and is safe at any size.
 */

const MAX_FALLBACK_SCAN_BYTES = 20 * 1024 * 1024 // cap the /Page counting fallback to the first 20 MB

export async function extractPDFMetadata(buffer: Buffer): Promise<{
  pages: number;
}> {
  try {
    const pages = extractPageCount(buffer);
    return { pages };
  } catch (error) {
    console.warn('Failed to extract PDF metadata:', error);
    return { pages: 0 };
  }
}

function extractPageCount(buf: Buffer): number {
  const countFromPagesDict = findCountNearPagesDict(buf);
  if (countFromPagesDict !== null) {
    return countFromPagesDict;
  }

  const pageObjectCount = countPageObjects(buf);
  if (pageObjectCount > 0) {
    return pageObjectCount;
  }

  // Fallback: estimate based on file size (rough average of 5KB per page)
  return Math.max(1, Math.round(buf.length / 5000));
}

function findCountNearPagesDict(buf: Buffer): number | null {
  const markers = ['/Type/Pages', '/Type /Pages'];
  for (const marker of markers) {
    const idx = buf.indexOf(marker, 0, 'latin1');
    if (idx === -1) continue;

    const windowEnd = Math.min(buf.length, idx + 500);
    const window = buf.toString('latin1', idx, windowEnd);
    const match = window.match(/\/Count\s+(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return null;
}

function countPageObjects(buf: Buffer): number {
  const needle = '/Type/Page';
  const needleSpaced = '/Type /Page';
  const scanLimit = Math.min(buf.length, MAX_FALLBACK_SCAN_BYTES);

  let count = 0;
  for (const pattern of [needle, needleSpaced]) {
    let searchIdx = 0;
    while (searchIdx < scanLimit) {
      const found = buf.indexOf(pattern, searchIdx, 'latin1');
      if (found === -1 || found >= scanLimit) break;

      const nextChar = buf[found + pattern.length];
      if (nextChar !== 0x73 /* 's' -> would be "/Type/Pages" */) {
        count++;
      }
      searchIdx = found + pattern.length;
    }
    if (count > 0) break;
  }

  return count;
}
