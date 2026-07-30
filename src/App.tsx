import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Text';
import {Text} from '@astryxdesign/core/Text';

export function App() {
  return (
    <VStack gap={4} padding={6}>
      <Heading level={1}>goalrail</Heading>
      <Text type="supporting">Theme smoke test.</Text>
    </VStack>
  );
}
