import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        stock: true,
        slug: true,
      }
    });

    const itemsXml = products.map((product) => {
      const escapedId = escapeXml(product.id);
      const escapedTitle = escapeXml(product.name);
      const escapedDescription = escapeXml(product.description || '');
      const escapedLink = escapeXml(`https://www.pureable.in/product/${product.slug || product.id}`);
      
      const mainImage = product.images && product.images[0] ? product.images[0] : 'https://www.pureable.in/og-image.jpg';
      const escapedImageLink = escapeXml(mainImage);
      
      const priceString = `${product.price.toFixed(2)} INR`;
      const availability = product.stock > 0 ? 'in_stock' : 'out_of_stock';

      return `
    <item>
      <g:id>${escapedId}</g:id>
      <g:title>${escapedTitle}</g:title>
      <g:description>${escapedDescription}</g:description>
      <g:link>${escapedLink}</g:link>
      <g:image_link>${escapedImageLink}</g:image_link>
      <g:price>${priceString}</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>Pureable</g:brand>
      <g:condition>new</g:condition>
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Pureable Product Feed</title>
    <link>https://www.pureable.in</link>
    <description>Entirely True. Entirely You. Natural Skincare.</description>${itemsXml}
  </channel>
</rss>
`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating product feed:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><error>Internal Server Error</error>', {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
