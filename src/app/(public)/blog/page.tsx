import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import TagFilter from "./tag-filter";
import type { BlogPost } from '@prisma/client';

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const activeTag = tag ?? null;

  let posts: BlogPost[] = [];
  try {
    if (activeTag) {
      posts = await prisma.blogPost.findMany({
        where: {
          published: true,
          tags: { has: activeTag },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch {
    posts = [];
  }

  // Get all unique tags for the filter dropdown
  let allTags: string[] = [];
  try {
    const allPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    });
    const tagSet = new Set<string>();
    allPosts.forEach((p) => p.tags?.forEach((t: string) => tagSet.add(t)));
    allTags = Array.from(tagSet).sort();
  } catch {
    allTags = [];
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <section className="py-20 bg-linear-to-b from-primary-900 to-primary-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Blog Legal</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white mb-6">
            Conocimiento Legal para su Negocio
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Artículos sobre propiedad intelectual, contratos empresariales y otros temas legales relevantes en Guatemala
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tag filter dropdown */}
          <TagFilter allTags={allTags} activeTag={activeTag} />

          {posts.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              {activeTag
                ? `No hay artículos publicados con el tema "${activeTag}".`
                : 'No hay artículos publicados aún.'}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {posts.map((post: BlogPost) => (
                <Link
                  key={post?.slug}
                  href={`/blog/${post?.slug ?? ''}`}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group"
                >
                  <div className="aspect-3/2 relative bg-gray-100">
                    {post?.image ? (
                      <Image
                        src={post.image}
                        alt={post?.title ?? 'Artículo'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <BookOpen className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary-700" />
                        <span>{post?.date ?? ''}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-primary-900 mb-4 group-hover:text-primary-700 transition-colors">
                      {post?.title ?? 'Título'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {post?.summary ?? ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post?.tags?.map?.((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      )) ?? null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
