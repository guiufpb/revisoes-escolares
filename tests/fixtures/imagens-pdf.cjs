'use strict';
// Original 32x32 checkerboard, losslessly encoded with Pillow/OpenJPEG and libtiff.
// No school PDF/image source. Keep encoded samples so tests need no Python runtime.
const encoded = {
  jpx: 'AAAADGpQICANCocKAAAAFGZ0eXBqcDIgAAAAAGpwMiAAAAAtanAyaAAAABZpaGRyAAAAIAAAACAAAQcHAAAAAAAPY29scgEAAAAAABEAAAIoanAyY/9P/1EAKQAAAAAAIAAAACAAAAAAAAAAAAAAACAAAAAgAAAAAAAAAAAAAQcBAf9SAAwAAAABAAUEBAAB/1wAE0BASEhQSEhQSEhQSEhQSEhQ/2QAJQABQ3JlYXRlZCBieSBPcGVuSlBFRyB2ZXJzaW9uIDIuNS40/5AACgAAAAABpwAB/5PB8gEIw+oCh9QFD7QIBH8EfwWPz8AWfgDT8wUE/Mi8qgTd4U2Tfwb7VHjTz8BKfgJR+AkAEqynhhLtLoud1ekbMZ4SZv4PEHlq8Q85xH6VthCccN3NiKtvEG5Wu0sUIIPYDO8pjdLbs4J+z8C+fgYx+BOAFwUZuYXDdRY1FjmkuiuPje51rN7Tcx/pCGYASf8smuhZTJg8+NIAz1pcXYgXEYQMGhXigksSQx8sPk33kPoZzsOFX9zRFEMRzNQh8JcXc3Ms2DpkDaEtV5cnq1IQ8hGLFdipPVTktnebPZLhEkrZG20aVbBp/xe3sN3T4CjJ/bwnl1od7bp/z8EGfggR+AqAJMc8R7nYEfvZHkNeF/7m5VjyE9stHAqdufLc83YFrdfN838i2+b5vm+b94sfN83zfN+iu3m+b5vm/OZPm+b5vm8kwJCAWYHUzfon9/lpthItB8qEnpGKzOpt8W17Ud+j6KrgTagAG7leR4cH0j6sbiPDgF6fVjcR4b5wH6sbiPDfOJvFA7/2vv53BYbfBCBE3O9YQis//9k=',
  ccitt: 'MxTMX////yaimYv/////5mKZi////+TUUzF//////ABABA==',
};
function imagePdf(codec, pages = 1) {
  if (!Object.hasOwn(encoded, codec)) throw new Error('Unknown synthetic image codec');
  const bytes = Buffer.from(encoded[codec], 'base64');
  const filter = codec === 'jpx' ? '/JPXDecode' : '/CCITTFaxDecode';
  const extra =
    codec === 'ccitt' ? '/DecodeParms << /K -1 /Columns 32 /Rows 32 /BlackIs1 false >>' : '';
  const objects = [
    null,
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),
    null,
    Buffer.concat([
      Buffer.from(
        `<< /Type /XObject /Subtype /Image /Width 32 /Height 32 /ColorSpace /DeviceGray /BitsPerComponent ${codec === 'jpx' ? 8 : 1} /Filter ${filter} ${extra} /Length ${bytes.length} >>\nstream\n`
      ),
      bytes,
      Buffer.from('\nendstream'),
    ]),
  ];
  const kids = [];
  for (let page = 0; page < pages; page++) {
    const index = objects.length;
    kids.push(`${index} 0 R`);
    objects.push(
      Buffer.from(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] /Resources << /XObject << /Im0 3 0 R >> >> /Contents ${index + 1} 0 R >>`
      )
    );
    const stream = 'q 100 0 0 100 0 0 cm /Im0 Do Q';
    objects.push(Buffer.from(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`));
  }
  objects[2] = Buffer.from(`<< /Type /Pages /Count ${pages} /Kids [${kids.join(' ')}] >>`);
  const chunks = [Buffer.from('%PDF-1.5\n')],
    offsets = [0];
  let length = chunks[0].length;
  for (let index = 1; index < objects.length; index++) {
    offsets.push(length);
    const chunk = Buffer.concat([
      Buffer.from(`${index} 0 obj\n`),
      objects[index],
      Buffer.from('\nendobj\n'),
    ]);
    chunks.push(chunk);
    length += chunk.length;
  }
  const xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => String(n).padStart(10, '0') + ' 00000 n \n')
    .join('')}trailer << /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${length}\n%%EOF\n`;
  return Buffer.concat([...chunks, Buffer.from(xref)]);
}
module.exports = { imagePdf };
