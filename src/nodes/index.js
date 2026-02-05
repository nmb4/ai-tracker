import ModelNode from './ModelNode';
import ProviderNode from './ProviderNode';
import ToolNode from './ToolNode';
import BlankNode from './BlankNode';
import SectionNode from './SectionNode';

export const nodeTypes = {
  model: ModelNode,
  provider: ProviderNode,
  tool: ToolNode,
  blank: BlankNode,
  section: SectionNode,
};
