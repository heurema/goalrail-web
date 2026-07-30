/**
 * The documentation view.
 *
 * The markdown under public/docs is the source, served as-is at /docs/<page>.md
 * for agents and rendered here for people. Nothing is authored twice: this view
 * fetches the same bytes an agent would, so the two readers cannot drift apart.
 */

import {useEffect, useState} from 'react';
import {marked} from 'marked';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
  LayoutPanel,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Divider} from '@astryxdesign/core/Divider';
import {Link} from '@astryxdesign/core/Link';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {DOC_PAGES, REPO_URL, SPEC_URL} from './content';

export function Docs({
  page,
  mode,
  onModeChange,
}: {
  page: string;
  mode: 'dark' | 'light';
  onModeChange: (mode: 'dark' | 'light') => void;
}) {
  const [html, setHtml] = useState('');
  const current = DOC_PAGES.find((entry) => entry.slug === page) ?? DOC_PAGES[0];

  useEffect(() => {
    let cancelled = false;
    void fetch(`/docs/${current.slug}.md`)
      .then((response) => response.text())
      .then(async (body) => {
        // The page title is already rendered in the header, so the source's own
        // H1 is dropped rather than shown twice. The markdown keeps it: the file
        // is served raw to agents, where a document without a title is worse.
        const withoutTitle = body.replace(/^#\s+.+\n+/, '');
        const rendered = await marked.parse(withoutTitle);
        if (!cancelled) setHtml(rendered);
      });
    return () => {
      cancelled = true;
    };
  }, [current.slug]);

  return (
    <Layout
      start={
        <LayoutPanel role="navigation" width={220}>
          <VStack gap={4} padding={5}>
            <Link href="/">
              <Text type="code" color="secondary">
                goalrail
              </Text>
            </Link>
            <VStack gap={2}>
              {DOC_PAGES.map((entry) => (
                <Link key={entry.slug} href={`/docs/${entry.slug}`}>
                  <Text
                    type="body"
                    color={entry.slug === current.slug ? 'primary' : 'secondary'}>
                    {entry.title}
                  </Text>
                </Link>
              ))}
            </VStack>
            <Divider />
            <VStack gap={2}>
              <Link href={SPEC_URL}>
                <Text type="supporting" color="secondary">
                  Specifications
                </Text>
              </Link>
              <Link href={REPO_URL}>
                <Text type="supporting" color="secondary">
                  GitHub
                </Text>
              </Link>
              <Link href={`/docs/${current.slug}.md`}>
                <Text type="supporting" color="secondary">
                  This page as markdown
                </Text>
              </Link>
            </VStack>
          </VStack>
        </LayoutPanel>
      }
      content={
        <LayoutContent padding={8} isScrollable>
          <VStack gap={6} maxWidth={760}>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Heading level={1}>{current.title}</Heading>
              </StackItem>
              <SegmentedControl
                label="Colour mode"
                value={mode}
                size="sm"
                onChange={(next) => onModeChange(next as 'dark' | 'light')}>
                <SegmentedControlItem value="dark" label="dark" />
                <SegmentedControlItem value="light" label="light" />
              </SegmentedControl>
            </HStack>
            <div className="prose" dangerouslySetInnerHTML={{__html: html}} />
          </VStack>
        </LayoutContent>
      }
    />
  );
}
