import { PDFDocument, PDFPage, rgb } from 'pdf-lib';

/**
 * Merge signature into a PDF document
 */
export const mergeSignatureIntoPdf = async (
  pdfBytes: Uint8Array | ArrayBuffer,
  signatureImageData: string, // Base64 data URL from signature canvas
  x: number = 100, // X position on page
  y: number = 100  // Y position on page
): Promise<Uint8Array> => {
  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Convert signature image (data URL) to PNG bytes
  const signatureImageBytes = await fetch(signatureImageData).then((res) =>
    res.arrayBuffer()
  );
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

  // Get the first page (or you can specify which page)
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get page dimensions
  const { width, height } = firstPage.getSize();

  // Draw the signature image on the page
  // Adjust position as needed (coordinates are from bottom-left)
  firstPage.drawImage(signatureImage, {
    x: x,
    y: height - y - signatureImage.height, // Adjust for bottom-left origin
    width: signatureImage.width,
    height: signatureImage.height,
  });

  // Save the PDF
  const pdfBytesWithSignature = await pdfDoc.save();
  return pdfBytesWithSignature;
};

/**
 * Create a simple PDF document (for testing)
 */
export const createSimplePdf = async (text: string): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size

  page.drawText(text, {
    x: 50,
    y: 750,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

