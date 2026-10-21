import type { Metadata } from "next";
import {
  Card,
  CardGrid,
  CardHeader,
  Container,
  Meta,
  OutboundLink,
  PageTitle,
  formatDate,
} from "@/components/ui";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and blog posts, with links to the full text.",
};

/**
 * Blog posts only.
 *
 * Research papers moved to /building/publications, so they appear in exactly
 * one place. Writing is now unambiguously "things I wrote on Medium".
 */
export default async function WritingPage() {
  const posts = await getBlogPosts();

  return (
    <Container wide>
      <PageTitle
        title="writing"
        intro="Articles and blog posts, with links to the full text."
      />

      {posts.length === 0 ? (
        <p className="text-ink-muted">Nothing published yet.</p>
      ) : (
        <div className="pt-4">
          <CardGrid>
            {posts.map((post) => (
              <Card key={post.slug}>
                {/* Naming the publication is the whole reason the field
                    exists — an edited publication accepted the piece, which
                    the URL says only to someone reading it carefully. */}
                <CardHeader
                  title={post.title}
                  meta={
                    <Meta>
                      {post.publication ? `${post.publication} · ` : null}
                      {formatDate(post.publishedOn)}
                    </Meta>
                  }
                />
                {/*
                  The summary is the point: a visitor who never clicks through
                  should still learn what the post argues.
                */}
                <p className="mt-2.5 text-sm text-ink-muted">{post.summary}</p>
                <div className="mt-4 text-sm">
                  <OutboundLink href={post.url}>Read on Medium</OutboundLink>
                </div>
              </Card>
            ))}
          </CardGrid>
        </div>
      )}
    </Container>
  );
}
