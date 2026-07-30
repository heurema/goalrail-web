/**
 * The landing page.
 *
 * Composition is adapted from two Astryx reference templates rather than
 * invented: `centered-hero` supplies the frame and the 10/6/3 spacing rhythm,
 * `documentation-technical` supplies the AI-prompt card — a labelled card whose
 * primary control copies a prompt for an agent, which is exactly this product's
 * install path. Both are kept under src/reference for comparison.
 *
 * The rule the first draft broke: an artifact is evidence, not copy. The page
 * leads with one sentence an agent wrote. The file it wrote lives behind a
 * disclosure near the bottom, for a reader who wants proof after they are
 * already interested.
 */

import {useState} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Link} from '@astryxdesign/core/Link';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import type {CSSProperties} from 'react';
import {
  AGENT_ASKED,
  AGENT_ATTRIBUTION,
  AGENT_QUESTION,
  CONTACT_URL,
  DOCTOR_LABEL,
  DOCTOR_OUTPUT,
  EVIDENCE_LABEL,
  FACTS,
  HEADLINE,
  INSTALL_PROMPT,
  PROMPT_LABEL,
  PROMPT_NOTE,
  REPO_URL,
  SPEC_URL,
  WALLETS,
  STATUS,
  SUBHEAD,
} from './content';

const page: CSSProperties = {
  maxWidth: 820,
  marginInline: 'auto',
  width: '100%',
};

/** The hero sits closer to the masthead than the rest of the rhythm allows. */
const hero: CSSProperties = {marginBlockStart: 'var(--spacing-2)'};

export function App({
  mode,
  onModeChange,
}: {
  mode: 'dark' | 'light';
  onModeChange: (mode: 'dark' | 'light') => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Layout
      content={
        <LayoutContent padding={8}>
          <VStack gap={8} style={page}>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Text type="code" color="secondary">
                  goalrail
                </Text>
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

            <VStack gap={6} style={hero}>
              <VStack gap={3}>
                <Heading level={1} type="display-2" textWrap="balance">
                  {AGENT_ASKED}
                </Heading>
                <Text type="body" color="secondary">
                  — {AGENT_ATTRIBUTION}
                </Text>
              </VStack>
              <VStack gap={1}>
                <Text type="large">{HEADLINE}</Text>
                <Text type="body" color="secondary">
                  {SUBHEAD}
                </Text>
              </VStack>
            </VStack>

            <Card>
              <VStack gap={3}>
                <HStack gap={2} vAlign="center">
                  <StackItem size="fill">
                    <Text type="body" weight="semibold">
                      {PROMPT_LABEL}
                    </Text>
                  </StackItem>
                  <Button
                    label={copied ? 'Copied' : 'Copy prompt'}
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(INSTALL_PROMPT);
                      setCopied(true);
                    }}
                  />
                </HStack>
                <Text type="code" color="secondary">
                  {INSTALL_PROMPT}
                </Text>
                <Divider />
                <Text type="supporting" color="secondary">
                  {PROMPT_NOTE}
                </Text>
                <Text type="supporting" color="secondary">
                  {STATUS}
                </Text>
              </VStack>
            </Card>

            <Grid gap={3} columns={{minWidth: 220}}>
              {FACTS.map((fact) => (
                <VStack key={fact.term} gap={1}>
                  <Text type="body" weight="semibold">
                    {fact.term}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {fact.line}
                  </Text>
                </VStack>
              ))}
            </Grid>

            <VStack gap={3}>
              <Collapsible
                defaultIsOpen={false}
                trigger={<Text type="body">{EVIDENCE_LABEL}</Text>}>
                <CodeBlock
                  code={AGENT_QUESTION}
                  language="markdown"
                  title=".goalrail/blocked.md"
                  width="100%"
                  size="sm"
                  hasCopyButton={false}
                />
              </Collapsible>
              <Collapsible
                defaultIsOpen={false}
                trigger={<Text type="body">{DOCTOR_LABEL}</Text>}>
                <CodeBlock
                  code={DOCTOR_OUTPUT}
                  language="plaintext"
                  title="gr doctor"
                  width="100%"
                  size="sm"
                  isWrapped
                  hasCopyButton={false}
                />
              </Collapsible>
              <Divider />
            </VStack>

            <HStack gap={4} vAlign="center">
              <StackItem size="fill">
                <Text type="supporting" color="secondary">
                  Founder-led. <Link href={CONTACT_URL}>Talk to us</Link>
                </Text>
              </StackItem>
              <HStack gap={4}>
                {/* Wrapped so the links inherit the footer's size — a bare Link
                    renders at base and left the row visibly lopsided. */}
                <Text type="supporting">
                  <Link href={SPEC_URL}>Read the specification</Link>
                </Text>
                <Text type="supporting">
                  <Link href={REPO_URL}>GitHub</Link>
                </Text>
                {/* Hidden until there is an address to show. A support link
                    that leads to an empty page asks twice and answers once. */}
                {WALLETS.length > 0 ? (
                  <Text type="supporting">
                    <Link href="/support">Sponsor</Link>
                  </Text>
                ) : null}
              </HStack>
            </HStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
