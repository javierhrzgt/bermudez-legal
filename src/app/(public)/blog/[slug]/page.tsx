import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ShareButton from "./share-button";
import type { BlogPost } from '@prisma/client';

export const dynamic = "force-dynamic";

function formatBlogContent(content: string): string {
  const lines = content.split('\n');
  const html: string[] = [];
  let inList = false;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join('<br />');
      if (text.trim()) {
        html.push(`<p class="mb-6 text-gray-700 leading-relaxed">${text}</p>`);
      }
      paragraphBuffer = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  const formatInline = (text: string): string => {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary-900">$1</strong>');
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line — flush current paragraph
    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    // H2 heading
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      closeList();
      const heading = formatInline(trimmed.slice(3));
      html.push(`<h2 class="text-3xl font-serif font-bold text-primary-900 mt-12 mb-6">${heading}</h2>`);
      continue;
    }

    // H3 heading
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      closeList();
      const heading = formatInline(trimmed.slice(4));
      html.push(`<h3 class="text-2xl font-serif font-semibold text-primary-900 mt-8 mb-4">${heading}</h3>`);
      continue;
    }

    // List item
    if (trimmed.startsWith('- ')) {
      flushParagraph();
      if (!inList) {
        html.push('<ul class="list-disc list-inside space-y-2 mb-6 text-gray-700 pl-2">');
        inList = true;
      }
      html.push(`<li class="leading-relaxed">${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Regular text — accumulate into paragraph
    closeList();
    paragraphBuffer.push(formatInline(trimmed));
  }

  flushParagraph();
  closeList();

  return html.join('\n');
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: slug ?? '', published: true },
    });
  } catch {
    post = null;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 mb-8 font-medium group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Blog</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-700" />
              <span>{post?.date ?? ''}</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-900 mb-6 leading-tight">
            {post?.title ?? 'Título'}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post?.summary ?? ''}
          </p>

          <div className="flex items-center justify-between pb-8 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post?.tags?.map?.((tag: string, index: number) => (
                <Link
                  key={index}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </Link>
              )) ?? null}
            </div>
            <ShareButton title={post?.title ?? ''} />
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {post?.image && (
            <div className="aspect-[3/2] relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <Image
                src={post.image}
                alt={post?.title ?? 'Artículo'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <article className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: formatBlogContent(post?.content ?? '')
              }}
            />
          </div>
        </div>
      </article>

      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            ¿Necesita Asesoría Legal?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Estamos aquí para ayudarle con sus necesidades legales
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-lg"
          >
            <span>Agendar Consulta</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
