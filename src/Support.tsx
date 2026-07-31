/**
 * Sponsorship.
 *
 * Kept off the landing page on purpose. The argument there has one job, and a
 * page that asks for money while making its case does both worse. This is a
 * quiet link in the colophon that costs nothing to ignore.
 *
 * The page's real problem is not persuasion, it is care. An address copied
 * wrong, or used on a network it was not issued for, loses the money
 * irreversibly and silently, so three things are deliberate:
 *
 * The codes are generated in the browser from the same string the page prints.
 * A build step that emitted images could drift from the text beside them; this
 * cannot, because there is only one value.
 *
 * One row is open at a time. Several codes at once is a scanning hazard, not a
 * feature — a phone camera happily locks onto whichever is nearest.
 *
 * The group is controlled rather than left to itself because a collapsed
 * Collapsible still mounts its children. Uncontrolled, every row built its code
 * on load, which both defeated the on-demand import and generated codes nobody
 * had asked to see. Only the open row is rendered.
 *
 * The code is always dark on light, in both colour modes. An inverted code is
 * within the specification and most scanners still refuse it.
 */

import {useEffect, useState} from 'react';
import {
  VStack,
  HStack,
  StackItem,
  Layout,
  LayoutContent,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {Divider} from '@astryxdesign/core/Divider';
import {Link} from '@astryxdesign/core/Link';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import type {CSSProperties} from 'react';
import {
  SUPPORT_BODY,
  SUPPORT_NETWORK_WARNING,
  SUPPORT_NOT_BUYING,
  SUPPORT_TITLE,
  WALLETS,
  type Wallet,
} from './content';

const page: CSSProperties = {
  maxWidth: 620,
  marginInline: 'auto',
  width: '100%',
};

function QrCode({value}: {value: string}) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    // Loaded only once a row is opened, and only ever from the address this
    // component was handed.
    void import('uqr').then(({renderSVG}) => {
      if (!live) return;
      setSvg(
        renderSVG(value, {
          // Correction level M survives the reflections and angles a phone
          // actually photographs a screen at. The default, L, does not.
          ecc: 'M',
          // The quiet zone is part of the specification rather than margin:
          // without it a scanner cannot find the code's edge. uqr's default of
          // 1 module is below the 4 the standard asks for.
          border: 4,
          // Fixed, not themed. An inverted code is legal and most scanners
          // still refuse it, so it stays dark on light in both colour modes.
          whiteColor: '#ffffff',
          blackColor: '#000000',
        }),
      );
    });
    return () => {
      live = false;
    };
  }, [value]);

  return (
    <div className="qr" aria-hidden="true">
      {svg ? <div dangerouslySetInnerHTML={{__html: svg}} /> : null}
    </div>
  );
}

function WalletPanel({wallet}: {wallet: Wallet}) {
  const [copied, setCopied] = useState(false);

  return (
    <VStack gap={4}>
      <QrCode value={wallet.address} />
      <VStack gap={2}>
        {/* Never truncated and never abbreviated with an ellipsis: checking the
            first and last characters against a wallet is the only defence a
            sender has, and it needs the whole string. */}
        <Text type="code" color="primary" wordBreak="break-all">
          {wallet.address}
        </Text>
        <HStack gap={3} vAlign="center">
          <Button
            label={copied ? 'Copied' : 'Copy address'}
            variant="secondary"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(wallet.address);
              setCopied(true);
            }}
          />
          {wallet.note ? (
            <StackItem size="fill">
              <Text type="supporting" color="secondary">
                {wallet.note}
              </Text>
            </StackItem>
          ) : null}
        </HStack>
      </VStack>
    </VStack>
  );
}

export function Support({
  mode,
  onModeChange,
}: {
  mode: 'dark' | 'light';
  onModeChange: (mode: 'dark' | 'light') => void;
}) {
  const [open, setOpen] = useState('');

  return (
    <Layout
      content={
        <LayoutContent padding={8}>
          <VStack gap={8} style={page}>
            <HStack gap={3} vAlign="center">
              <StackItem size="fill">
                <Link href="/">
                  <Text type="code" color="secondary">
                    goalrail
                  </Text>
                </Link>
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

            <VStack gap={3}>
              <Heading level={1} type="display-3" textWrap="balance">
                {SUPPORT_TITLE}
              </Heading>
              <Text type="body" color="secondary">
                {SUPPORT_BODY}
              </Text>
              <Text type="body" color="secondary">
                {SUPPORT_NOT_BUYING}
              </Text>
            </VStack>

            <CollapsibleGroup
              type="single"
              hasDividers
              value={open}
              onChange={(next) => setOpen(next as string)}>
              {WALLETS.map((wallet) => (
                <Collapsible
                  key={wallet.network}
                  value={wallet.network}
                  trigger={
                    <HStack gap={3} vAlign="center">
                      <StackItem size="fill">
                        <Text type="body">{wallet.network}</Text>
                      </StackItem>
                      <Text type="code" color="secondary">
                        {wallet.symbol}
                      </Text>
                    </HStack>
                  }>
                  {open === wallet.network ? (
                    <WalletPanel wallet={wallet} />
                  ) : null}
                </Collapsible>
              ))}
            </CollapsibleGroup>

            <VStack gap={3}>
              <Divider />
              <Text type="supporting" color="secondary">
                {SUPPORT_NETWORK_WARNING}
              </Text>
            </VStack>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
